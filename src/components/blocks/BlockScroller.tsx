import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useMeasure from 'react-use-measure';
import type { Block } from '../../types';
import { BlockCard } from './BlockCard';

interface BlockScrollerProps {
  blocks: Block[];
  onBlockClick: (block: Block) => void;
}

export function BlockScroller({ blocks, onBlockClick }: BlockScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [containerRef, { width }] = useMeasure();

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
            <BlockCard block={block} onClick={onBlockClick} />
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