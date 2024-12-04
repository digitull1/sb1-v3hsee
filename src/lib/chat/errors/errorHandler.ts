import type { Message } from '../../../types';
import { ChatError } from './ChatError';
import { ERROR_MESSAGES } from '../constants';

export function handleChatError(error: unknown): Message {
  console.error('Chat error:', error);

  const chatError = ChatError.fromError(error);
  
  return {
    id: Date.now().toString(),
    content: chatError.userMessage,
    sender: 'assistant',
    timestamp: Date.now(),
  };
}

export function handleImageError(error: unknown): Message {
  console.error('Image generation error:', error);

  return {
    id: Date.now().toString(),
    content: ERROR_MESSAGES.IMAGE_GENERATION,
    sender: 'assistant',
    timestamp: Date.now(),
  };
}

export function handleQuizError(error: unknown): Message {
  console.error('Quiz error:', error);

  return {
    id: Date.now().toString(),
    content: ERROR_MESSAGES.QUIZ,
    sender: 'assistant',
    timestamp: Date.now(),
  };
}