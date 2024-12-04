import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LevelUpNotificationProps {
  level: number;
  points: number;
  isVisible: boolean;
  onClose: () => void;
}

export function LevelUpNotification({
  level,
  points,
  isVisible,
  onClose
}: LevelUpNotificationProps) {
  const showConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onAnimationComplete={showConfetti}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full text-center relative"
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
              <Trophy className="w-16 h-16 text-yellow-500" />
            </motion.div>

            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              Level Up! 🎉
            </h2>
            
            <p className="text-xl mb-6 text-gray-700">
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

            <p className="text-lg text-gray-600 mb-6">
              You've earned {points} magical points! Keep exploring to unlock more achievements!
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Continue Learning! ✨
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}