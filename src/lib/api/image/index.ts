// Import all chat-related functionality
import { generateResponse } from './generateResponse';
import { generateContextualBlocks } from './blockGenerator';
import { createSystemPrompt } from './prompts';
import { validateResponse, validateBlocks } from './validators';
import { withRateLimit } from '../client/rateLimit';
import { APIError } from '../client/error';

// Import types
import type { 
  Message, 
  ChatResponse, 
  Block, 
  DifficultyLevel 
} from '../../../types';

// Export functions
export {
  generateResponse,
  generateContextualBlocks,
  createSystemPrompt,
  validateResponse,
  validateBlocks,
  withRateLimit
};

// Export error handling
export { APIError };

// Export types
export type {
  Message,
  ChatResponse,
  Block,
  DifficultyLevel
};

// Export any constants
export const CHAT_CONFIG = {
  defaultModel: "mixtral-8x7b-32768",
  maxTokens: 1024,
  temperature: 0.7
};