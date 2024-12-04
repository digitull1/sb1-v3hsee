import { get, set } from 'idb-keyval';
import type { TopicProgress, DifficultyLevel, User } from '../../types';

interface TopicStats {
  attempts: number;
  successes: number;
  lastAttempt: number;
  streak: number;
}

export class TopicManager {
  private topics: Map<string, TopicProgress> = new Map();
  private userId: string | null = null;

  async initialize(user: User) {
    this.userId = user.name;
    try {
      const stored = await get(`topics-${this.userId}`);
      if (stored) {
        this.topics = new Map(stored);
      }
    } catch (error) {
      console.error('Error loading topic progress:', error);
    }
  }

  updateProgress(topic: string, success: boolean) {
    const progress = this.topics.get(topic) || {
      level: 'easy' as DifficultyLevel,
      mastery: 0,
      attempts: 0,
      successes: 0,
      lastAttempt: 0,
      streak: 0,
    };

    const now = Date.now();
    const daysSinceLastAttempt = progress.lastAttempt ? 
      Math.floor((now - progress.lastAttempt) / (1000 * 60 * 60 * 24)) : 0;

    progress.attempts++;
    if (success) {
      progress.successes++;
      progress.mastery = Math.min(1, progress.mastery + 0.1);
      progress.streak = daysSinceLastAttempt <= 1 ? progress.streak + 1 : 1;
    } else {
      progress.mastery = Math.max(0, progress.mastery - 0.05);
      progress.streak = 0;
    }

    progress.lastAttempt = now;
    this.adjustDifficulty(progress);
    this.topics.set(topic, progress);
    this.persist();
  }

  private adjustDifficulty(progress: TopicProgress) {
    const successRate = progress.successes / progress.attempts;
    if (successRate >= 0.8 && progress.mastery >= 0.7) {
      if (progress.level === 'easy') progress.level = 'medium';
      else if (progress.level === 'medium') progress.level = 'hard';
    } else if (successRate < 0.4 || progress.mastery < 0.3) {
      if (progress.level === 'hard') progress.level = 'medium';
      else if (progress.level === 'medium') progress.level = 'easy';
    }
  }

  getDifficulty(topic: string): DifficultyLevel {
    return this.topics.get(topic)?.level || 'easy';
  }

  getMastery(topic: string): number {
    return this.topics.get(topic)?.mastery || 0;
  }

  getTopicStats(topic: string): TopicStats {
    const progress = this.topics.get(topic);
    return {
      attempts: progress?.attempts || 0,
      successes: progress?.successes || 0,
      lastAttempt: progress?.lastAttempt || 0,
      streak: progress?.streak || 0,
    };
  }

  private async persist() {
    if (!this.userId) return;
    try {
      await set(`topics-${this.userId}`, Array.from(this.topics.entries()));
    } catch (error) {
      console.error('Error persisting topic progress:', error);
    }
  }
}

export const topicManager = new TopicManager();