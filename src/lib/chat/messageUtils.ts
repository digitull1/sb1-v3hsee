import type { Message } from '../../types';
import { APIError } from '../api/client/error';

export function createUserMessage(content: string): Message {
  return {
    id: Date.now().toString(),
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
    id: (Date.now() + 1).toString(),
    content,
    sender: 'assistant',
    timestamp: Date.now(),
    ...options
  };
}

export function createErrorMessage(error: unknown): Message {
  const content = error instanceof APIError 
    ? error.userMessage
    : 'Oops! My magic wand needs a quick recharge. Can you try asking that again? ✨';

  return createAssistantMessage(content);
}