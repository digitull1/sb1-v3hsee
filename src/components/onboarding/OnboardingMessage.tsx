import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface OnboardingMessageProps {
  content?: string;
  type: 'assistant' | 'user' | 'input';
  onSubmit?: (value: string) => void;
  placeholder?: string;
  inputType?: 'text' | 'number';
  min?: number;
  max?: number;
  icon?: string;
}

export function OnboardingMessage({
  content,
  type,
  onSubmit,
  placeholder,
  inputType = 'text',
  min,
  max,
  icon,
}: OnboardingMessageProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !onSubmit) return;
    onSubmit(input.trim());
    setInput('');
  };

  if (type === 'input') {
    return (
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onSubmit={handleSubmit}
        className="flex gap-2"
      >
        <div className="flex-1 relative">
          <input
            type={inputType}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            min={min}
            max={max}
            placeholder={placeholder}
            className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-400 focus:outline-none transition-colors pl-12"
            autoFocus
          />
          {icon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
              {icon}
            </span>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!input.trim()}
          className="bg-blue-500 text-white rounded-xl px-6 py-3 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </motion.form>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`rounded-xl p-4 max-w-[80%] ${
          type === 'user'
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
            : 'bg-white shadow-lg text-gray-800 border border-blue-100'
        }`}
      >
        <p className="text-base leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </motion.div>
  );
}