import { DifficultyLevel } from '../../types';

interface FeaturePrompt {
  text: string;
  feature: 'voice' | 'image_upload' | 'image_generation' | 'quiz';
  difficulty?: DifficultyLevel;
  points?: number;
}

export const FEATURE_PROMPTS: Record<string, FeaturePrompt[]> = {
  voice: [
    {
      text: "Don't want to type? Just press the 🎤 button and tell me what you're thinking!",
      feature: 'voice',
    },
    {
      text: "Feeling chatty? Let's talk! Use the mic button to tell me what you're curious about. 🎤😊",
      feature: 'voice',
    },
  ],
  image_upload: [
    {
      text: "Stuck on homework? 📚 Snap a picture and let me help you solve it! Click the 📸 button to upload your homework.",
      feature: 'image_upload',
    },
    {
      text: "Got a cool drawing or a math problem? Take a picture and share it with me—I'll help you figure it out! 🖼️",
      feature: 'image_upload',
    },
  ],
  image_generation: [
    {
      text: "Use your imagination! Type or say what you want to see, and I'll create a cool image for you. 🖍️✨",
      feature: 'image_generation',
    },
    {
      text: "What if we could generate a picture of how dinosaurs looked millions of years ago? Click the magic wand to try it! 🦖",
      feature: 'image_generation',
    },
  ],
  quiz: [
    {
      text: "Ready for a quick challenge? Let's take a quiz and see if you can score full points! 📝✨",
      feature: 'quiz',
      points: 15,
    },
    {
      text: "Want to test your knowledge? Take a fun quiz, and I'll make sure it's easy peasy! 🎯",
      feature: 'quiz',
      points: 10,
    },
  ],
};

export const TOPIC_PROMPTS: Record<string, string[]> = {
  science: [
    "Why do rainbows appear after rain? Let's create a colorful image to understand! 🌈",
    "How do plants eat sunlight? Upload a picture of a plant and I'll explain! 🌱",
  ],
  space: [
    "Want to see what Jupiter's moons look like? Let me generate an image for you! 🪐",
    "Curious about black holes? Let's explore space together! 🚀",
  ],
  nature: [
    "How do butterflies transform? Watch this magical process! 🦋",
    "Why do leaves change color? Let's create an autumn scene! 🍁",
  ],
};

export function getRandomPrompt(feature: keyof typeof FEATURE_PROMPTS): FeaturePrompt {
  const prompts = FEATURE_PROMPTS[feature];
  return prompts[Math.floor(Math.random() * prompts.length)];
}

export function getTopicPrompt(topic: string): string | null {
  const prompts = TOPIC_PROMPTS[topic.toLowerCase()];
  if (!prompts?.length) return null;
  return prompts[Math.floor(Math.random() * prompts.length)];
}