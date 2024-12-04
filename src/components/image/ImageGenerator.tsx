import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, RefreshCw, X } from 'lucide-react';
import { getTopicPrompts } from '../../lib/api/image';
import { useImageGeneration } from '../../hooks/useImageGeneration';
import { ImagePreview } from './ImagePreview';
import { PromptSuggestions } from './PromptSuggestions';
import { cn } from '../../lib/utils';

interface ImageGeneratorProps {
  topic?: string;
  onImageGenerated: (imageUrl: string) => Promise<void>;
  onClose?: () => void;
}

export function ImageGenerator({ topic, onImageGenerated, onClose }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { isGenerating, error, generate, download } = useImageGeneration();

  const handleGenerate = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt;
    const imageUrl = await generate(finalPrompt);
    if (imageUrl) {
      setGeneratedImage(imageUrl);
      await onImageGenerated(imageUrl);
    }
  };

  const suggestedPrompts = getTopicPrompts(topic);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Create Magical Images ✨
        </h3>
        {onClose && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </motion.button>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to create..."
          className={cn(
            "flex-1 rounded-xl p-3",
            "border-2 border-blue-200",
            "focus:border-blue-400 focus:outline-none",
            "placeholder:text-gray-400",
            "transition-colors duration-200"
          )}
          disabled={isGenerating}
        />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleGenerate()}
          disabled={isGenerating || !prompt.trim()}
          className={cn(
            "rounded-xl px-4",
            "bg-gradient-to-r from-blue-500 to-purple-500",
            "text-white shadow-lg hover:shadow-xl",
            "transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isGenerating ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Wand2 className="w-5 h-5" />
          )}
        </motion.button>
      </div>

      <PromptSuggestions
        prompts={suggestedPrompts}
        onSelect={handleGenerate}
        isDisabled={isGenerating}
      />

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-lg bg-red-100 p-3 text-sm text-red-700"
          >
            {error}
          </motion.div>
        )}

        {generatedImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <ImagePreview
              imageUrl={generatedImage}
              isLoading={isGenerating}
              onDownload={() => download(generatedImage)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}