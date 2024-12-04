import { motion } from 'framer-motion';
import type { Block } from '../types';
import { cn } from '../lib/utils';

interface BlockListProps {
  blocks: Block[];
  onBlockClick: (block: Block) => void;
}

export function BlockList({ blocks, onBlockClick }: BlockListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {blocks.map((block) => (
        <motion.div
          key={block.id}
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onBlockClick(block)}
          className={cn(
            'w-full text-left cursor-pointer rounded-xl bg-gradient-to-br from-white to-blue-50/50 p-4',
            'border-2 border-transparent hover:border-blue-400',
            'shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm',
            'active:scale-95'
          )}
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {block.title}
            </h3>
            <motion.span
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 0.9, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="text-2xl flex-shrink-0"
            >
              {block.icon}
            </motion.span>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            {block.description}
          </p>
          
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-1 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full shadow-sm"
            >
              +{block.points} points ✨
            </motion.div>

            {block.difficulty && (
              <span className={cn(
                'text-sm font-medium px-3 py-1.5 rounded-full',
                block.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                block.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              )}>
                {block.difficulty.charAt(0).toUpperCase() + block.difficulty.slice(1)}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}