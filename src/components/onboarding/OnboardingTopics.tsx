import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { BlockList } from '../BlockList';
import type { Block } from '../../types';
import { useStore } from '../../store/useStore';
import { generateOnboardingBlocks } from '../../lib/api/onboarding/generateBlocks';
import { handleBlockClick } from '../../lib/api/chat/handleBlockClick';

interface OnboardingTopicsProps {
  onSubmit: (topics: string[]) => void;
  initialAge: number;
}

export function OnboardingTopics({ onSubmit, initialAge }: OnboardingTopicsProps) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addMessage, setUser } = useStore();

  useEffect(() => {
    async function loadTopics() {
      setIsLoading(true);
      setError(null);
      try {
        const topicBlocks = await generateOnboardingBlocks(initialAge);
        setBlocks(topicBlocks);
      } catch (error) {
        console.error('Error loading topic blocks:', error);
        setError('Having trouble loading topics. Please try again!');
      } finally {
        setIsLoading(false);
      }
    }
    loadTopics();
  }, [initialAge]);

  const handleBlockSelect = async (block: Block) => {
    if (!block.parentId) return;
    setIsLoading(true);

    try {
      // Initialize user before first interaction
      if (!selectedTopics.length) {
        setUser({
          name: 'User',
          age: initialAge,
          level: 1,
          points: 0,
          streak: 0,
        });
      }

      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        content: `Tell me about ${block.title}`,
        sender: 'user' as const,
        timestamp: Date.now(),
      };
      addMessage(userMessage);

      // Get AI response
      const response = await handleBlockClick(block, initialAge, 'User');
      addMessage(response);

      // Update selected topics
      if (!selectedTopics.includes(block.parentId)) {
        setSelectedTopics(prev => [...prev, block.parentId!]);
        onSubmit([block.parentId]);
      }
    } catch (error) {
      console.error('Error handling block selection:', error);
      setError('Oops! Something went wrong. Please try again!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="text-center mb-8">
        <motion.h2 
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
          animate={{ 
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ backgroundSize: '200% auto' }}
        >
          Choose Your Learning Adventure!
        </motion.h2>
        <p className="text-gray-600">
          Click on any topic that sparks your curiosity ✨
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Sparkles className="w-12 h-12 text-blue-500" />
          </motion.div>
        </div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      ) : (
        <BlockList blocks={blocks} onBlockClick={handleBlockSelect} />
      )}
    </motion.div>
  );
}