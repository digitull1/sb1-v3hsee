import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useMemory } from '../../hooks/useMemory';
import { useStore } from '../../store/useStore';

export function PersonalizedGreeting() {
  const { user } = useStore();
  const { getPersonalizedGreeting } = useMemory();

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 shadow-lg border border-blue-100"
    >
      <div className="flex items-start gap-3">
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <Sparkles className="w-6 h-6 text-blue-500" />
        </motion.div>
        
        <div className="space-y-1">
          <h2 className="text-lg font-medium text-gray-800">
            Welcome back, {user.name}! 👋
          </h2>
          <p className="text-gray-600">
            {getPersonalizedGreeting()}
          </p>
        </div>
      </div>
    </motion.div>
  );
}