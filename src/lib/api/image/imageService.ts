import { Groq } from 'groq-sdk';
import type { Message } from '../../../types';
import { APIError, handleAPIError } from '../client/error';

const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

const HF_API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev";
const HF_TOKEN = import.meta.env.VITE_HUGGINGFACE_TOKEN;

interface ImageGenerationParameters {
  width?: number;
  height?: number;
  guidance_scale?: number;
  num_inference_steps?: number;
}

export async function generateImage(
  prompt: string, 
  parameters: ImageGenerationParameters = {}
): Promise<string> {
  const defaultParams = {
    width: 512,
    height: 512,
    guidance_scale: 7.5,
    num_inference_steps: 50,
    ...parameters
  };

  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
        'x-use-cache': 'true',
        'x-wait-for-model': 'true'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: defaultParams
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        `Failed to generate image: ${errorData.error || response.statusText}`,
        'IMAGE_ERROR',
        { details: errorData }
      );
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    const apiError = handleAPIError(error);
    console.error('Error generating image:', apiError.userMessage);
    throw apiError;
  }
}

export async function downloadImage(url: string, filename: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new APIError(
        `Failed to download image: ${response.statusText}`,
        'IMAGE_ERROR'
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

    setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
  } catch (error) {
    const apiError = handleAPIError(error);
    console.error('Error downloading image:', apiError.userMessage);
    throw apiError;
  }
}

export async function analyzeImage(imageUrl: string, age: number): Promise<Message> {
  try {
    const completion = await client.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content: `You are Wonder Whiz, an AI learning companion for children age ${age}. 
                   Analyze the image and explain what you see in an engaging, educational way 
                   appropriate for a ${age}-year-old child.`
        },
        {
          role: "user",
          content: [
            { type: "text", text: "What do you see in this image?" },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ],
      temperature: 0.7,
      max_tokens: 1024
    });

    const content = completion.choices[0]?.message?.content || 
                   "I'm having trouble seeing the image clearly. Could you try uploading it again?";

    return {
      id: Date.now().toString(),
      content,
      sender: 'assistant',
      timestamp: Date.now(),
      imageUrl,
    };
  } catch (error) {
    const apiError = handleAPIError(error);
    console.error('Error analyzing image:', apiError.userMessage);
    
    return {
      id: Date.now().toString(),
      content: apiError.userMessage,
      sender: 'assistant',
      timestamp: Date.now(),
      imageUrl,
    };
  }
}

export function getTopicPrompts(topic?: string): string[] {
  const defaultPrompts = [
    "A magical learning adventure",
    "A curious explorer discovering something new",
    "A colorful world of knowledge"
  ];

  const topicPrompts: Record<string, string[]> = {
    space: [
      "An astronaut floating among colorful planets",
      "A rocket launching into a starry night sky",
      "The Milky Way galaxy with swirling stars"
    ],
    science: [
      "A laboratory with magical experiments",
      "DNA strands glowing with rainbow colors",
      "Microscopic world full of life"
    ],
    nature: [
      "A magical forest with glowing plants",
      "Underwater scene with colorful sea creatures",
      "A butterfly garden in full bloom"
    ],
    history: [
      "Ancient pyramids under a mysterious sky",
      "Medieval castle with magical elements",
      "Time-traveling adventure through history"
    ],
    art: [
      "Artist's studio with floating paint and brushes",
      "Rainbow symphony of colors and shapes",
      "Magical art museum coming to life"
    ]
  };

  return topic && topic in topicPrompts ? topicPrompts[topic] : defaultPrompts;
}