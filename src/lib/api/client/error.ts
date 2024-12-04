export interface ErrorContext {
  error?: unknown;
  details?: Record<string, unknown>;
}

export type ErrorCode = 
  | 'API_ERROR'
  | 'RATE_LIMIT'
  | 'VALIDATION_ERROR'
  | 'IMAGE_ERROR'
  | 'PARSE_ERROR';

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  API_ERROR: 'Something went wrong with the request. Please try again.',
  RATE_LIMIT: 'Taking a quick break to recharge my magic! Please try again in a moment. ✨',
  VALIDATION_ERROR: 'Something unexpected happened. Could you try that again?',
  IMAGE_ERROR: 'There was a problem with the image. Please try again.',
  PARSE_ERROR: 'Oops! My magic got a bit jumbled. Let\'s try that again!'
};

export class APIError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly context?: ErrorContext
  ) {
    super(message);
    this.name = 'APIError';
  }

  static fromError(error: unknown): APIError {
    if (error instanceof APIError) {
      return error;
    }

    if (error instanceof Error) {
      // Check for specific error patterns
      if (error.message.toLowerCase().includes('rate limit')) {
        return new APIError(
          ERROR_MESSAGES.RATE_LIMIT,
          'RATE_LIMIT',
          { error }
        );
      }

      if (error.message.toLowerCase().includes('image')) {
        return new APIError(
          ERROR_MESSAGES.IMAGE_ERROR,
          'IMAGE_ERROR',
          { error }
        );
      }

      if (error.message.toLowerCase().includes('parse')) {
        return new APIError(
          ERROR_MESSAGES.PARSE_ERROR,
          'PARSE_ERROR',
          { error }
        );
      }

      return new APIError(
        ERROR_MESSAGES.API_ERROR,
        'API_ERROR',
        { error }
      );
    }

    return new APIError(
      ERROR_MESSAGES.API_ERROR,
      'API_ERROR',
      { error }
    );
  }

  static isRetryable(error: APIError): boolean {
    return error.code === 'RATE_LIMIT';
  }

  get userMessage(): string {
    return ERROR_MESSAGES[this.code];
  }
}

export const handleAPIError = (error: unknown): APIError => {
  return APIError.fromError(error);
};

// Utility function to check if an error is retryable
export const isRetryableError = (error: unknown): boolean => {
  if (error instanceof APIError) {
    return APIError.isRetryable(error);
  }
  return false;
};