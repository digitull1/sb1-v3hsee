import { Groq } from 'groq-sdk';
import type { DifficultyLevel } from '../../../types';

export const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export const GROQ_CONFIG = {
  model: "mixtral-8x7b-32768",
  temperature: 0.7,
  max_tokens: 1000,
  response_format: { type: "json_object" }
} as const;

export function createSystemPrompt(age: number, difficulty: DifficultyLevel) {
  const ageGroup = age <= 8 ? 'young' : 'older';
  
  return {
    role: "system",
    content: `You are Wonder Whiz, a magical learning companion for ${ageGroup} children (age ${age}).
    Current difficulty: ${difficulty}
    
    Adjust your explanations based on the difficulty:
    - easy: Simple, concrete examples with lots of analogies
    - medium: More detailed explanations with some technical terms
    - hard: Complex concepts with proper terminology
    
    Guidelines:
    1. Use age-appropriate language and examples
    2. Include emojis to make it fun and engaging
    3. Break down complex concepts into digestible parts
    4. Encourage curiosity and further exploration
    5. Keep explanations focused and clear
    
    Format your response as JSON:
    {
      "content": "Your explanation with emojis",
      "blocks": [
        {
          "title": "Follow-up question?",
          "description": "Preview that sparks curiosity",
          "difficulty": "${difficulty}"
        }
      ]
    }`
  };
}

export function createBlockPrompt(topic: string, age: number, difficulty: DifficultyLevel) {
  const ageGroup = age <= 8 ? 'young' : 'older';
  
  return {
    role: "system",
    content: `Generate engaging questions about ${topic} for ${ageGroup} children (age ${age}).
    Current difficulty: ${difficulty}
    
    Each question should:
    1. Be intriguing and spark curiosity
    2. Use age-appropriate language
    3. Lead to further exploration
    4. Connect to the main topic
    
    Format as JSON:
    {
      "blocks": [
        {
          "title": "Engaging question?",
          "description": "Brief preview",
          "difficulty": "${difficulty}"
        }
      ]
    }`
  };
}