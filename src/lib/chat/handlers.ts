import type { Block, Message } from '../../types';
import { generateResponse } from '../api/chat';
import { handleImageGeneration } from './imageUtils';
import { createUserMessage, createAssistantMessage, createErrorMessage } from './messageUtils';

export async function handleMessageSend({
  content,
  user,
  messages,
  topicState,
  getDifficulty,
  getRecentContext,
  addMessage,
  setIsLoading,
}: {
  content: string;
  user: any;
  messages: Message[];
  topicState: any;
  getDifficulty: (topic: string) => string;
  getRecentContext: () => string[];
  addMessage: (message: Message) => Promise<void>;
  setIsLoading: (loading: boolean) => void;
}) {
  if (!content.trim() || !user) return;

  const userMessage = createUserMessage(content);
  await addMessage(userMessage);
  setIsLoading(true);

  try {
    const includeQuiz = topicState.currentTopic && topicState.topicMessageCount % 5 === 0;
    const currentTopic = topicState.currentTopic || 'general';
    const currentDifficulty = getDifficulty(currentTopic);
    const recentContext = getRecentContext();

    const generatedImageUrl = await handleImageGeneration(content, user.age, addMessage);

    const response = await generateResponse(
      [...messages, userMessage],
      user.age,
      includeQuiz,
      recentContext,
      currentDifficulty
    );

    const assistantMessage = createAssistantMessage(response.content, {
      blocks: response.blocks,
      quiz: response.quiz,
      difficulty: currentDifficulty,
      generatedImageUrl
    });

    await addMessage(assistantMessage);
  } catch (error) {
    await addMessage(createErrorMessage(error));
  } finally {
    setIsLoading(false);
  }
}

export function handleQuizComplete({
  score,
  total,
  userPoints,
  userLevel,
  updatePoints,
  setLevelUpData,
  setShowLevelUp,
}: {
  score: number;
  total: number;
  userPoints: number;
  userLevel: number;
  updatePoints: (points: number) => void;
  setLevelUpData: (data: { level: number; points: number }) => void;
  setShowLevelUp: (show: boolean) => void;
}) {
  const points = score * 10;
  const newLevel = Math.floor(Math.sqrt(userPoints + points) / 10) + 1;
  
  if (newLevel > userLevel) {
    setLevelUpData({ level: newLevel, points });
    setShowLevelUp(true);
  }
  
  updatePoints(points);
}

export function handleBlockClick({
  block,
  setCurrentTopic,
  handleSend,
}: {
  block: Block;
  setCurrentTopic: (topic: string | null) => void;
  handleSend: (content: string) => void;
}) {
  if (block.parentId) {
    setCurrentTopic(block.parentId);
  }
  handleSend(`Tell me about ${block.title}`);
}