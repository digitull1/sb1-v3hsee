import { motion } from 'framer-motion';
import { Trophy, Star, Flame } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { calculateLevel, getNextLevelPoints } from '../../lib/gamification';

export function LevelProgress() {
  const { user } = useStore();
  if (!user) return null;

  const level = calculateLevel(user.points);
  const { current, next } = getNextLevelPoints(user.points);
  const progress = ((user.points - current) / (next - current)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-6 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-lg"
    >
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <span className="font-medium">Level {level}</span>
      </div>

      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-500" />
        <span className="font-medium">{user.points} points</span>
      </div>

      <div className="flex items-center gap-2">
        <Flame className="w-5 h-5 text-orange-500" />
        <span className="font-medium">{user.streak} day streak</span>
      </div>
    </motion.div>
  );
}