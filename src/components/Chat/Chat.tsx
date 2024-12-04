import { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { ChatMessage } from './ChatMessage';
import { LevelProgress } from '../gamification/LevelProgress';
import { AchievementPopup } from '../gamification/AchievementPopup';
import { VoiceInput } from '../multimodal/VoiceInput';
import { ImageUpload } from '../multimodal/ImageUpload';
import { QuizModal } from '../gamification/QuizModal';
import { generateResponse } from '../../lib/api';
import type { Message, Achievement } from '../../types';

export function Chat() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recentAchievement, setRecentAchievement] = useState<Achievement | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, messages, addMessage, achievements, updatePoints } = useStore();

  useEffect(() => {
    if (achievements.length > 0) {
      const latestAchievement = achievements[achievements.length - 1];
      setRecentAchievement(latestAchievement);
    }
  }, [achievements]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (content: string = input) => {
    if (!content.trim() || isLoading || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: Date.now(),
    };

    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateResponse([...messages, userMessage], user.age);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'assistant',
        blocks: response.blocks,
        timestamp: Date.now(),
      };

      addMessage(assistantMessage);

      // Show quiz every 5 messages to reinforce learning
      if (messages.length % 5 === 0) {
        setShowQuiz(true);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      
      addMessage({
        id: Date.now().toString(),
        content: "Oops! My magic wand needs a quick recharge. Can you try asking that again? ✨",
        sender: 'assistant',
        timestamp: Date.now(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceResult = (transcript: string) => {
    setInput(transcript);
    setIsListening(false);
    handleSend(transcript);
  };

  const handleImageUpload = async (file: File) => {
    addMessage({
      id: Date.now().toString(),
      content: "Wow! Thanks for sharing that image! What would you like to learn about it? 📸",
      sender: 'assistant',
      timestamp: Date.now(),
    });
  };

  const handleQuizComplete = (score: number) => {
    setShowQuiz(false);
    updatePoints(score * 10);
    addMessage({
      id: Date.now().toString(),
      content: `Amazing job on the quiz! You earned ${score * 10} magical points! 🌟`,
      sender: 'assistant',
      timestamp: Date.now(),
    });
  };

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="border-b bg-white/80 backdrop-blur-sm p-4">
        <LevelProgress />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="flex space-x-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t bg-white p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <VoiceInput
            onResult={handleVoiceResult}
            isListening={isListening}
            toggleListening={() => setIsListening(!isListening)}
          />
          
          <ImageUpload onUpload={handleImageUpload} />
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`What would you like to learn about, ${user?.name}? ✨`}
            disabled={isLoading || isListening}
            className="flex-1 rounded-xl border-2 border-gray-200 p-2 focus:border-blue-400 focus:outline-none disabled:bg-gray-100 transition-colors"
            maxLength={500}
          />
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-500 text-white rounded-xl p-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </form>
      </div>

      <AnimatePresence>
        {recentAchievement && (
          <AchievementPopup
            achievement={recentAchievement}
            onClose={() => setRecentAchievement(null)}
          />
        )}

        {showQuiz && (
          <QuizModal
            questions={[
              {
                id: '1',
                question: 'What did we just learn about?',
                options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
                correctAnswer: 0,
                explanation: 'Great job! Keep exploring to learn more amazing things!',
              },
            ]}
            onComplete={handleQuizComplete}
            onClose={() => setShowQuiz(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}