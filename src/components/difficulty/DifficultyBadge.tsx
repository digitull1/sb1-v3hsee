import { motion } from 'framer-motion';
import { Zap, Shield, Target } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { DifficultyLevel } from '../../types';

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function DifficultyBadge({ 
  difficulty, 
  size = 'md',
  showLabel = true 
}: DifficultyBadgeProps) {
  const icons = {
    easy: Zap,
    medium: Shield,
    hard: Target,
  };

  const colors = {
    easy: 'from-green-500 to-emerald-500 text-green-100',
    medium: 'from-yellow-500 to-orange-500 text-yellow-100',
    hard: 'from-red-500 to-rose-500 text-red-100',
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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'inline-flex items-center rounded-full',
        'bg-gradient-to-r shadow-md',
        'font-medium',
        colors[difficulty],
        sizes[size]
      )}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && (
        <span className="capitalize">
          {difficulty}
        </span>
      )}
    </motion.div>
  );
}