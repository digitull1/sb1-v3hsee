import { Groq } from 'groq-sdk';
import type { Block, Message } from '../../../types';
import { detectTopic } from '../../topics/topicDetector';
import { generateSuggestedBlocks } from './suggestedBlocks';
import { ChatError, handleApiError } from './errorHandler';

const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function handleBlockClick(
  block: Block,
  age: number,
  userName: string
): Promise<Message> {
  const ageGroup = age <= 8 ? 'young' : 'older';
  const detectedTopic = block.parentId?.toLowerCase() || detectTopic(block.title);

  const prompt = `You are Wonder Whiz, a magical learning companion for ${ageGroup} children (age ${age}). 
  Explain "${block.title}" in an engaging, ${block.difficulty} level way.
  
  Guidelines:
  - Use age-appropriate language and examples
  - Include emojis to make it fun and engaging
  - Break down complex concepts into digestible parts
  - Encourage curiosity and further exploration
  - Keep explanations focused and clear
  
  Format your response as JSON:
  {
    "content": "Your explanation with emojis",
    "blocks": [
      {
        "title": "Follow-up question?",
        "description": "Preview that sparks curiosity",
        "difficulty": "${block.difficulty}",
        "topic": "${detectedTopic || 'general'}"
      }
    ]
  }`;

  try {
    const completion = await client.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    if (!completion.choices?.[0]?.message?.content) {
      throw new ChatError('Invalid API response', 'API_ERROR');
    }

    const response = JSON.parse(completion.choices[0].message.content);

    if (!response.content) {
      throw new ChatError('Missing content in response', 'PARSE_ERROR');
    }

    return {
      id: Date.now().toString(),
      content: response.content,
      sender: 'assistant',
      blocks: generateSuggestedBlocks(response.blocks || [], block.difficulty, detectedTopic || null),
      difficulty: block.difficulty,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error handling block click:', error);
    
    return {
      id: Date.now().toString(),
      content: `Hey ${userName}! ✨ My magic wand needs a quick recharge. Can you try clicking that again?`,
      sender: 'assistant',
      timestamp: Date.now(),
      blocks: [{
        id: `retry-${Date.now()}`,
        title: 'Try another question',
        description: 'Let\'s explore something else together!',
        points: 10,
        icon: '✨',
        difficulty: block.difficulty,
      }],
    };
  }
}