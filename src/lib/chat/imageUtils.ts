import type { Message } from '../../types';
import { generateImage, ImageError } from '../api/image';

export async function handleImageGeneration(
  content: string,
  age: number,
  addMessage: (message: Message) => Promise<void>
): Promise<string | undefined> {
  if (!shouldGenerateImage(content)) return undefined;

  try {
    const style = age <= 8 ? 'colorful and friendly' : 'detailed and realistic';
    const enhancedPrompt = ['Create a', style, 'educational illustration:', content].join(' ');
    return await generateImage(enhancedPrompt);
  } catch (error) {
    console.error('Error generating image:', error);
    if (error instanceof ImageError) {
      await addMessage({
        id: Date.now().toString(),
        content: error.userMessage,
        sender: 'assistant',
        timestamp: Date.now()
      });
    }
    return undefined;
  }
}

export function shouldGenerateImage(content: string): boolean {
  const imageKeywords = [
    'show me', 'draw', 'create', 'generate', 'picture',
    'image', 'illustration', 'visualize', 'paint'
  ];
  const lowercaseContent = content.toLowerCase();
  return imageKeywords.some(keyword => lowercaseContent.includes(keyword));
}