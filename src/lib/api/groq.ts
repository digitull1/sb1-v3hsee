import { Groq } from 'groq-sdk';
import type { Message, Block, DifficultyLevel } from '../../types';

const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

interface GroqResponse {
  content: string;
  blocks?: Block[];
  quiz?: any[];
}

export async function generateResponse(
  messages: Message[],
  age: number,
  includeQuiz: boolean = false,
  context: string[] = [],
  difficulty: DifficultyLevel = 'easy'
): Promise<GroqResponse> {
  const ageGroup = age >= 5 && age <= 8 ? 'young' : 'old';
  const lastMessage = messages[messages.length - 1];

  const prompt = `You are Wonder Whiz, a magical learning companion for ${
    ageGroup === 'young' ? 'young children (ages 5-8)' : 'older children (ages 9-16)'
  }. Current difficulty: ${difficulty}. 
  
  Adjust your explanations based on the difficulty:
  - easy: Simple, concrete examples with lots of analogies
  - medium: More detailed explanations with some technical terms
  - hard: Complex concepts with proper terminology
  
  Format your response as JSON with:
  {
    "content": "Your explanation with emojis and age-appropriate language",
    "blocks": [
      {
        "title": "Related question?",
        "description": "Preview that sparks curiosity",
        "difficulty": "${difficulty}"
      }
    ]${includeQuiz ? ',\n"quiz": [{"question": "Fun question?","options": ["A","B","C"],"correctAnswer": 0,"explanation": "Great job!"}]' : ''}
  }`;

  try {
    const completion = await client.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content: prompt
        },
        ...context.map(ctx => ({
          role: "system",
          content: `Previous context: ${ctx}`
        })),
        {
          role: "user",
          content: `${lastMessage.content} (Remember to respond in JSON format with content and blocks)`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const response = JSON.parse(completion.choices[0].message.content);
    return {
      content: response.content,
      blocks: (response.blocks || []).map((block: any, index: number) => ({
        id: `block-${Date.now()}-${index}`,
        title: block.title,
        description: block.description,
        points: calculatePoints(block.difficulty || difficulty),
        icon: getTopicIcon(block.category || ''),
        difficulty: block.difficulty || difficulty,
      })),
      quiz: response.quiz,
    };
  } catch (error) {
    console.error('Error generating response:', error);
    return {
      content: "✨ Oops! My magic wand needs a quick recharge. Can you try asking that again?",
      blocks: generateFallbackBlocks(difficulty),
    };
  }
}

function calculatePoints(difficulty: DifficultyLevel): number {
  return {
    easy: 10,
    medium: 20,
    hard: 30,
  }[difficulty];
}

function getTopicIcon(category: string): string {
  const icons: Record<string, string> = {
    science: '🔬',
    nature: '🌿',
    space: '🚀',
    history: '📜',
    art: '🎨',
    math: '🔢',
    technology: '💻',
    literature: '📚',
    music: '🎵',
    geography: '🌍',
  };

  return icons[category.toLowerCase()] || '✨';
}

function generateFallbackBlocks(difficulty: DifficultyLevel): Block[] {
  return [
    {
      id: `fallback-${Date.now()}-1`,
      title: 'Want to try another question?',
      description: 'Let\'s explore something else together! ✨',
      points: calculatePoints(difficulty),
      icon: '🎯',
      difficulty,
    },
  ];
}