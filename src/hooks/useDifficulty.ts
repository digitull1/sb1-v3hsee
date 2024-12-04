import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { difficultyManager } from '../lib/difficulty';
import type { DifficultyLevel } from '../types';

export function useDifficulty() {
  const { user, messages } = useStore();

  useEffect(() => {
    if (user) {
      difficultyManager.initialize(user.name);
    }
  }, [user]);

  const updateProgress = (topic: string, success: boolean) => {
    difficultyManager.updateProgress(topic, success);
  };

  const getDifficulty = (topic: string): DifficultyLevel => {
    return difficultyManager.getDifficultyForTopic(topic);
  };

  const getOverallDifficulty = (): DifficultyLevel => {
    return difficultyManager.getOverallDifficulty();
  };

  return {
    updateProgress,
    getDifficulty,
    getOverallDifficulty,
  };
}