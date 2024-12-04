import { get, set } from 'idb-keyval';
import type { Achievement, User } from '../../types';

export class AchievementManager {
  private achievements: Achievement[] = [];
  private userId: string | null = null;

  async initialize(user: User) {
    this.userId = user.name;
    try {
      const stored = await get(`achievements-${this.userId}`);
      if (stored) {
        this.achievements = stored;
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  }

  checkForAchievements(points: number, streak: number): Achievement[] {
    const newAchievements: Achievement[] = [];

    // Point milestones
    const pointMilestones = [100, 500, 1000, 5000];
    for (const milestone of pointMilestones) {
      if (points >= milestone && !this.hasAchievement(`points-${milestone}`)) {
        newAchievements.push({
          id: `points-${milestone}`,
          title: `${milestone} Points Master!`,
          description: `You've earned ${milestone} magical points! 🌟`,
          points: Math.floor(milestone * 0.1),
          type: 'points'
        });
      }
    }

    // Streak milestones
    const streakMilestones = [3, 7, 14, 30];
    for (const milestone of streakMilestones) {
      if (streak >= milestone && !this.hasAchievement(`streak-${milestone}`)) {
        newAchievements.push({
          id: `streak-${milestone}`,
          title: `${milestone} Day Streak!`,
          description: `You've been learning for ${milestone} days in a row! 🔥`,
          points: milestone * 5,
          type: 'streak'
        });
      }
    }

    if (newAchievements.length > 0) {
      this.addAchievements(newAchievements);
    }

    return newAchievements;
  }

  private hasAchievement(id: string): boolean {
    return this.achievements.some(a => a.id === id);
  }

  private async addAchievements(newAchievements: Achievement[]) {
    this.achievements.push(...newAchievements);
    await this.persist();
  }

  private async persist() {
    if (!this.userId) return;
    try {
      await set(`achievements-${this.userId}`, this.achievements);
    } catch (error) {
      console.error('Error persisting achievements:', error);
    }
  }

  getAchievements(): Achievement[] {
    return this.achievements;
  }
}

export const achievementManager = new AchievementManager();