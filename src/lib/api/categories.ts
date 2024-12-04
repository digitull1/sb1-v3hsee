import type { Block } from '../../types';
import { generateResponse } from './groq';

export async function generateCategoryBlocks(
  category: string,
  age: number
): Promise<Block[]> {
  const prompt = `Generate 5 fascinating questions about ${category} that would make a ${age} year old curious to learn more. Each question should:
  1. Be intriguing and spark wonder
  2. Cover different aspects of ${category}
  3. Lead to engaging discussions
  4. Be age-appropriate
  5. Encourage further exploration`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: `You are an expert in creating engaging educational content for ${age} year olds about ${category}.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate blocks');
    }

    const data = await response.json();
    const blocks = JSON.parse(data.choices[0].message.content).blocks || [];

    return blocks.map((block: any, index: number) => ({
      id: `${category}-${index}`,
      title: block.title,
      description: block.description,
      points: 10 + (index * 5),
      icon: getTopicIcon(category),
      difficulty: block.difficulty || 'medium',
      parentId: category,
    }));
  } catch (error) {
    console.error('Error generating category blocks:', error);
    throw error;
  }
}

function getTopicIcon(category: string): string {
  const icons: Record<string, string> = {
    'Science': '🔬',
    'Space': '🚀',
    'Nature': '🌿',
    'History': '📜',
    'Art': '🎨',
    'Math': '🔢',
    'Geography': '🌍',
    'Technology': '💻',
  };

  return icons[category] || '✨';
}