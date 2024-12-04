import { RATE_LIMIT_CONFIG } from '../constants';
import { ChatError } from '../errors/ChatError';

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = RATE_LIMIT_CONFIG.MAX_RETRIES
): Promise<T> {
  let lastError: Error | null = null;
  let delay = RATE_LIMIT_CONFIG.INITIAL_DELAY;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (error instanceof ChatError && error.code !== 'RATE_LIMIT') {
        throw error;
      }

      if (attempt === maxRetries) {
        throw lastError;
      }

      await sleep(delay);
      delay = Math.min(
        delay * RATE_LIMIT_CONFIG.BACKOFF_FACTOR,
        RATE_LIMIT_CONFIG.MAX_DELAY
      );
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}