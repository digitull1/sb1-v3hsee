import type { Message, Block } from '../types';
import { getAgeGroup } from './utils';

interface GroqResponse {
  content: string;
  blocks?: Block[];
}

export async function generateResponse(
  messages: Message[],
  age: number
): Promise<GroqResponse> {
  const ageGroup = getAgeGroup(age);
  const prompt = createPrompt(messages, ageGroup);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(ageGroup),
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate response');
    }

    const data = await response.json();
    return parseResponse(data.choices[0].message.content);
  } catch (error) {
    console.error('Error generating response:', error);
    return {
      content: "I'm having trouble thinking right now. Could you try asking me again?",
      blocks: generateFallbackBlocks(),
    };
  }
}

function getSystemPrompt(ageGroup: 'young' | 'old'): string {
  return `You are Wonder Whiz, an AI learning companion for ${
    ageGroup === 'young' ? 'young children (ages 5-8)' : 'older children (ages 9-16)'
  }. Always be encouraging, patient, and explain concepts in an ${
    ageGroup === 'young' ? 'simple and playful' : 'engaging and informative'
  } way. Each response should include both an explanation and suggest 2-4 related topics for further exploration.`;
}

function createPrompt(messages: Message[], ageGroup: 'young' | 'old'): string {
  const lastMessage = messages[messages.length - 1];
  return `${lastMessage.content}\n\nRespond in a way that's appropriate for ${
    ageGroup === 'young' ? 'a young child (5-8 years)' : 'an older child (9-16 years)'
  }. After your explanation, suggest 2-4 related topics that the child might want to explore next.`;
}

function generateFallbackBlocks(): Block[] {
  return [
    {
      id: Date.now().toString(),
      title: 'Try Another Question',
      description: 'Ask me something else you\'re curious about!',
      points: 5,
      icon: '🤔',
    },
    {
      id: (Date.now() + 1).toString(),
      title: 'General Knowledge',
      description: 'Let\'s explore some interesting facts together!',
      points: 10,
      icon: '🌟',
    },
  ];
}

function parseResponse(response: string): GroqResponse {
  // Extract topics from the response and create blocks
  const topics = extractTopics(response);
  const blocks = topics.map((topic, index) => ({
    id: (Date.now() + index).toString(),
    title: topic.title,
    description: topic.description,
    points: 10 + (index * 5),
    icon: getTopicIcon(topic.title),
  }));

  return {
    content: response,
    blocks,
  };
}

interface Topic {
  title: string;
  description: string;
}

function extractTopics(response: string): Topic[] {
  // Simple extraction - can be enhanced with better parsing
  return [
    {
      title: 'Learn More',
      description: 'Dive deeper into this fascinating topic!',
    },
    {
      title: 'Fun Facts',
      description: 'Discover amazing facts about this subject!',
    },
    {
      title: 'Quiz Time',
      description: 'Test your knowledge with fun questions!',
    },
  ];
}

function getTopicIcon(title: string): string {
  const icons: Record<string, string> = {
    'Learn More': '📚',
    'Fun Facts': '✨',
    'Quiz Time': '🎯',
    'Experiment': '🔬',
    'Challenge': '🏆',
    'Story Time': '📖',
  };

  return icons[title] || '🌟';
}