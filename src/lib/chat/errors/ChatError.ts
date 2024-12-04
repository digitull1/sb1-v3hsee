import { ERROR_MESSAGES } from '../constants';

export type ChatErrorCode = 
  | 'API_ERROR'
  | 'RATE_LIMIT'
  | 'VALIDATION_ERROR'
  | 'IMAGE_ERROR'
  | 'QUIZ_ERROR';

export class ChatError extends Error {
  constructor(
    message: string,
    public readonly code: ChatErrorCode,
    public readonly context?: any
  ) {
    super(message);
    this.name = 'ChatError';
  }

  static fromError(error: unknown): ChatError {
    if (error instanceof ChatError) {
      return error;
    }

    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        return new ChatError(
          ERROR_MESSAGES.RATE_LIMIT,
          'RATE_LIMIT',
          { error }
        );
      }

      return new ChatError(
        ERROR_MESSAGES.API,
        'API_ERROR',
        { error }
      );
    }

    return new ChatError(
      ERROR_MESSAGES.DEFAULT,
      'API_ERROR',
      { error }
    );
  }

  get userMessage(): string {
    return ERROR_MESSAGES[this.code] || ERROR_MESSAGES.DEFAULT;
  }
}