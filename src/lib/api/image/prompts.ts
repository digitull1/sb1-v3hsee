import { TOPIC_PROMPTS, DEFAULT_PROMPTS } from './config';
import type { ImagePrompt } from './types';

export function getTopicPrompts(topic?: string, difficulty?: string): ImagePrompt[] {
  if (!topic) {
    return DEFAULT_PROMPTS;
  }

  const prompts = TOPIC_PROMPTS[topic.toLowerCase() as keyof typeof TOPIC_PROMPTS];
  if (!prompts) {
    return DEFAULT_PROMPTS;
  }

  if (difficulty) {
    return prompts.filter(prompt => prompt.difficulty === difficulty);
  }

  return prompts;
}

export function enhancePrompt(prompt: string, age: number): string {
  const ageGroup = age <= 8 ? 'young children' : 'older children';
  const style = age <= 8 ? 'colorful and friendly' : 'detailed and realistic';
  
  return `Create a ${style} educational illustration for ${ageGroup}: ${prompt}. High quality, digital art style.`;
}