// Import types
import type { Message, ChatResponse } from '../../../types';
import { client, AI_CONFIG } from '../client/config';

// Main chat generation function
export async function generateResponse(
  messages: Message[],
  age: number
): Promise<ChatResponse> {
  try {
    const completion = await client.chat.completions.create({
      model: AI_CONFIG.chat.model,
      messages: [
        {
          role: "system",
          content: `You are Wonder Whiz, an AI learning companion for children age ${age}. 
                   Provide engaging, educational responses appropriate for a ${age}-year-old child.`
        },
        ...messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      ],
      temperature: AI_CONFIG.chat.temperature,
      max_tokens: AI_CONFIG.chat.max_tokens
    });

    const content = completion.choices[0]?.message?.content || 
                   "I'm having trouble understanding. Could you try asking in a different way?";

    return {
      id: Date.now().toString(),
      content,
      sender: 'assistant',
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw new ChatError(
      'Failed to generate response',
      'API_ERROR',
      { error }
    );
  }
}

// Error handling
export class ChatError extends Error {
  constructor(
    message: string,
    public code: 'API_ERROR' | 'VALIDATION_ERROR' | 'RATE_LIMIT',
    public context?: any
  ) {
    super(message);
    this.name = 'ChatError';
  }
}

// Export types
export type {
  Message,
  ChatResponse
};