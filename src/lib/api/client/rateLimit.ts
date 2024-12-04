```typescript
import { APIError } from './error';
import { RATE_LIMIT } from './config';

interface RateLimitState {
  tokens: number;
  lastReset: number;
  queue: Array<{
    operation: () => Promise<any>;
    estimatedTokens: number;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }>;
}

const state: RateLimitState = {
  tokens: RATE_LIMIT.tokensPerMinute,
  lastReset: Date.now(),
  queue: [],
};

export async function withRateLimit<T>(
  operation: () => Promise<T>,
  estimatedTokens: number
): Promise<T> {
  const now = Date.now();
  
  // Reset tokens if minute has passed
  if (now - state.lastReset >= RATE_LIMIT.resetInterval) {
    state.tokens = RATE_LIMIT.tokensPerMinute;
    state.lastReset = now;
    processQueue();
  }

  // If we have enough tokens, proceed immediately
  if (state.tokens >= estimatedTokens) {
    state.tokens -= estimatedTokens;
    return operation();
  }

  // Otherwise, queue the request
  return new Promise((resolve, reject) => {
    state.queue.push({ 
      operation, 
      estimatedTokens,
      resolve, 
      reject 
    });
    
    // Start processing queue if not already processing
    if (state.queue.length === 1) {
      setTimeout(processQueue, calculateDelay());
    }
  });
}

function processQueue() {
  if (state.queue.length === 0) return;

  const request = state.queue[0];
  
  // Check if we have enough tokens
  if (state.tokens >= request.estimatedTokens) {
    state.tokens -= request.estimatedTokens;
    state.queue.shift();
    
    request.operation()
      .then(request.resolve)
      .catch((error) => {
        if (error instanceof APIError && error.code === 'RATE_LIMIT') {
          // Re-queue the request if it failed due to rate limit
          state.queue.unshift({
            operation: request.operation,
            estimatedTokens: request.estimatedTokens,
            resolve: request.resolve,
            reject: request.reject
          });
          setTimeout(processQueue, extractRetryDelay(error));
        } else {
          request.reject(error);
          setTimeout(processQueue, RATE_LIMIT.minDelay);
        }
      });
  } else {
    // Not enough tokens, wait and try again
    setTimeout(processQueue, calculateDelay());
  }
}

function calculateDelay(): number {
  const tokensNeeded = state.queue[0]?.estimatedTokens || RATE_LIMIT.estimatedTokens.chat;
  const tokensPerMs = RATE_LIMIT.tokensPerMinute / RATE_LIMIT.resetInterval;
  const msNeeded = (tokensNeeded - state.tokens) / tokensPerMs;
  
  return Math.min(
    Math.max(msNeeded, RATE_LIMIT.minDelay),
    RATE_LIMIT.maxDelay
  );
}

function extractRetryDelay(error: APIError): number {
  const match = error.context?.error?.message?.match(/try again in (\d+\.?\d*)s/i);
  return match 
    ? Math.min(parseFloat(match[1]) * 1000, RATE_LIMIT.maxDelay)
    : RATE_LIMIT.minDelay;
}
```