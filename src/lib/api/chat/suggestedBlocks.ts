import type { Block, DifficultyLevel } from '../../../types';
import { TopicCategory, getRelatedTopics } from '../../topics/topicDetector';
import { getTopicIcon } from '../../utils';

interface RawBlock {
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  topic: string;
}

export function generateSuggestedBlocks(
  rawBlocks: RawBlock[],
  difficulty: DifficultyLevel,
  detectedTopic: TopicCategory | null
): Block[] {
  const blocks = rawBlocks.map((block, index) => ({
    id: `block-${Date.now()}-${index}`,
    title: block.title,
    description: block.description,
    points: calculatePoints(block.difficulty || difficulty),
    icon: getTopicIcon(block.topic),
    difficulty: block.difficulty || difficulty,
  }));

  // Add related topic suggestions if a topic was detected
  if (detectedTopic) {
    const relatedTopics = getRelatedTopics(detectedTopic);
    const relatedBlocks = relatedTopics.map((topic, index) => ({
      id: `related-${Date.now()}-${index}`,
      title: `Explore ${topic}`,
      description: `Discover how ${detectedTopic} connects with ${topic}!`,
      points: calculatePoints(difficulty),
      icon: getTopicIcon(topic),
      difficulty,
      parentId: topic,
    }));

    return [...blocks, ...relatedBlocks];
  }

  return blocks;
}

function calculatePoints(difficulty: DifficultyLevel): number {
  return {
    easy: 10,
    medium: 20,
    hard: 30,
  }[difficulty];
}