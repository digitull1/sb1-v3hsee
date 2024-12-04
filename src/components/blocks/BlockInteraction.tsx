import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import type { Block } from '../../types';
import { BlockCard } from './BlockCard';
import { createBreadcrumb } from '../../lib/utils';

interface BlockInteractionProps {
  block: Block;
  onSelect: (block: Block) => void;
  onDismiss: () => void;
  isActive: boolean;
}

export function BlockInteraction({
  block,
  onSelect,
  onDismiss,
  isActive,
}: BlockInteractionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);

  const [{ y }, api] = useSpring(() => ({ y: 0 }));

  const bind = useDrag(({ down, movement: [_, my], velocity, direction: [_, dy] }) => {
    setIsDragging(down);
    
    if (down) {
      api.start({ y: my, immediate: true });
    } else {
      const shouldDismiss = velocity > 0.5 && dy > 0;
      if (shouldDismiss) {
        api.start({ y: 500, immediate: false });
        onDismiss();
      } else {
        api.start({ y: 0, immediate: false });
      }
    }
  });

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onDismiss();
            }
          }}
        >
          <animated.div
            {...bind()}
            style={{ y }}
            className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-6">
              {block.parentId && (
                <div className="text-sm text-gray-500 mb-4">
                  {createBreadcrumb([block])}
                </div>
              )}
              
              <BlockCard
                block={block}
                onClick={() => !isDragging && onSelect(block)}
                showDetails
              />
              
              <div className="mt-6 text-center text-gray-500 text-sm">
                Swipe down to dismiss
              </div>
            </div>
          </animated.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}