import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import useMeasure from 'react-use-measure';
import { useTopics } from '../../hooks/useTopics';
import { cn } from '../../lib/utils';
import type { Block } from '../../types';

interface DynamicBlockScrollerProps {
  blocks: Block[];
  onBlockClick: (block: Block) => void;
  showDifficulty?: boolean;
}

export function DynamicBlockScroller({
  blocks,
  onBlockClick,
  showDifficulty = true,
}: DynamicBlockScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [containerRef, { width }] = useMeasure();
  const { getDifficulty } = useTopics();

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = width * 0.8;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative" ref={containerRef}>
      <motion.div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {blocks.map((block, index) => (
          <motion.div
            key={block.id}
            className="flex-shrink-0 w-72 sm:w-80 snap-start"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.3,
              delay: index * 0.1,
              type: "spring",
              stiffness: 100 
            }}
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onBlockClick(block)}
              className={cn(
                'w-full cursor-pointer rounded-xl p-4',
                'bg-gradient-to-br from-white to-blue-50/50',
                'border-2 border-transparent',
                block.difficulty === 'easy' ? 'hover:border-green-400' :
                block.difficulty === 'medium' ? 'hover:border-yellow-400' :
                'hover:border-red-400',
                'shadow-lg hover:shadow-xl transition-all duration-200'
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
                  {block.icon || '✨'}
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
                  <Sparkles className="w-4 h-4" />
                  +{block.points} points
                </motion.div>

                {showDifficulty && (
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
          </motion.div>
        ))}
      </motion.div>

      {blocks.length > 2 && (
        <>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-blue-500" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-blue-500" />
          </motion.button>
        </>
      )}
    </div>
  );
}