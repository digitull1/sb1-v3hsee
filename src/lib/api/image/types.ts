export interface ImageGenerationOptions {
  width?: number;
  height?: number;
  guidanceScale?: number;
  numInferenceSteps?: number;
  useCache?: boolean;
  waitForModel?: boolean;
}

export interface ImagePrompt {
  text: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export class ImageError extends Error {
  constructor(
    message: string,
    public readonly code: 'GENERATION_ERROR' | 'DOWNLOAD_ERROR' | 'VALIDATION_ERROR',
    public readonly context?: any
  ) {
    super(message);
    this.name = 'ImageError';
  }

  static fromError(error: unknown): ImageError {
    if (error instanceof ImageError) {
      return error;
    }

    if (error instanceof Error) {
      return new ImageError(
        error.message,
        'GENERATION_ERROR',
        { error }
      );
    }

    return new ImageError(
      'An unexpected error occurred',
      'GENERATION_ERROR',
      { error }
    );
  }

  get userMessage(): string {
    switch (this.code) {
      case 'GENERATION_ERROR':
        return 'Having trouble creating your image. Let\'s try again! ✨';
      case 'DOWNLOAD_ERROR':
        return 'Oops! Could not download the image. Please try again.';
      case 'VALIDATION_ERROR':
        return 'Please provide a valid image description.';
      default:
        return 'Something went wrong. Please try again!';
    }
  }
}