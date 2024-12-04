import { useState, useCallback } from 'react';
import { generateImage, downloadImage, ImageError } from '../lib/api/image';

export function useImageGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (prompt: string) => {
    if (!prompt.trim()) return null;

    try {
      setIsGenerating(true);
      setError(null);
      const imageUrl = await generateImage(prompt);
      return imageUrl;
    } catch (error) {
      const message = error instanceof ImageError ? 
        error.userMessage : 
        'Failed to generate image. Please try again!';
      
      setError(message);
      console.error('Image generation error:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const download = useCallback(async (imageUrl: string) => {
    try {
      setError(null);
      await downloadImage(imageUrl, `wonder-whiz-${Date.now()}.png`);
      return true;
    } catch (error) {
      const message = error instanceof ImageError ? 
        error.userMessage : 
        'Failed to download image. Please try again!';
      
      setError(message);
      return false;
    }
  }, []);

  return {
    isGenerating,
    error,
    generate,
    download,
  };
}