import { get, set } from 'idb-keyval';
import type { Topic, DifficultyLevel, UserProgress } from '../../types';

export class DifficultyManager {
  private static readonly MASTERY_THRESHOLD = 0.8; // 80% success rate for mastery
  private static readonly DIFFICULTY_LEVELS: DifficultyLevel[] = ['easy', 'medium', 'hard'];

  private userProgress: UserProgress = {
    topics: new Map(),
    overallLevel: 'easy',
    streakCount: 0,
    successRate: 0,
    totalAttempts: 0,
    successfulAttempts: 0,
  };

  async initialize(userId: string) {
    try {
      const stored = await get(`difficulty-${userId}`);
      if (stored) {
        this.userProgress = stored;
      }
    } catch (error) {
      console.error('Error loading difficulty settings:', error);
    }
  }

  updateProgress(topic: string, success: boolean) {
    const topicProgress = this.userProgress.topics.get(topic) || {
      level: 'easy',
      attempts: 0,
      successes: 0,
      lastAttempt: 0,
    };

    topicProgress.attempts++;
    if (success) {
      topicProgress.successes++;
      this.userProgress.successfulAttempts++;
      this.userProgress.streakCount++;
    } else {
      this.userProgress.streakCount = 0;
    }

    topicProgress.lastAttempt = Date.now();
    this.userProgress.topics.set(topic, topicProgress);
    this.userProgress.totalAttempts++;
    this.userProgress.successRate = 
      this.userProgress.successfulAttempts / this.userProgress.totalAttempts;

    this.adjustDifficulty(topic);
    this.persist();
  }

  private adjustDifficulty(topic: string) {
    const progress = this.userProgress.topics.get(topic)!;
    const successRate = progress.successes / progress.attempts;
    const currentLevelIndex = DifficultyManager.DIFFICULTY_LEVELS.indexOf(progress.level);

    if (successRate >= DifficultyManager.MASTERY_THRESHOLD && currentLevelIndex < 2) {
      progress.level = DifficultyManager.DIFFICULTY_LEVELS[currentLevelIndex + 1];
    } else if (successRate < 0.4 && currentLevelIndex > 0) {
      progress.level = DifficultyManager.DIFFICULTY_LEVELS[currentLevelIndex - 1];
    }

    // Update overall difficulty level
    this.updateOverallLevel();
  }

  private updateOverallLevel() {
    const levels = Array.from(this.userProgress.topics.values())
      .map(p => p.level);
    
    const levelCounts = levels.reduce((acc, level) => {
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<DifficultyLevel, number>);

    // Set overall level to the most common level
    this.userProgress.overallLevel = Object.entries(levelCounts)
      .sort(([, a], [, b]) => b - a)[0][0] as DifficultyLevel;
  }

  getDifficultyForTopic(topic: string): DifficultyLevel {
    return this.userProgress.topics.get(topic)?.level || 'easy';
  }

  getOverallDifficulty(): DifficultyLevel {
    return this.userProgress.overallLevel;
  }

  async persist() {
    try {
      await set(`difficulty-${this.userProgress.userId}`, this.userProgress);
    } catch (error) {
      console.error('Error persisting difficulty settings:', error);
    }
  }
}

export const difficultyManager = new DifficultyManager();