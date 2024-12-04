export const HF_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";
export const HF_TOKEN = import.meta.env.VITE_HUGGINGFACE_TOKEN;

if (!HF_TOKEN) {
  throw new Error('HUGGINGFACE_TOKEN is required in environment variables');
}

export const DEFAULT_GENERATION_OPTIONS = {
  width: 1024,
  height: 1024,
  guidanceScale: 7.5,
  numInferenceSteps: 50,
  useCache: true,
  waitForModel: true,
} as const;

export const TOPIC_PROMPTS = {
  space: [
    { text: "An astronaut floating among colorful planets", difficulty: "easy" },
    { text: "A rocket launching into a starry night sky", difficulty: "medium" },
    { text: "The Milky Way galaxy with swirling stars", difficulty: "hard" },
  ],
  science: [
    { text: "A laboratory with magical experiments", difficulty: "easy" },
    { text: "DNA strands glowing with rainbow colors", difficulty: "medium" },
    { text: "Microscopic world full of life", difficulty: "hard" },
  ],
  nature: [
    { text: "A magical forest with glowing plants", difficulty: "easy" },
    { text: "Underwater scene with colorful sea creatures", difficulty: "medium" },
    { text: "A butterfly garden in full bloom", difficulty: "hard" },
  ],
} as const;

export const DEFAULT_PROMPTS = [
  { text: "A magical learning adventure", difficulty: "easy" },
  { text: "A curious explorer discovering something new", difficulty: "medium" },
  { text: "A colorful world of knowledge", difficulty: "hard" },
] as const;