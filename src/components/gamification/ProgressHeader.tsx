import { motion } from 'framer-motion';
import { Trophy, Star, Flame } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useDifficulty } from '../../hooks/useDifficulty';
import { DifficultyBadge } from '../difficulty/DifficultyBadge';

export function ProgressHeader() {
  const { user, topicState } = useStore();
  const { getOverallDifficulty } = useDifficulty();
  
  if (!user) return null;

  const difficulty = getOverallDifficulty();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50 py-3 px-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-2 rounded-xl shadow-sm"
          >
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-medium text-gray-800">Level {user.level}</span>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-xl shadow-sm"
          >
            <Star className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-gray-800">{user.points} points</span>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-red-50 px-4 py-2 rounded-xl shadow-sm"
          >
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="font-medium text-gray-800">{user.streak} day streak</span>
          </motion.div>
        </div>

        <div className="flex items-center gap-3">
          {topicState.currentTopic && (
            <span className="text-sm text-gray-600">
              Current Topic: {topicState.currentTopic}
            </span>
          )}
          <DifficultyBadge 
            difficulty={difficulty}
            showLabel
          />
        </div>
      </div>
    </motion.div>
  );
}