import { create } from 'zustand';
import type { User, Message, Achievement, TopicState } from '../types';
import { checkAchievements } from '../lib/gamification';
import { storage, StorageError } from '../lib/storage/storage';

interface Store {
  user: User | null;
  messages: Message[];
  achievements: Achievement[];
  topicState: TopicState;
  isInitialized: boolean;
  error: string | null;
  initializeApp: () => Promise<void>;
  setUser: (user: User) => Promise<void>;
  addMessage: (message: Message) => Promise<void>;
  updatePoints: (points: number) => Promise<void>;
  updateStreak: () => Promise<void>;
  addAchievement: (achievement: Achievement) => Promise<void>;
  setCurrentTopic: (topic: string | null) => void;
  incrementTopicMessageCount: () => void;
  resetTopicState: () => void;
  setError: (error: string | null) => void;
}

const initialState = {
  user: null,
  messages: [],
  achievements: [],
  isInitialized: false,
  error: null,
  topicState: {
    currentTopic: null,
    topicMessageCount: 0,
  },
};

export const useStore = create<Store>((set, get) => ({
  ...initialState,

  initializeApp: async () => {
    try {
      const state = await storage.loadInitialState();
      const lastLogin = localStorage.getItem('lastLogin');
      const today = new Date().toDateString();

      set({
        ...state,
        topicState: state.topicState || initialState.topicState,
        isInitialized: true,
        error: null,
      });

      if (lastLogin !== today && state.user) {
        await get().updateStreak();
      }
    } catch (error) {
      const message = error instanceof StorageError ? 
        error.message : 
        'Failed to initialize app. Please refresh and try again.';
      
      set({ error: message, isInitialized: true });
      throw error;
    }
  },

  setError: (error) => set({ error }),

  setUser: async (user) => {
    try {
      await storage.saveUser(user);
      localStorage.setItem('lastLogin', new Date().toDateString());
      set({ user, error: null });
    } catch (error) {
      const message = error instanceof StorageError ? 
        error.message : 
        'Failed to save user data';
      set({ error: message });
      throw error;
    }
  },

  addMessage: async (message) => {
    try {
      const messages = [...get().messages, message];
      await storage.saveMessages(messages);

      set((state) => {
        const newState: Partial<Store> = { messages };

        if (message.sender === 'assistant') {
          const topic = extractTopic(message.content);
          if (topic && topic !== state.topicState.currentTopic) {
            newState.topicState = {
              currentTopic: topic,
              topicMessageCount: 1,
            };
          } else if (topic && topic === state.topicState.currentTopic) {
            newState.topicState = {
              ...state.topicState,
              topicMessageCount: state.topicState.topicMessageCount + 1,
            };
          }
        }

        return newState;
      });

      const { topicState } = get();
      if (topicState !== initialState.topicState) {
        await storage.saveTopicState(topicState);
      }
    } catch (error) {
      const message = error instanceof StorageError ? 
        error.message : 
        'Failed to save message';
      set({ error: message });
      throw error;
    }
  },

  updatePoints: async (points) => {
    try {
      const { user, achievements } = get();
      if (!user) return;

      const newPoints = user.points + points;
      const newAchievements = checkAchievements(newPoints, user.streak);
      const newUser = { ...user, points: newPoints };

      await Promise.all([
        storage.saveUser(newUser),
        storage.saveAchievements([...achievements, ...newAchievements])
      ]);

      set({
        user: newUser,
        achievements: [...achievements, ...newAchievements],
        error: null,
      });
    } catch (error) {
      const message = error instanceof StorageError ? 
        error.message : 
        'Failed to update points';
      set({ error: message });
      throw error;
    }
  },

  updateStreak: async () => {
    try {
      const { user, achievements } = get();
      if (!user) return;

      const lastLogin = localStorage.getItem('lastLogin');
      const today = new Date().toDateString();

      if (lastLogin !== today) {
        localStorage.setItem('lastLogin', today);
        const newStreak = user.streak + 1;
        const newAchievements = checkAchievements(user.points, newStreak);
        const newUser = { ...user, streak: newStreak };

        await Promise.all([
          storage.saveUser(newUser),
          storage.saveAchievements([...achievements, ...newAchievements])
        ]);

        set({
          user: newUser,
          achievements: [...achievements, ...newAchievements],
          error: null,
        });
      }
    } catch (error) {
      const message = error instanceof StorageError ? 
        error.message : 
        'Failed to update streak';
      set({ error: message });
      throw error;
    }
  },

  addAchievement: async (achievement) => {
    try {
      const achievements = [...get().achievements, achievement];
      await storage.saveAchievements(achievements);
      set({ achievements, error: null });
    } catch (error) {
      const message = error instanceof StorageError ? 
        error.message : 
        'Failed to save achievement';
      set({ error: message });
      throw error;
    }
  },

  setCurrentTopic: (topic) => {
    set({
      topicState: {
        currentTopic: topic,
        topicMessageCount: 0,
      },
    });
  },

  incrementTopicMessageCount: () => {
    set((state) => ({
      topicState: {
        ...state.topicState,
        topicMessageCount: state.topicState.topicMessageCount + 1,
      },
    }));
  },

  resetTopicState: () => {
    set({
      topicState: initialState.topicState,
    });
  },
}));

function extractTopic(content: string): string | null {
  const topics = [
    'science', 'history', 'math', 'art', 'geography',
    'literature', 'music', 'technology', 'space', 'nature'
  ];
  
  const lowercaseContent = content.toLowerCase();
  return topics.find(topic => lowercaseContent.includes(topic)) || null;
}