import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';
import { useTopics } from '../../hooks/useTopics';

interface MessageContentProps {
  content: string;
  isAssistant: boolean;
}

export function MessageContent({ content, isAssistant }: MessageContentProps) {
  const { user, topicState } = useStore();
  const { getDifficulty } = useTopics();
  const paragraphs = content.split('\n').filter(Boolean);
  
  return (
    <div className="prose prose-sm sm:prose max-w-none">
      {paragraphs.map((paragraph, index) => {
        const isFact = /^\d+\)/.test(paragraph);
        const isQuestion = paragraph.endsWith('?');
        const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(paragraph);
        const difficulty = topicState.currentTopic ? 
          getDifficulty(topicState.currentTopic) : 'easy';
        
        return (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'mb-2 last:mb-0',
              'text-base sm:text-lg',
              'leading-relaxed',
              isAssistant ? [
                'text-gray-800',
                isFact && cn(
                  'pl-4 border-l-2 rounded-r-lg py-1',
                  difficulty === 'easy' ? 'border-green-300 bg-green-50/50' :
                  difficulty === 'medium' ? 'border-yellow-300 bg-yellow-50/50' :
                  'border-red-300 bg-red-50/50'
                ),
                isQuestion && cn(
                  'font-medium',
                  difficulty === 'easy' ? 'text-green-600' :
                  difficulty === 'medium' ? 'text-yellow-600' :
                  'text-red-600'
                ),
                hasEmoji && 'text-lg sm:text-xl'
              ] : 'text-white',
              'transition-all duration-200'
            )}
          >
            {isAssistant && paragraph.includes(user?.name) ? (
              <motion.span
                initial={{ color: '#2563EB' }}
                animate={{ color: '#1E40AF' }}
                transition={{ duration: 0.5 }}
                className="font-medium"
              >
                {paragraph}
              </motion.span>
            ) : (
              paragraph
            )}
          </motion.p>
        );
      })}
    </div>
  );
}