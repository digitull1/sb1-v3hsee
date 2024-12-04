import { motion } from 'framer-motion';
import type { Block as BlockType } from '../../types';
import { cn, formatPoints } from '../../lib/utils';

interface BlockProps {
  block: BlockType;
  onClick: (block: BlockType) => void;
}

export function Block({ block, onClick }: BlockProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'cursor-pointer rounded-lg bg-white p-4 shadow-lg',
        'border-2 border-transparent hover:border-blue-400',
        'transition-colors duration-200'
      )}
      onClick={() => onClick(block)}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-800">{block.title}</h3>
        {block.icon && <span className="text-2xl">{block.icon}</span>}
      </div>
      <p className="mt-2 text-sm text-gray-600">{block.description}</p>
      <div className="mt-3 text-sm font-medium text-blue-500">
        {formatPoints(block.points)}
      </div>
    </motion.div>
  );
}