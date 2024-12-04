import type { Message } from '../../../types';

export class ChatError extends Error {
  constructor(
    message: string,
    public readonly code: 'API_ERROR' | 'PARSE_ERROR' | 'VALIDATION_ERROR' | 'RATE_LIMIT',
    public readonly context?: any
  ) {
    super(message);
    this.name = 'ChatError';
  }
}

export function createFallbackMessage(error: unknown, userName: string): Message {
  console.error('Chat error:', error);

  const messages = {
    API_ERROR: `Hey ${userName}! My magic wand needs a quick recharge. Could you try asking that again in a moment?`,
    PARSE_ERROR: `Oops! My magical thinking got a bit jumbled. Let's try that question again!`,
    VALIDATION_ERROR: `Hey ${userName}! Something unexpected happened. Could you rephrase your question?`,
    RATE_LIMIT: `Hey ${userName}! I'm thinking too fast! Let's wait a moment before asking another question.`,
    DEFAULT: `Hey ${userName}! My magic needs a quick break. Let's try that again!`
  };

  const fallbackBlocks = [{
    id: `fallback-${Date.now()}`,
    title: 'Try Another Question',
    description: 'Let\'s explore something else together!',
    points: 10,
    icon: '✨',
    difficulty: 'easy',
  }];

  return {
    id: Date.now().toString(),
    content: error instanceof ChatError ? messages[error.code] : messages.DEFAULT,
    sender: 'assistant',
    timestamp: Date.now(),
    blocks: fallbackBlocks,
  };
}

export function handleApiError(error: unknown): never {
  if (error instanceof ChatError) {
    throw error;
  }

  if (error instanceof Error && error.message.includes('rate limit')) {
    throw new ChatError(
      'Rate limit exceeded',
      'RATE_LIMIT',
      { error }
    );
  }

  if (error instanceof SyntaxError) {
    throw new ChatError(
      'Failed to parse response',
      'PARSE_ERROR',
      { error }
    );
  }

  throw new ChatError(
    'API request failed',
    'API_ERROR',
    { error }
  );
}