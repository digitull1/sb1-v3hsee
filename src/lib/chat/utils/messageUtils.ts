import type { Message } from '../../../types';
import { APIError } from '../../api/client/error';
import { ERROR_MESSAGES } from '../constants';

export function createUserMessage(content: string): Message {
  return {
    id: generateMessageId(),
    content: content.trim(),
    sender: 'user',
    timestamp: Date.now()
  };
}

export function createAssistantMessage(
  content: string,
  options: Partial<Message> = {}
): Message {
  return {
    id: generateMessageId(),
    content,
    sender: 'assistant',
    timestamp: Date.now(),
    ...options
  };
}

export function createErrorMessage(error: unknown): Message {
  const content = error instanceof APIError 
    ? error.userMessage
    : ERROR_MESSAGES.DEFAULT;

  return createAssistantMessage(content);
}

function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}