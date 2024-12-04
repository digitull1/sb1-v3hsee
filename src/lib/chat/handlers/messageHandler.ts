import type { MessageHandlerParams } from '../types';
import { generateResponse } from '../../api/chat';
import { handleImageGeneration } from '../utils/imageUtils';
import { createUserMessage, createAssistantMessage, createErrorMessage } from '../utils/messageUtils';
import { QUIZ_INTERVAL } from '../constants';

export async function handleMessageSend({
  content,
  user,
  messages,
  topicState,
  getDifficulty,
  getRecentContext,
  addMessage,
  setIsLoading,
}: MessageHandlerParams): Promise<void> {
  if (!content.trim() || !user) return;

  const userMessage = createUserMessage(content);
  await addMessage(userMessage);
  setIsLoading(true);

  try {
    const includeQuiz = shouldIncludeQuiz(topicState);
    const currentTopic = topicState.currentTopic || 'general';
    const currentDifficulty = getDifficulty(currentTopic);
    const recentContext = getRecentContext();

    const generatedImageUrl = await handleImageGeneration({
      content,
      age: user.age,
      addMessage
    });

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

function shouldIncludeQuiz(topicState: { currentTopic: string | null; topicMessageCount: number }): boolean {
  return Boolean(
    topicState.currentTopic && 
    topicState.topicMessageCount % QUIZ_INTERVAL === 0
  );
}