import { motion } from 'framer-motion';
import { Brain, Trophy, Target } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { DifficultyLevel } from '../../types';

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animate?: boolean;
}

export function DifficultyBadge({
  difficulty,
  size = 'md',
  showLabel = true,
  animate = true,
}: DifficultyBadgeProps) {
  const icons = {
    easy: Brain,
    medium: Trophy,
    hard: Target,
  };

  const sizes = {
    sm: 'text-xs px-2 py-1 gap-1',
    md: 'text-sm px-3 py-1.5 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const Icon = icons[difficulty];

  return (
    <motion.div
      whileHover={animate ? { scale: 1.05 } : undefined}
      whileTap={animate ? { scale: 0.95 } : undefined}
      className={cn(
        'inline-flex items-center rounded-full',
        sizes[size],
        difficulty === 'easy' ? 'bg-green-100 text-green-700' :
        difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
        'bg-red-100 text-red-700'
      )}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && (
        <span className="capitalize font-medium">
          {difficulty}
        </span>
      )}
    </motion.div>
  );
}