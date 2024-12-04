import { useCallback } from 'react';
import type { Block } from '../types';
import { handleMessageSend } from '../lib/chat/handlers/messageHandler';
import { handleQuizComplete } from '../lib/chat/handlers/quizHandler';
import { handleBlockClick } from '../lib/chat/handlers/blockHandler';

interface ChatHandlerParams {
  store: any;
  memory: any;
  getDifficulty: (topic: string) => string;
  setIsLoading: (loading: boolean) => void;
  setLevelUpData: (data: { level: number; points: number }) => void;
  setShowLevelUp: (show: boolean) => void;
  setIsListening: (listening: boolean) => void;
}

export function useChatHandlers({
  store,
  memory,
  getDifficulty,
  setIsLoading,
  setLevelUpData,
  setShowLevelUp,
  setIsListening
}: ChatHandlerParams) {
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
    handleVoiceResult
  };
}