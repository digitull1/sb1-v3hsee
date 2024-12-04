import { Groq } from 'groq-sdk';

// Environment variables
export const ENV = {
  GROQ_API_KEY: import.meta.env.VITE_GROQ_API_KEY,
  HF_TOKEN: import.meta.env.VITE_HUGGINGFACE_TOKEN,
  HF_API_URL: "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev"
} as const;

// Validate required environment variables
if (!ENV.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is required in environment variables');
}

if (!ENV.HF_TOKEN) {
  throw new Error('HUGGINGFACE_TOKEN is required in environment variables');
}

// Create and export the Groq client instance
export const groqClient = new Groq({
  apiKey: ENV.GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

// AI Model Configuration
export const AI_CONFIG = {
  chat: {
    model: "mixtral-8x7b-32768",
    temperature: 0.7,
    max_tokens: 1024,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  },
  image: {
    defaultParams: {
      width: 512,
      height: 512,
      guidance_scale: 7.5,
      num_inference_steps: 50
    }
  }
} as const;

// API Configuration
export const API_CONFIG = {
  endpoints: {
    chat: '/api/chat',
    image: '/api/image',
    audio: '/api/audio'
  },
  headers: {
    'Content-Type': 'application/json',
    'x-use-cache': 'true',
    'x-wait-for-model': 'true'
  }
} as const;

// Rate Limiting Configuration
export const RATE_LIMIT = {
  tokensPerMinute: 5000,
  resetInterval: 60 * 1000, // 1 minute
  maxRetries: 3,
  minDelay: 2000, // 2 seconds
  maxDelay: 10000, // 10 seconds
  estimatedTokens: {
    chat: 200,
    blocks: 300,
    image: 100
  }
} as const;

// Utility function to create a new Groq client instance
export function createGroqClient() {
  return new Groq({
    apiKey: ENV.GROQ_API_KEY,
    dangerouslyAllowBrowser: true
  });
}

// Export default client instance
export { groqClient as client };

// Types
export interface APIResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
}

export interface RequestConfig {
  retryCount?: number;
  signal?: AbortSignal;
  timeout?: number;
}