import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { topicManager } from '../lib/topics/topicManager';
import type { DifficultyLevel } from '../types';

export function useTopics() {
  const { user, topicState } = useStore();

  useEffect(() => {
    if (user) {
      topicManager.initialize(user);
    }
  }, [user]);

  const updateProgress = (success: boolean) => {
    if (topicState.currentTopic) {
      topicManager.updateProgress(topicState.currentTopic, success);
    }
  };

  const getDifficulty = (topic: string): DifficultyLevel => {
    return topicManager.getDifficulty(topic);
  };

  const getMastery = (topic: string): number => {
    return topicManager.getMastery(topic);
  };

  const getTopicStats = (topic: string) => {
    return topicManager.getTopicStats(topic);
  };

  return {
    updateProgress,
    getDifficulty,
    getMastery,
    getTopicStats,
  };
}