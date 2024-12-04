import { motion } from 'framer-motion';
import { Brain, Trophy, Target } from 'lucide-react';
import { useTopics } from '../../hooks/useTopics';
import { cn } from '../../lib/utils';

interface DifficultyIndicatorProps {
  topic: string;
}

export function DifficultyIndicator({ topic }: DifficultyIndicatorProps) {
  const { getDifficulty, getMastery } = useTopics();
  const difficulty = getDifficulty(topic);
  const mastery = getMastery(topic);
  const progress = Math.round(mastery * 100);

  const icons = {
    easy: Brain,
    medium: Trophy,
    hard: Target,
  };

  const Icon = icons[difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-blue-100"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2 rounded-lg',
            difficulty === 'easy' ? 'bg-green-100' :
            difficulty === 'medium' ? 'bg-yellow-100' :
            'bg-red-100'
          )}>
            <Icon className={cn(
              'w-5 h-5',
              difficulty === 'easy' ? 'text-green-600' :
              difficulty === 'medium' ? 'text-yellow-600' :
              'text-red-600'
            )} />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">
              {topic}
            </h3>
            <p className="text-sm text-gray-500">
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">
              Mastery: {progress}%
            </span>
          </div>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={cn(
                'h-full rounded-full',
                'bg-gradient-to-r',
                difficulty === 'easy' ? 'from-green-500 to-emerald-500' :
                difficulty === 'medium' ? 'from-yellow-500 to-orange-500' :
                'from-red-500 to-rose-500'
              )}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}