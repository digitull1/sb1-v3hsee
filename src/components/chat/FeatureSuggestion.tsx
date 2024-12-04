import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { FeaturePrompt } from '../../lib/prompts/featurePrompts';

interface FeatureSuggestionProps {
  prompt: FeaturePrompt;
  onClick?: () => void;
}

export function FeatureSuggestion({ prompt, onClick }: FeatureSuggestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'bg-gradient-to-r from-blue-50 to-indigo-50',
        'rounded-lg p-4 shadow-md border border-blue-100',
        'cursor-pointer hover:shadow-lg transition-all duration-200',
        onClick && 'hover:scale-[1.02]'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
        <div className="space-y-2">
          <p className="text-gray-700">{prompt.text}</p>
          {prompt.points && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-500">
                +{prompt.points} points
              </span>
              <span className="text-sm text-gray-500">
                Complete this to earn points! ✨
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}