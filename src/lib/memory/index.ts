import { get, set } from 'idb-keyval';
import type { Message, User } from '../../types';

interface MemoryStore {
  shortTerm: {
    messages: Message[];
    context: string[];
  };
  longTerm: {
    user: User;
    topics: string[];
    interactions: {
      timestamp: number;
      topic: string;
    }[];
  };
}

class Memory {
  private store: MemoryStore = {
    shortTerm: {
      messages: [],
      context: [],
    },
    longTerm: {
      user: {} as User,
      topics: [],
      interactions: [],
    },
  };

  async initialize(user: User) {
    // Load long-term memory from IndexedDB
    try {
      const stored = await get(`memory-${user.name}`);
      if (stored) {
        this.store.longTerm = stored;
      } else {
        this.store.longTerm.user = user;
      }
    } catch (error) {
      console.error('Error loading memory:', error);
      this.store.longTerm.user = user;
    }
  }

  addMessage(message: Message) {
    this.store.shortTerm.messages.push(message);
    if (this.store.shortTerm.messages.length > 10) {
      this.store.shortTerm.messages.shift();
    }
  }

  addContext(context: string) {
    this.store.shortTerm.context.push(context);
    if (this.store.shortTerm.context.length > 5) {
      this.store.shortTerm.context.shift();
    }
  }

  addTopic(topic: string) {
    if (!this.store.longTerm.topics.includes(topic)) {
      this.store.longTerm.topics.push(topic);
      this.store.longTerm.interactions.push({
        timestamp: Date.now(),
        topic,
      });
      this.persist();
    }
  }

  getRecentTopics(limit: number = 3): string[] {
    return this.store.longTerm.topics.slice(-limit);
  }

  getContext(): string[] {
    return this.store.shortTerm.context;
  }

  getRecentMessages(limit: number = 5): Message[] {
    return this.store.shortTerm.messages.slice(-limit);
  }

  getUserPreferences(): string[] {
    const topics = this.store.longTerm.topics;
    const interactions = this.store.longTerm.interactions;
    
    // Count topic frequencies
    const topicFrequency = topics.reduce((acc, topic) => {
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Sort by frequency
    return Object.entries(topicFrequency)
      .sort(([, a], [, b]) => b - a)
      .map(([topic]) => topic);
  }

  async persist() {
    try {
      await set(`memory-${this.store.longTerm.user.name}`, this.store.longTerm);
    } catch (error) {
      console.error('Error persisting memory:', error);
    }
  }

  clear() {
    this.store.shortTerm = {
      messages: [],
      context: [],
    };
  }
}

export const memory = new Memory();