import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Achievement } from '../../types';

interface AchievementPopupProps {
  achievement: Achievement;
  onClose: () => void;
}

export function AchievementPopup({ achievement, onClose }: AchievementPopupProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl p-4 max-w-sm"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {achievement.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {achievement.description}
            </p>
            <p className="text-sm font-medium text-blue-500 mt-2">
              +{achievement.points} points earned! 🌟
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}