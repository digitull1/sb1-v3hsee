import { get, set, del, clear } from 'idb-keyval';
import type { User, Message, Achievement, TopicState } from '../../types';

export class StorageError extends Error {
  constructor(
    message: string,
    public readonly code: 'QUOTA_EXCEEDED' | 'ACCESS_DENIED' | 'INITIALIZATION' | 'UNKNOWN',
    public readonly context?: any
  ) {
    super(message);
    this.name = 'StorageError';
  }

  static fromError(error: unknown): StorageError {
    if (error instanceof StorageError) {
      return error;
    }

    if (error instanceof Error) {
      if (error.name === 'QuotaExceededError') {
        return new StorageError(
          'Storage quota exceeded. Please clear some browser data.',
          'QUOTA_EXCEEDED',
          { error }
        );
      }
      if (error.message.includes('access') || error.message.includes('permission')) {
        return new StorageError(
          'Unable to access storage. Please check your browser settings.',
          'ACCESS_DENIED',
          { error }
        );
      }
    }

    return new StorageError(
      'An unexpected storage error occurred',
      'UNKNOWN',
      { error }
    );
  }
}

export class StorageService {
  private static instance: StorageService;
  private initialized = false;

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Test storage access
      const testKey = '_test_storage_';
      await set(testKey, true);
      await del(testKey);
      this.initialized = true;
    } catch (error) {
      throw new StorageError(
        'Failed to initialize storage',
        'INITIALIZATION',
        { error }
      );
    }
  }

  async loadInitialState(): Promise<{
    user: User | null;
    messages: Message[];
    achievements: Achievement[];
    topicState: TopicState | null;
  }> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const [user, messages, achievements, topicState] = await Promise.all([
        get<User>('user'),
        get<Message[]>('messages'),
        get<Achievement[]>('achievements'),
        get<TopicState>('topicState'),
      ]);

      return {
        user: user || null,
        messages: Array.isArray(messages) ? messages : [],
        achievements: Array.isArray(achievements) ? achievements : [],
        topicState: topicState || null,
      };
    } catch (error) {
      throw StorageError.fromError(error);
    }
  }

  async saveUser(user: User): Promise<void> {
    try {
      await set('user', user);
    } catch (error) {
      throw StorageError.fromError(error);
    }
  }

  async saveMessages(messages: Message[]): Promise<void> {
    try {
      await set('messages', messages);
    } catch (error) {
      throw StorageError.fromError(error);
    }
  }

  async saveAchievements(achievements: Achievement[]): Promise<void> {
    try {
      await set('achievements', achievements);
    } catch (error) {
      throw StorageError.fromError(error);
    }
  }

  async saveTopicState(topicState: TopicState): Promise<void> {
    try {
      await set('topicState', topicState);
    } catch (error) {
      throw StorageError.fromError(error);
    }
  }

  async clearAll(): Promise<void> {
    try {
      await clear();
    } catch (error) {
      throw StorageError.fromError(error);
    }
  }
}

export const storage = StorageService.getInstance();