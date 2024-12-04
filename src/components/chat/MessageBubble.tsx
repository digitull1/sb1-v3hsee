import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { DifficultyLevel } from '../../types';

interface MessageBubbleProps {
  content: string;
  isAssistant: boolean;
  difficulty?: DifficultyLevel;
  children?: React.ReactNode;
}

export function MessageBubble({ content, isAssistant, difficulty, children }: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        'rounded-2xl p-4 sm:p-5',
        'max-w-[85%] sm:max-w-[75%]',
        'transform transition-all duration-200',
        isAssistant ? [
          'bg-gradient-to-br from-white via-white to-blue-50/80',
          'text-gray-800',
          'shadow-lg hover:shadow-xl',
          'border border-blue-100',
          'backdrop-blur-sm'
        ] : [
          'bg-gradient-to-r',
          difficulty === 'easy' ? 'from-green-500 to-emerald-500' :
          difficulty === 'medium' ? 'from-yellow-500 to-orange-500' :
          difficulty === 'hard' ? 'from-red-500 to-rose-500' :
          'from-blue-500 to-indigo-500',
          'text-white',
          'shadow-lg hover:shadow-xl'
        ]
      )}
    >
      {children}
    </motion.div>
  );
}