import { motion } from 'framer-motion';
import { useMemory } from '../../hooks/useMemory';
import { DynamicBlockScroller } from '../blocks/DynamicBlockScroller';
import type { Block } from '../../types';
import { getTopicIcon } from '../../lib/utils';

interface SuggestedTopicsProps {
  onTopicSelect: (topic: string) => void;
}

export function SuggestedTopics({ onTopicSelect }: SuggestedTopicsProps) {
  const { getSuggestedTopics } = useMemory();
  const topics = getSuggestedTopics();

  const blocks: Block[] = topics.map((topic, index) => ({
    id: `suggested-${index}`,
    title: `Explore ${topic}`,
    description: `Continue your journey in ${topic}!`,
    points: 10,
    icon: getTopicIcon(topic),
    difficulty: 'easy',
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-medium text-gray-800">
        Pick up where you left off ✨
      </h3>
      
      <DynamicBlockScroller
        blocks={blocks}
        onBlockClick={(block) => {
          const topic = block.title.replace('Explore ', '');
          onTopicSelect(topic);
        }}
      />
    </motion.div>
  );
}