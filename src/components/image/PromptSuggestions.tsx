import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { ImagePrompt } from '../../lib/api/image/types';

interface PromptSuggestionsProps {
  prompts: ImagePrompt[];
  onSelect: (prompt: string) => void;
  isDisabled?: boolean;
}

export function PromptSuggestions({
  prompts,
  onSelect,
  isDisabled,
}: PromptSuggestionsProps) {
  if (prompts.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Sparkles className="w-4 h-4" />
        <span>Suggested prompts</span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
        {prompts.map((prompt, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(prompt.text)}
            disabled={isDisabled}
            className={cn(
              "flex-shrink-0 rounded-full px-4 py-2",
              "bg-gradient-to-r from-blue-100 to-indigo-100",
              "text-sm font-medium text-blue-700",
              "hover:from-blue-200 hover:to-indigo-200",
              "transition-colors duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {prompt.text}
          </motion.button>
        ))}
      </div>
    </div>
  );
}