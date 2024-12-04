import { ImageError } from './types';

export async function downloadImage(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new ImageError(
        'Failed to download image',
        'DOWNLOAD_ERROR',
        { response }
      );
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    if (error instanceof ImageError) {
      throw error;
    }
    
    throw new ImageError(
      'Failed to download image',
      'DOWNLOAD_ERROR',
      { error }
    );
  }
}