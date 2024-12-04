import type { Block } from '../../types';
import { memory } from './index';
import { getTopicIcon } from '../utils';

export function generatePersonalizedSuggestions(age: number): Block[] {
  const recentTopics = memory.getRecentTopics();
  const preferences = memory.getUserPreferences();
  
  const suggestions: Block[] = [];

  // Add suggestions based on recent topics
  recentTopics.forEach((topic, index) => {
    suggestions.push({
      id: `suggestion-recent-${index}`,
      title: `More about ${topic}?`,
      description: `You seemed interested in ${topic}. Let's explore more!`,
      points: 10,
      icon: getTopicIcon(topic),
      difficulty: 'easy',
    });
  });

  // Add suggestions based on preferences
  preferences.slice(0, 2).forEach((topic, index) => {
    suggestions.push({
      id: `suggestion-pref-${index}`,
      title: `Discover ${topic}`,
      description: `Based on your interests, you might love learning about ${topic}!`,
      points: 15,
      icon: getTopicIcon(topic),
      difficulty: 'medium',
    });
  });

  // Add a challenge suggestion
  suggestions.push({
    id: 'suggestion-challenge',
    title: 'Take a Challenge!',
    description: 'Ready to test your knowledge with a fun quiz?',
    points: 20,
    icon: '🏆',
    difficulty: 'hard',
  });

  return suggestions;
}