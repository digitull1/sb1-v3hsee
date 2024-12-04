import { motion } from 'framer-motion';
import { Wand2, Sparkles } from 'lucide-react';
import { Logo } from './branding/Logo';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
        <Logo size="lg" />
        
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex items-center justify-center gap-2"
        >
          <Wand2 className="w-8 h-8 text-blue-500" />
          <Sparkles className="w-6 h-6 text-yellow-500" />
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600"
        >
          Preparing your magical learning adventure...
        </motion.p>
      </motion.div>
    </div>
  );
}