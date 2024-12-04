import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LoadingIndicatorProps {
  topic?: string | null;
  message?: string;
  isRetrying?: boolean;
}

export function LoadingIndicator({ topic, message, isRetrying }: LoadingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex justify-start px-4 sm:px-6"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`dot-${i}`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className={cn(
                  'w-2 h-2 rounded-full',
                  isRetrying ? 'bg-yellow-500' : topic ? 'bg-green-500' : 'bg-blue-500'
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {message || (topic ? `Exploring ${topic}...` : 'Thinking...')}
            </span>
            {isRetrying && (
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}