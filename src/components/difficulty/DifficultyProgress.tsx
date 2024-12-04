import { motion } from 'framer-motion';
import { Trophy, Star, ArrowUp } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { DifficultyLevel } from '../../types';
import { DifficultyBadge } from './DifficultyBadge';

interface DifficultyProgressProps {
  topic: string;
  difficulty: DifficultyLevel;
  successRate: number;
  streakCount: number;
  showNextLevel?: boolean;
}

export function DifficultyProgress({
  topic,
  difficulty,
  successRate,
  streakCount,
  showNextLevel = true,
}: DifficultyProgressProps) {
  const progress = successRate * 100;
  const nextLevel = difficulty === 'easy' ? 'medium' : difficulty === 'medium' ? 'hard' : null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-800">
          {topic} Progress
        </h3>
        <DifficultyBadge difficulty={difficulty} />
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Mastery Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
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

        {/* Stats */}
        <div className="flex justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-600">Success Rate:</span>
            <span className="font-medium text-gray-800">
              {Math.round(successRate * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 text-orange-500" />
            <span className="text-gray-600">Streak:</span>
            <span className="font-medium text-gray-800">
              {streakCount}
            </span>
          </div>
        </div>

        {/* Next Level */}
        {showNextLevel && nextLevel && progress >= 80 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
          >
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <ArrowUp className="w-4 h-4" />
              <span>Almost ready for next level!</span>
            </div>
            <DifficultyBadge 
              difficulty={nextLevel} 
              size="sm"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}