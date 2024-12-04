import { motion } from 'framer-motion';
import { Brain, Star } from 'lucide-react';
import { useTopics } from '../../hooks/useTopics';
import { DifficultyBadge } from '../difficulty/DifficultyBadge';
import { cn } from '../../lib/utils';
import { TopicCategory, getTopicName, getTopicIcon } from '../../lib/topics/topicDetector';
import { useStore } from '../../store/useStore';

interface TopicHeaderProps {
  topic: TopicCategory;
}

export function TopicHeader({ topic }: TopicHeaderProps) {
  const { getDifficulty, getMastery } = useTopics();
  const { messages } = useStore();
  const difficulty = getDifficulty(topic);
  const mastery = getMastery(topic);
  const progress = Math.round(mastery * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-blue-100"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2 rounded-lg',
            difficulty === 'easy' ? 'bg-green-100' :
            difficulty === 'medium' ? 'bg-yellow-100' :
            'bg-red-100'
          )}>
            <span className="text-2xl">{getTopicIcon(topic)}</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-800">
              {getTopicName(topic)}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <DifficultyBadge 
                difficulty={difficulty}
                size="sm"
                animate={false}
              />
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Star className="w-4 h-4" />
                <span>{progress}% Mastery</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={cn(
              'h-full rounded-full',
              'bg-gradient-to-r',
              difficulty === 'easy' ? 'from-green-500 to-emerald-500' :
              difficulty === 'medium' ? 'from-yellow-500 to-orange-500' :
              'from-red-500 to-rose-500'
            )}
          />
        </div>
      </div>
    </motion.div>
  );
}