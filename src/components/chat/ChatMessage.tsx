import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useTopics } from '../../hooks/useTopics';
import { cn, formatTimestamp } from '../../lib/utils';
import { isTopicRelevant } from '../../lib/topics/topicDetector';
import type { Message, Block } from '../../types';
import { MessageBubble } from './MessageBubble';
import { MessageContent } from './MessageContent';
import { DifficultyBadge } from '../difficulty/DifficultyBadge';
import { TopicProgress } from './TopicProgress';
import { BlocksContainer } from '../blocks/BlocksContainer';
import { ChatQuiz } from './ChatQuiz';
import { downloadImage } from '../../lib/api/image';

interface ChatMessageProps {
  message: Message;
  onQuizComplete?: (score: number, total: number) => void;
  onBlockClick: (block: Block) => void;
}

export const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ message, onQuizComplete, onBlockClick }, ref) => {
    const { user, topicState } = useStore();
    const { getDifficulty } = useTopics();
    const isAssistant = message.sender === 'assistant';
    const difficulty = message.difficulty || (topicState.currentTopic ? 
      getDifficulty(topicState.currentTopic) : 'easy');

    const showTopicProgress = isAssistant && 
      topicState.currentTopic && 
      isTopicRelevant(message, topicState.currentTopic);

    const handleImageDownload = async () => {
      if (message.generatedImageUrl) {
        try {
          await downloadImage(
            message.generatedImageUrl,
            `wonder-whiz-${Date.now()}.png`
          );
        } catch (error) {
          console.error('Error downloading image:', error);
        }
      }
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'flex w-full px-4 sm:px-6',
          isAssistant ? 'justify-start' : 'justify-end'
        )}
      >
        <MessageBubble
          content={message.content}
          isAssistant={isAssistant}
          difficulty={difficulty}
        >
          {showTopicProgress && message.difficulty && (
            <div className="mb-2 flex items-center justify-between">
              <DifficultyBadge 
                difficulty={message.difficulty} 
                size="sm"
              />
              <TopicProgress 
                topic={topicState.currentTopic}
                difficulty={message.difficulty}
              />
            </div>
          )}

          <MessageContent content={message.content} isAssistant={isAssistant} />

          {(message.imageUrl || message.generatedImageUrl) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 relative group"
            >
              <img
                src={message.generatedImageUrl || message.imageUrl}
                alt={message.generatedImageUrl ? "AI generated artwork" : "Uploaded image"}
                className="w-full rounded-lg shadow-lg"
              />
              {message.generatedImageUrl && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-2 right-2 flex gap-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleImageDownload}
                    className="p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Download className="w-5 h-5 text-blue-500" />
                  </motion.button>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}

          {message.blocks && message.blocks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4"
            >
              <BlocksContainer
                topic={topicState.currentTopic || 'general'}
                onBlockClick={onBlockClick}
              />
            </motion.div>
          )}

          {message.quiz && onQuizComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4"
            >
              <ChatQuiz
                questions={message.quiz}
                onComplete={onQuizComplete}
              />
            </motion.div>
          )}

          <div className="mt-2 text-right">
            <span className="text-xs text-gray-400">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>
        </MessageBubble>
      </motion.div>
    );
  }
);

ChatMessage.displayName = 'ChatMessage';