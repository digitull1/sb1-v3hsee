import { motion } from 'framer-motion';
import type { Block } from '../../types';
import { BlockScroller } from './BlockScroller';

interface TopicBlocksProps {
  topic: string;
  blocks: Block[];
  onBlockSelect: (block: Block) => void;
}

export function TopicBlocks({ topic, blocks, onBlockSelect }: TopicBlocksProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="py-4"
    >
      <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Discover {topic}
      </h3>
      <BlockScroller blocks={blocks} onBlockClick={onBlockSelect} />
    </motion.div>
  );
}