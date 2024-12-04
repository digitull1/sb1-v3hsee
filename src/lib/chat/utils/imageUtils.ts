import type { Message } from '../../../types';
import type { ImageGenerationParams } from '../types';
import { generateImage, ImageError } from '../../api/image';
import { IMAGE_KEYWORDS, ERROR_MESSAGES } from '../constants';
import { createAssistantMessage } from './messageUtils';

export async function handleImageGeneration({
  content,
  age,
  addMessage
}: ImageGenerationParams): Promise<string | undefined> {
  if (!shouldGenerateImage(content)) return undefined;

  try {
    const prompt = createImagePrompt(content, age);
    return await generateImage(prompt);
  } catch (error) {
    console.error('Error generating image:', error);
    if (error instanceof ImageError) {
      await addMessage(createAssistantMessage(error.userMessage));
    }
    return undefined;
  }
}

export function shouldGenerateImage(content: string): boolean {
  const lowercaseContent = content.toLowerCase();
  return IMAGE_KEYWORDS.some(keyword => lowercaseContent.includes(keyword));
}

function createImagePrompt(content: string, age: number): string {
  const style = age <= 8 ? 'colorful and friendly' : 'detailed and realistic';
  return `Create a ${style} educational illustration: ${content}`;
}