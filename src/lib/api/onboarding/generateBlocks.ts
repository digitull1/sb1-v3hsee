import { Groq } from 'groq-sdk';
import type { Block } from '../../types';
import { getTopicIcon } from '../../utils';

const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateOnboardingBlocks(age: number): Promise<Block[]> {
  const ageGroup = age <= 8 ? 'young' : 'older';
  const prompt = `Generate engaging learning topics for ${ageGroup} children (age ${age}). For each category, create a fascinating question that would make them curious to learn more.

Categories:
- Science: Discover the wonders of the natural world
- Space: Explore the mysteries of the universe
- Nature: Learn about plants, animals, and ecosystems
- Technology: Understand how machines and computers work
- Art: Express yourself through colors and creativity

Format your response as JSON:
{
  "blocks": [
    {
      "category": "Category name",
      "question": "Intriguing question?",
      "preview": "Brief, exciting preview",
      "difficulty": "easy|medium|hard"
    }
  ]
}`;

  try {
    const completion = await client.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content: "You are an expert in creating educational content for children."
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
    
    return response.blocks.map((block: any) => ({
      id: `onboarding-${Date.now()}-${block.category}`,
      title: block.question,
      description: block.preview,
      points: calculatePoints(block.difficulty || 'easy'),
      icon: getTopicIcon(block.category),
      difficulty: block.difficulty || 'easy',
      parentId: block.category,
    }));
  } catch (error) {
    console.error('Error generating onboarding blocks:', error);
    return generateFallbackBlocks(age);
  }
}

function calculatePoints(difficulty: string): number {
  return {
    easy: 10,
    medium: 20,
    hard: 30,
  }[difficulty] || 10;
}

function generateFallbackBlocks(age: number): Block[] {
  const difficulty = age <= 8 ? 'easy' : 'medium';
  
  return [
    {
      id: `fallback-science-${Date.now()}`,
      title: 'Why do rainbows appear after rain?',
      description: 'Discover the colorful magic of light and water!',
      points: calculatePoints(difficulty),
      icon: '🔬',
      difficulty,
      parentId: 'Science',
    },
    {
      id: `fallback-space-${Date.now()}`,
      title: 'How many stars are in the sky?',
      description: 'Explore the vast wonders of space!',
      points: calculatePoints(difficulty),
      icon: '🚀',
      difficulty,
      parentId: 'Space',
    },
    {
      id: `fallback-nature-${Date.now()}`,
      title: 'How do butterflies transform?',
      description: "Nature's most amazing makeover!",
      points: calculatePoints(difficulty),
      icon: '🦋',
      difficulty,
      parentId: 'Nature',
    },
  ];
}