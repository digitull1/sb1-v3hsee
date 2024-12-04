import { motion, AnimatePresence } from 'framer-motion';
import { Award, Star } from 'lucide-react';

interface LevelUpModalProps {
  level: number;
  isOpen: boolean;
  onClose: () => void;
}

export function LevelUpModal({ level, isOpen, onClose }: LevelUpModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <Award className="w-16 h-16 text-yellow-500" />
            </motion.div>

            <h2 className="text-3xl font-bold mb-4">Level Up! 🎉</h2>
            <p className="text-xl mb-6">
              Congratulations! You've reached Level {level}!
            </p>

            <div className="flex justify-center space-x-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Star className="w-8 h-8 text-yellow-500 fill-current" />
                </motion.div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Continue Learning!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}