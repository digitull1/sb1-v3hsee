export interface ChatResponse {
  content: string;
  blocks?: Block[];
  quiz?: Question[];
}

export interface TopicProgress {
  level: DifficultyLevel;
  mastery: number;
  attempts: number;
  successes: number;
  lastAttempt: number;
  streak: number;
}

export interface TopicState {
  currentTopic: string | null;
  topicMessageCount: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'points' | 'streak' | 'topic' | 'quiz';
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  blocks?: Block[];
  quiz?: Question[];
  timestamp: number;
  difficulty?: DifficultyLevel;
  imageUrl?: string;
  generatedImageUrl?: string;
}

export interface Block {
  id: string;
  title: string;
  description: string;
  points: number;
  icon?: string;
  parentId?: string;
  difficulty: DifficultyLevel;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty?: DifficultyLevel;
}

export interface User {
  name: string;
  age: number;
  level: number;
  points: number;
  streak: number;
  interests?: string[];
  achievements?: Achievement[];
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Topic {
  id: string;
  name: string;
  description: string;
  difficulty: DifficultyLevel;
}

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
  difficulty?: DifficultyLevel;
}