import { HF_API_URL, HF_TOKEN, DEFAULT_GENERATION_OPTIONS } from './config';
import { ImageError } from './types';
import type { ImageGenerationOptions } from './types';

export async function generateImage(
  prompt: string,
  options: Partial<ImageGenerationOptions> = {}
): Promise<string> {
  if (!prompt?.trim()) {
    throw new ImageError(
      'Prompt is required',
      'VALIDATION_ERROR'
    );
  }

  const finalOptions = { ...DEFAULT_GENERATION_OPTIONS, ...options };

  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
        'x-use-cache': finalOptions.useCache?.toString() || 'true',
        'x-wait-for-model': finalOptions.waitForModel?.toString() || 'true'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width: finalOptions.width,
          height: finalOptions.height,
          guidance_scale: finalOptions.guidanceScale,
          num_inference_steps: finalOptions.numInferenceSteps,
          negative_prompt: "blurry, low quality, distorted, deformed",
          safety_checker: true,
        }
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ImageError(
        error.error || 'Failed to generate image',
        'GENERATION_ERROR',
        { response: error }
      );
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    if (error instanceof ImageError) {
      throw error;
    }
    
    throw new ImageError(
      'Failed to generate image',
      'GENERATION_ERROR',
      { error }
    );
  }
}