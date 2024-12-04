import { useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { memoryManager } from '../lib/memory/memoryManager';

export function useMemory() {
  const { user, messages } = useStore();

  useEffect(() => {
    if (user) {
      memoryManager.initialize(user);
    }
  }, [user]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage) {
        memoryManager.addMessage(lastMessage);
        
        if (lastMessage.sender === 'assistant') {
          memoryManager.addContext(lastMessage.content);
        }
      }
    }
  }, [messages]);

  const getPersonalizedGreeting = useCallback(() => {
    return memoryManager.getPersonalizedGreeting();
  }, []);

  const getSuggestedTopics = useCallback(() => {
    return memoryManager.getSuggestedTopics();
  }, []);

  const getRecentContext = useCallback(() => {
    return memoryManager.getRecentContext();
  }, []);

  return {
    getPersonalizedGreeting,
    getSuggestedTopics,
    getRecentContext,
  };
}