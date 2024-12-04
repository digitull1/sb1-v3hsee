import { motion } from 'framer-motion';
import type { Block } from '../../types';
import { cn } from '../../lib/utils';
import { DifficultyBadge } from '../difficulty/DifficultyBadge';

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
            'w-full text-left cursor-pointer rounded-xl',
            'bg-gradient-to-br from-white to-blue-50/50 p-4',
            'border-2 border-transparent',
            block.difficulty === 'easy' ? 'hover:border-green-400' :
            block.difficulty === 'medium' ? 'hover:border-yellow-400' :
            'hover:border-red-400',
            'shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm',
            'active:scale-95'
          )}
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className={cn(
              'text-lg font-semibold bg-clip-text text-transparent',
              block.difficulty === 'easy' ? 'bg-gradient-to-r from-green-600 to-emerald-600' :
              block.difficulty === 'medium' ? 'bg-gradient-to-r from-yellow-600 to-orange-600' :
              'bg-gradient-to-r from-red-600 to-rose-600'
            )}>
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
              className="text-2xl"
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
              className={cn(
                'flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full',
                block.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                block.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              )}
            >
              +{block.points} points ✨
            </motion.div>

            <DifficultyBadge 
              difficulty={block.difficulty} 
              size="sm"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}