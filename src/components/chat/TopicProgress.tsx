import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useTopics } from '../../hooks/useTopics';
import type { DifficultyLevel } from '../../types';
import { cn } from '../../lib/utils';

interface TopicProgressProps {
  topic: string;
  difficulty: DifficultyLevel;
}

export function TopicProgress({ topic, difficulty }: TopicProgressProps) {
  const { getMastery } = useTopics();
  const mastery = getMastery(topic);
  const progress = Math.round(mastery * 100);

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
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
      <div className="flex items-center gap-1 text-sm">
        <Trophy className={cn(
          'w-4 h-4',
          difficulty === 'easy' ? 'text-green-500' :
          difficulty === 'medium' ? 'text-yellow-500' :
          'text-red-500'
        )} />
        <span className="font-medium">{progress}%</span>
      </div>
    </div>
  );
}