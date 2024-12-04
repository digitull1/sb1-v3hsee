import { motion } from 'framer-motion';
import { Sparkles, Wand2 } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="relative"
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
        <div className="relative">
          <motion.div
            className="absolute -top-1 -left-1 w-full h-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <Wand2 className={`${iconSizes[size]} text-purple-500`} />
          </motion.div>
          <Wand2 className={`${iconSizes[size]} text-blue-500`} />
        </div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className={`${iconSizes[size]} text-yellow-400`} />
        </motion.div>
      </motion.div>
      
      <div className="flex flex-col">
        <motion.h1
          className={`font-bold ${sizes[size]}`}
          style={{
            background: 'linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '200% auto',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
        >
          Wonder Whiz
        </motion.h1>
        {size === 'lg' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent"
          >
            Your Magical Learning Companion
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}