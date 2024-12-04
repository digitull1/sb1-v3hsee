import { RETRY_OPTIONS } from './config';
import { APIError } from './error';

export async function withRetry<T>(
  operation: () => Promise<T>,
  options = RETRY_OPTIONS
): Promise<T> {
  let lastError: APIError | null = null;
  let delay = options.initialDelay;

  for (let attempt = 1; attempt <= options.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = APIError.fromError(error);
      
      if (!APIError.isRetryable(lastError) || attempt === options.maxRetries) {
        throw lastError;
      }

      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * 2, options.maxDelay);
    }
  }

  throw lastError || new APIError('Max retries exceeded', 'API_ERROR');
}