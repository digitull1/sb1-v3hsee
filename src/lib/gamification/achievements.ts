import type { Achievement } from '../../types';

export function checkAchievements(points: number, streak: number): Achievement[] {
  const achievements: Achievement[] = [];
  
  // Point-based achievements
  const pointMilestones = [100, 500, 1000, 5000];
  for (const milestone of pointMilestones) {
    if (points >= milestone && points - milestone < 100) {
      achievements.push({
        id: `points-${milestone}`,
        title: `${milestone} Points Master!`,
        description: `You've earned ${milestone} points on your learning journey!`,
        points: Math.floor(milestone * 0.1),
        type: 'points',
      });
    }
  }
  
  // Streak-based achievements
  const streakMilestones = [3, 7, 14, 30];
  for (const milestone of streakMilestones) {
    if (streak === milestone) {
      achievements.push({
        id: `streak-${milestone}`,
        title: `${milestone} Day Streak!`,
        description: `You've been learning for ${milestone} days in a row!`,
        points: milestone * 5,
        type: 'streak',
      });
    }
  }
  
  return achievements;
}