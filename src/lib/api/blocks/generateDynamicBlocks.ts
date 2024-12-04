import { Groq } from 'groq-sdk';
import type { Block, DifficultyLevel } from '../../../types';
import { TopicCategory, getTopicKeywords } from '../../topics/topicDetector';
import { getTopicIcon } from '../../utils';

const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

interface BlockGenerationParams {
  topic: TopicCategory;
  age: number;
  difficulty: DifficultyLevel;
  count?: number;
}

export async function generateDynamicBlocks({
  topic,
  age,
  difficulty,
  count = 3
}: BlockGenerationParams): Promise<Block[]> {
  const keywords = getTopicKeywords(topic);
  const ageGroup = age <= 8 ? 'young' : 'older';

  const prompt = `Generate ${count} fascinating questions about ${topic} for ${ageGroup} children (age ${age}). 
  Current difficulty level: ${difficulty}

  Each question should:
  1. Be intriguing and spark curiosity
  2. Use age-appropriate language
  3. Lead to engaging discussions
  4. Connect to these keywords: ${keywords.join(', ')}

  Format as JSON:
  {
    "blocks": [
      {
        "question": "Engaging question?",
        "preview": "Brief, exciting preview",
        "difficulty": "${difficulty}"
      }
    ]
  }`;

  try {
    const completion = await client.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content: "You are an expert in creating engaging educational content for children."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content);
    
    return response.blocks.map((block: any, index: number) => ({
      id: `${topic}-${Date.now()}-${index}`,
      title: block.question,
      description: block.preview,
      points: calculatePoints(block.difficulty || difficulty),
      icon: getTopicIcon(topic),
      difficulty: block.difficulty || difficulty,
      parentId: topic,
    }));
  } catch (error) {
    console.error('Error generating blocks:', error);
    return generateFallbackBlocks(topic, difficulty);
  }
}

function calculatePoints(difficulty: DifficultyLevel): number {
  return {
    easy: 10,
    medium: 20,
    hard: 30,
  }[difficulty];
}

function generateFallbackBlocks(topic: TopicCategory, difficulty: DifficultyLevel): Block[] {
  return [{
    id: `fallback-${topic}-${Date.now()}`,
    title: `Discover ${topic}`,
    description: 'Let\'s explore this fascinating topic together!',
    points: calculatePoints(difficulty),
    icon: getTopicIcon(topic),
    difficulty,
    parentId: topic,
  }];
}