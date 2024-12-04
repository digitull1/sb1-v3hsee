import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { ChatMessage } from './ChatMessage';
import { TopicHeader } from './TopicHeader';
import { PersonalizedGreeting } from './PersonalizedGreeting';
import { SuggestedTopics } from './SuggestedTopics';
import { LoadingIndicator } from './LoadingIndicator';
import { FeatureSuggestion } from './FeatureSuggestion';
import { getRandomPrompt } from '../../lib/prompts/featurePrompts';
import type { Message, Block } from '../../types';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  onQuizComplete: (score: number, total: number) => void;
  onBlockClick: (block: Block) => void;
}

export function ChatContainer({
  messages = [],
  isLoading,
  onQuizComplete,
  onBlockClick,
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { topicState } = useStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTopicSelect = (topic: string) => {
    onBlockClick({
      id: `topic-${Date.now()}`,
      title: `Learn about ${topic}`,
      description: `Let's explore ${topic} together!`,
      points: 10,
      difficulty: 'easy',
      parentId: topic,
    });
  };

  const shouldShowFeaturePrompt = (index: number): boolean => {
    // Show feature prompts every 5 messages
    return (index + 1) % 5 === 0 && index < messages.length - 1;
  };

  const renderMessageItem = (message: Message, index: number) => {
    const messageKey = `message-${message.id}`;
    const promptKey = `prompt-${message.id}`;

    return (
      <motion.div key={messageKey} className="space-y-4">
        <ChatMessage
          message={message}
          onQuizComplete={onQuizComplete}
          onBlockClick={onBlockClick}
        />
        {shouldShowFeaturePrompt(index) && (
          <FeatureSuggestion
            key={promptKey}
            prompt={getRandomPrompt(
              index % 2 === 0 ? 'image_generation' : 'quiz'
            )}
          />
        )}
      </motion.div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-6">
        {messages.length === 0 ? (
          <>
            <PersonalizedGreeting />
            <SuggestedTopics onTopicSelect={handleTopicSelect} />
          </>
        ) : (
          topicState.currentTopic && <TopicHeader topic={topicState.currentTopic} />
        )}

        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => renderMessageItem(message, index))}
          {isLoading && <LoadingIndicator key="loading" topic={topicState.currentTopic} />}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}