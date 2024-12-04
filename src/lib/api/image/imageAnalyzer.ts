import { Groq } from 'groq-sdk';
import type { Message } from '../../../types';

const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function analyzeImage(imageUrl: string, age: number): Promise<Message> {
  try {
    const completion = await client.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content: `You are Wonder Whiz, an AI learning companion for children age ${age}. Analyze the image and explain what you see in an engaging, educational way.`
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

    return {
      id: Date.now().toString(),
      content: completion.choices[0].message.content || "I'm having trouble seeing the image clearly. Could you try uploading it again?",
      sender: 'assistant',
      timestamp: Date.now(),
      imageUrl,
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}