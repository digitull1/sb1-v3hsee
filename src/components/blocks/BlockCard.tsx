import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { Block } from '../../types';
import { cn } from '../../lib/utils';
import { DifficultyBadge } from '../difficulty/DifficultyBadge';

interface BlockCardProps {
  block: Block;
  onClick: (block: Block) => void;
}

export function BlockCard({ block, onClick }: BlockCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(block)}
      className={cn(
        'w-full text-left cursor-pointer rounded-xl',
        'bg-gradient-to-br from-white to-blue-50/50 p-4',
        'border-2 border-transparent hover:border-blue-400',
        'shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm'
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
          className="flex items-center gap-1"
        >
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700">
            +{block.points} points
          </span>
        </motion.div>

        <DifficultyBadge 
          difficulty={block.difficulty} 
          size="sm"
        />
      </div>
    </motion.div>
  );
}