import { useCallback } from 'react';
import { useStore } from '../../../store/useStore';
import { useMemory } from '../../../hooks/useMemory';
import { useDifficulty } from '../../../hooks/useDifficulty';
import { handleMessageSend } from '../../../lib/chat/handlers/messageHandler';
import { handleQuizComplete } from '../../../lib/chat/handlers/quizHandler';
import { handleBlockClick } from '../../../lib/chat/handlers/blockHandler';
import { getInputPlaceholder } from '../utils/messageUtils';
import type { Block } from '../../../types';

interface ChatHandlerParams {
  setIsLoading: (loading: boolean) => void;
  setLevelUpData: (data: { level: number; points: number }) => void;
  setShowLevelUp: (show: boolean) => void;
  setIsListening: (listening: boolean) => void;
  userName?: string;
}

export function useChatHandlers({
  setIsLoading,
  setLevelUpData,
  setShowLevelUp,
  setIsListening,
  userName
}: ChatHandlerParams) {
  const store = useStore();
  const memory = useMemory();
  const { getDifficulty } = useDifficulty();

  const handleSend = useCallback(async (content: string) => {
    if (!store.user) return;
    
    await handleMessageSend({
      content,
      user: store.user,
      messages: store.messages,
      topicState: store.topicState,
      getDifficulty,
      getRecentContext: memory.getRecentContext,
      addMessage: store.addMessage,
      setIsLoading
    });
  }, [store, memory, getDifficulty, setIsLoading]);

  const handleQuizComplete = useCallback((score: number, total: number) => {
    if (!store.user) return;

    handleQuizComplete({
      score,
      total,
      userPoints: store.user.points,
      userLevel: store.user.level,
      updatePoints: store.updatePoints,
      setLevelUpData,
      setShowLevelUp
    });
  }, [store, setLevelUpData, setShowLevelUp]);

  const handleBlockClick = useCallback((block: Block) => {
    handleBlockClick({
      block,
      setCurrentTopic: store.setCurrentTopic,
      handleSend
    });
  }, [store.setCurrentTopic, handleSend]);

  const handleVoiceResult = useCallback((transcript: string) => {
    setIsListening(false);
    handleSend(transcript);
  }, [setIsListening, handleSend]);

  return {
    handleSend,
    handleQuizComplete,
    handleBlockClick,
    handleVoiceResult,
    getInputPlaceholder: useCallback(() => getInputPlaceholder(userName), [userName])
  };
}