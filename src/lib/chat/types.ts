import type { Message, Block, DifficultyLevel, User } from '../../types';

export interface ChatState {
  user: User | null;
  messages: Message[];
  topicState: TopicState;
  isLoading: boolean;
  error: string | null;
}

export interface TopicState {
  currentTopic: string | null;
  topicMessageCount: number;
}

export interface MessageHandlerParams {
  content: string;
  user: User;
  messages: Message[];
  topicState: TopicState;
  getDifficulty: (topic: string) => DifficultyLevel;
  getRecentContext: () => string[];
  addMessage: (message: Message) => Promise<void>;
  setIsLoading: (loading: boolean) => void;
}

export interface QuizHandlerParams {
  score: number;
  total: number;
  userPoints: number;
  userLevel: number;
  updatePoints: (points: number) => void;
  setLevelUpData: (data: { level: number; points: number }) => void;
  setShowLevelUp: (show: boolean) => void;
}

export interface BlockHandlerParams {
  block: Block;
  setCurrentTopic: (topic: string | null) => void;
  handleSend: (content: string) => void;
}

export interface ImageGenerationParams {
  content: string;
  age: number;
  addMessage: (message: Message) => Promise<void>;
}