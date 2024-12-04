const API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev";
const API_TOKEN = import.meta.env.VITE_HUGGINGFACE_TOKEN;

export async function generateImage(prompt: string): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
        'x-use-cache': 'true',
        'x-wait-for-model': 'true'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width: 512,
          height: 512,
          guidance_scale: 7.5,
          num_inference_steps: 50,
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate image');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
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
    ]
  };

  return topic && topic in topicPrompts ? topicPrompts[topic] : defaultPrompts;
}