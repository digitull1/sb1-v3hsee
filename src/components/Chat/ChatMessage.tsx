import { motion } from 'framer-motion';
import type { Message } from '../../types';
import { BlockScroller } from '../blocks';
import { useStore } from '../../store/useStore';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { updatePoints } = useStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${
        message.sender === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`rounded-xl p-4 max-w-[85%] ${
          message.sender === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-800 shadow-lg'
        }`}
      >
        <p className="whitespace-pre-wrap text-base leading-relaxed">
          {message.content}
        </p>
        {message.blocks && message.blocks.length > 0 && (
          <BlockScroller
            blocks={message.blocks}
            onBlockClick={(block) => {
              updatePoints(block.points);
            }}
          />
        )}
      </div>
    </motion.div>
  );
}