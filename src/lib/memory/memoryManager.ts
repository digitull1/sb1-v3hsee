import { get, set } from 'idb-keyval';
import type { Message, User, Topic } from '../../types';

interface MemoryStore {
  shortTerm: {
    messages: Message[];
    context: string[];
    currentTopic: string | null;
  };
  longTerm: {
    topics: Topic[];
    interactions: {
      timestamp: number;
      topic: string;
      success: boolean;
    }[];
    preferences: {
      favoriteTopics: string[];
      lastInteractions: {
        topic: string;
        timestamp: number;
      }[];
    };
  };
}

class MemoryManager {
  private store: MemoryStore = {
    shortTerm: {
      messages: [],
      context: [],
      currentTopic: null,
    },
    longTerm: {
      topics: [],
      interactions: [],
      preferences: {
        favoriteTopics: [],
        lastInteractions: [],
      },
    },
  };

  private userId: string | null = null;

  async initialize(user: User) {
    this.userId = user.name;
    try {
      const stored = await get(`memory-${this.userId}`);
      if (stored) {
        this.store.longTerm = {
          ...this.store.longTerm,
          ...stored,
          preferences: {
            favoriteTopics: stored.preferences?.favoriteTopics || [],
            lastInteractions: stored.preferences?.lastInteractions || [],
          },
        };
      }
    } catch (error) {
      console.error('Error loading memory:', error);
    }
  }

  addMessage(message: Message) {
    if (!message) return;

    this.store.shortTerm.messages.push(message);
    if (this.store.shortTerm.messages.length > 10) {
      this.store.shortTerm.messages.shift();
    }

    const topic = this.extractTopic(message.content);
    if (topic) {
      this.updateTopicInteraction(topic);
    }
  }

  addContext(context: string) {
    if (!context) return;

    this.store.shortTerm.context.push(context);
    if (this.store.shortTerm.context.length > 5) {
      this.store.shortTerm.context.shift();
    }
  }

  private extractTopic(content: string): string | null {
    if (!content) return null;

    const topics = [
      'science', 'history', 'math', 'art',
      'geography', 'literature', 'music',
      'technology', 'space', 'nature'
    ];
    
    const lowercaseContent = content.toLowerCase();
    return topics.find(topic => lowercaseContent.includes(topic)) || null;
  }

  private updateTopicInteraction(topic: string, success: boolean = true) {
    if (!topic) return;

    // Ensure preferences object exists
    if (!this.store.longTerm.preferences) {
      this.store.longTerm.preferences = {
        favoriteTopics: [],
        lastInteractions: [],
      };
    }

    // Update interactions
    this.store.longTerm.interactions.push({
      topic,
      timestamp: Date.now(),
      success,
    });

    // Update last interactions
    const { lastInteractions } = this.store.longTerm.preferences;
    const existingIndex = lastInteractions.findIndex(i => i.topic === topic);
    
    if (existingIndex !== -1) {
      lastInteractions.splice(existingIndex, 1);
    }
    
    lastInteractions.unshift({
      topic,
      timestamp: Date.now(),
    });

    // Keep only last 5 interactions
    while (lastInteractions.length > 5) {
      lastInteractions.pop();
    }

    this.updateFavoriteTopics();
    this.persist();
  }

  private updateFavoriteTopics() {
    const topicCounts = new Map<string, number>();
    
    this.store.longTerm.interactions.forEach(({ topic }) => {
      topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
    });

    this.store.longTerm.preferences.favoriteTopics = Array.from(topicCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([topic]) => topic);
  }

  getRecentContext(): string[] {
    return this.store.shortTerm.context;
  }

  getPersonalizedGreeting(): string {
    if (!this.store.longTerm.preferences) {
      return "Ready to start our learning adventure? ✨";
    }

    const { lastInteractions, favoriteTopics } = this.store.longTerm.preferences;
    
    if (!lastInteractions || lastInteractions.length === 0) {
      return "Ready to start our learning adventure? ✨";
    }

    const lastTopic = lastInteractions[0].topic;
    const suggestedTopic = favoriteTopics.find(topic => topic !== lastTopic) || 'something new';

    return `Last time, we explored ${lastTopic}! Would you like to continue that journey or discover ${suggestedTopic}? 🌟`;
  }

  getSuggestedTopics(): string[] {
    if (!this.store.longTerm.preferences) {
      return [];
    }

    const { favoriteTopics, lastInteractions } = this.store.longTerm.preferences;
    const recentTopics = lastInteractions.map(i => i.topic);
    
    return [...new Set([...(favoriteTopics || []), ...(recentTopics || [])])].slice(0, 5);
  }

  private async persist() {
    if (!this.userId) return;
    try {
      await set(`memory-${this.userId}`, this.store.longTerm);
    } catch (error) {
      console.error('Error persisting memory:', error);
    }
  }

  clear() {
    this.store = {
      shortTerm: {
        messages: [],
        context: [],
        currentTopic: null,
      },
      longTerm: {
        topics: [],
        interactions: [],
        preferences: {
          favoriteTopics: [],
          lastInteractions: [],
        },
      },
    };
  }
}

export const memoryManager = new MemoryManager();