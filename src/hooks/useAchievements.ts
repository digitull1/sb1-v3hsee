import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { achievementManager } from '../lib/achievements/achievementManager';

export function useAchievements() {
  const { user, addAchievement } = useStore();

  useEffect(() => {
    if (user) {
      achievementManager.initialize(user);
    }
  }, [user]);

  const checkAchievements = (points: number, streak: number) => {
    const newAchievements = achievementManager.checkForAchievements(points, streak);
    newAchievements.forEach(achievement => addAchievement(achievement));
    return newAchievements;
  };

  return { checkAchievements };
}