export const QUIZ_INTERVAL = 5; // Show quiz every 5 messages
export const POINTS_PER_CORRECT_ANSWER = 10;
export const MAX_RECENT_MESSAGES = 10;
export const MAX_RECENT_CONTEXT = 5;

export const ERROR_MESSAGES = {
  DEFAULT: 'Oops! My magic wand needs a quick recharge. Can you try asking that again? ✨',
  IMAGE_GENERATION: 'Having trouble creating your magical image. Let\'s try again! ✨',
  QUIZ: 'The quiz magic fizzled a bit. Want to try another question? ✨',
  API: 'My magical connection is a bit wobbly. Let\'s try that again! ✨',
  VALIDATION: 'Something unexpected happened in my spell book. Could you rephrase that? ✨',
  RATE_LIMIT: 'My magic needs a moment to recharge. Let\'s try again in a few seconds! ✨'
} as const;

export const IMAGE_KEYWORDS = [
  'show me',
  'draw',
  'create',
  'generate',
  'picture',
  'image',
  'illustration',
  'visualize',
  'paint'
] as const;

export const AGE_GROUPS = {
  YOUNG: {
    MAX_AGE: 8,
    STYLE: 'colorful and friendly'
  },
  OLDER: {
    MIN_AGE: 9,
    STYLE: 'detailed and realistic'
  }
} as const;

export const RATE_LIMIT_CONFIG = {
  MAX_RETRIES: 3,
  INITIAL_DELAY: 2000,
  MAX_DELAY: 10000,
  BACKOFF_FACTOR: 1.5
} as const;