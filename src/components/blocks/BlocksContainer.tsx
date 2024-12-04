import { motion } from 'framer-motion';
import { DynamicBlocks } from './DynamicBlocks';
import type { Block } from '../../types';
import { TopicCategory, getTopicName } from '../../lib/topics/topicDetector';

interface BlocksContainerProps {
  topic: TopicCategory;
  onBlockClick: (block: Block) => void;
}

export function BlocksContainer({
  topic,
  onBlockClick,
}: BlocksContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <motion.h3
          className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
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
          Explore {getTopicName(topic)}
        </motion.h3>
        <p className="text-sm text-gray-600">
          Click any question to dive deeper into your discovery! ✨
        </p>
      </div>

      <DynamicBlocks
        topic={topic}
        onBlockClick={onBlockClick}
      />
    </motion.div>
  );
}