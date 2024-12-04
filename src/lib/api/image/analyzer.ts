import { client } from '../client/config';
import { APIError } from '../client/error';
import type { Message } from '../../../types';

export async function analyzeImage(imageUrl: string, age: number): Promise<Message> {
  try {
    const completion = await client.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content: `You are Wonder Whiz, an AI learning companion for children age ${age}. 
          Analyze the image and explain what you see in an engaging, educational way.
          Use age-appropriate language and connect observations to learning opportunities.
          Keep explanations concise and fun, using emojis to highlight key points.`
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

    const content = completion.choices[0].message?.content;
    if (!content) {
      throw new APIError(
        'Empty response from image analysis',
        'API_ERROR'
      );
    }

    return {
      id: Date.now().toString(),
      content,
      sender: 'assistant',
      timestamp: Date.now(),
      imageUrl,
    };
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    throw new APIError(
      'Failed to analyze image',
      'API_ERROR',
      { error }
    );
  }
}