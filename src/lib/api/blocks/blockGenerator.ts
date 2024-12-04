import { Block, DifficultyLevel } from '../../../types';
import { TopicCategory, getTopicKeywords, getTopicName } from '../../topics/topicDetector';
import { getTopicIcon } from '../../utils';
import { makeGroqRequest, GroqError } from '../chat/client';

interface GenerateBlocksOptions {
  topic: TopicCategory;
  age: number;
  difficulty: DifficultyLevel;
  count?: number;
}

interface BlockResponse {
  blocks: Array<{
    title: string;
    description: string;
    difficulty?: DifficultyLevel;
  }>;
}

export async function generateBlocks({
  topic,
  age,
  difficulty,
  count = 3
}: GenerateBlocksOptions): Promise<Block[]> {
  const topicName = getTopicName(topic);
  const keywords = getTopicKeywords(topic);
  const ageGroup = age <= 8 ? 'young' : 'older';

  const prompt = {
    role: "system",
    content: `Generate ${count} engaging questions about ${topicName} for ${ageGroup} children (age ${age}).
    Difficulty level: ${difficulty}
    
    Use these topic keywords for context: ${keywords.join(', ')}
    
    Each question should:
    1. Be intriguing and spark curiosity
    2. Use age-appropriate language
    3. Connect to the topic keywords
    4. Lead to further exploration
    
    Format your response as JSON:
    {
      "blocks": [
        {
          "title": "Engaging question about ${topicName}?",
          "description": "Brief preview that sparks curiosity",
          "difficulty": "${difficulty}"
        }
      ]
    }`
  };

  try {
    const response = await makeGroqRequest<BlockResponse>(
      [prompt],
      {},
      validateBlockResponse
    );

    return response.blocks
      .slice(0, count)
      .map((block, index) => ({
        id: `${topic}-${Date.now()}-${index}`,
        title: block.title || `Discover ${topicName}`,
        description: block.description || 'Let\'s explore this fascinating topic!',
        points: calculatePoints(block.difficulty || difficulty),
        icon: getTopicIcon(topic),
        difficulty: block.difficulty || difficulty,
        parentId: topic,
      }));
  } catch (error) {
    console.error('Block generation error:', error);
    return getFallbackBlocks(topic, difficulty);
  }
}

function validateBlockResponse(data: any): BlockResponse {
  if (!Array.isArray(data?.blocks)) {
    throw new Error('Invalid blocks format');
  }

  return {
    blocks: data.blocks.map((block: any) => {
      if (!block?.title || !block?.description) {
        throw new Error('Invalid block format');
      }
      return {
        title: block.title,
        description: block.description,
        difficulty: block.difficulty,
      };
    }),
  };
}

function calculatePoints(difficulty: DifficultyLevel): number {
  return {
    easy: 10,
    medium: 20,
    hard: 30,
  }[difficulty];
}

export function getFallbackBlocks(topic: TopicCategory, difficulty: DifficultyLevel): Block[] {
  const topicName = getTopicName(topic);
  
  return [
    {
      id: `fallback-${topic}-${Date.now()}-1`,
      title: `What amazing things can we learn about ${topicName}?`,
      description: 'Let\'s explore this fascinating topic together! ✨',
      points: calculatePoints(difficulty),
      icon: getTopicIcon(topic),
      difficulty,
      parentId: topic,
    },
    {
      id: `fallback-${topic}-${Date.now()}-2`,
      title: `Want to discover more about ${topicName}?`,
      description: 'There are so many exciting things to learn! 🌟',
      points: calculatePoints(difficulty),
      icon: getTopicIcon(topic),
      difficulty,
      parentId: topic,
    }
  ];
}