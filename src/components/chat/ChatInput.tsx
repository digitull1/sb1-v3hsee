import { useState } from 'react';
import { Send, Wand2, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { VoiceInput } from '../multimodal/VoiceInput';
import { ImageUpload } from '../multimodal/ImageUpload';
import { ImageGenerator } from '../image/ImageGenerator';

interface ChatInputProps {
  onSend: (content: string) => Promise<void>;
  isLoading: boolean;
  isListening: boolean;
  onVoiceResult: (transcript: string) => void;
  toggleListening: () => void;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  isLoading,
  isListening,
  onVoiceResult,
  toggleListening,
  placeholder
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [showImageGenerator, setShowImageGenerator] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    await onSend(input.trim());
    setInput('');
  };

  const handleImageGenerated = async (imageUrl: string) => {
    const message = ['I created this magical image:', imageUrl].join(' ');
    await onSend(message);
    setShowImageGenerator(false);
  };

  return (
    <motion.div 
      initial={false}
      animate={{ 
        y: isListening ? -20 : 0,
        scale: isListening ? 1.02 : 1,
      }}
      className={cn(
        'border-t bg-white/80 backdrop-blur-sm p-4 sm:p-6',
        'shadow-lg safe-area-bottom',
        'transition-all duration-200'
      )}
    >
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 max-w-4xl mx-auto"
      >
        <div className="flex gap-2">
          <VoiceInput
            onResult={onVoiceResult}
            isListening={isListening}
            toggleListening={toggleListening}
          />
          
          <ImageUpload 
            onUpload={async (file) => {
              // Handle image upload
            }}
            icon={<Camera className="w-5 h-5" />}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setShowImageGenerator(!showImageGenerator)}
            className={cn(
              'p-2 rounded-full',
              'bg-gradient-to-r from-purple-500 to-pink-500',
              'text-white shadow-lg hover:shadow-xl',
              'transition-all duration-200'
            )}
          >
            <Wand2 className="w-5 h-5" />
          </motion.button>
        </div>
        
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading || isListening}
            className={cn(
              'w-full rounded-xl border-2 p-3',
              'focus:outline-none transition-all duration-200',
              'placeholder:text-gray-400',
              'text-base sm:text-lg',
              'border-blue-100 focus:border-blue-400'
            )}
            maxLength={500}
          />
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isLoading || !input.trim()}
          className={cn(
            'text-white rounded-xl p-3',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200',
            'shadow-md hover:shadow-lg',
            'bg-gradient-to-r from-blue-500 to-indigo-500'
          )}
        >
          <Send className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>
      </form>

      {showImageGenerator && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="mt-4 p-4 bg-white rounded-xl shadow-lg"
        >
          <ImageGenerator
            onImageGenerated={handleImageGenerated}
            onClose={() => setShowImageGenerator(false)}
          />
        </motion.div>
      )}
    </motion.div>
  );
}