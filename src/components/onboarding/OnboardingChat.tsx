import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { OnboardingMessage } from './OnboardingMessage';
import { OnboardingTopics } from './OnboardingTopics';
import { Logo } from '../branding/Logo';
import { SplashScreen } from './SplashScreen';
import { generateOnboardingBlocks } from '../../lib/api/onboarding/generateBlocks';
import type { Block } from '../../types';

const INITIAL_MESSAGES = [
  {
    id: '1',
    content: "Hi there! I'm Wonder Whiz, your magical learning companion! What's your name?",
    type: 'assistant',
  },
];

export function OnboardingChat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [step, setStep] = useState<'splash' | 'name' | 'age' | 'topics'>('splash');
  const [formData, setFormData] = useState({ name: '', age: '' });
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useStore();

  const addMessage = (content: string, type: 'user' | 'assistant') => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), content, type },
    ]);
  };

  const handleNameSubmit = (name: string) => {
    addMessage(name, 'user');
    setFormData((prev) => ({ ...prev, name }));
    setTimeout(() => {
      addMessage(
        "Wonderful to meet you, " + name + "! To make our magical learning journey perfect for you, could you tell me your age?",
        'assistant'
      );
      setStep('age');
    }, 500);
  };

  const handleAgeSubmit = async (age: string) => {
    addMessage(age, 'user');
    setFormData((prev) => ({ ...prev, age }));
    setIsLoading(true);
    setError(null);

    try {
      const onboardingBlocks = await generateOnboardingBlocks(parseInt(age));
      setBlocks(onboardingBlocks);
      
      setTimeout(() => {
        addMessage(
          "Fantastic! Now, let's discover what sparks your curiosity! What topics would you love to explore?",
          'assistant'
        );
        setStep('topics');
      }, 500);
    } catch (error) {
      console.error('Error generating blocks:', error);
      setError('Oops! Something went wrong. Please try again!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicsSubmit = (topics: string[]) => {
    addMessage(topics.join(', '), 'user');
    
    setUser({
      name: formData.name,
      age: parseInt(formData.age),
      level: 1,
      points: 0,
      streak: 0,
      interests: topics,
    });

    setTimeout(() => {
      addMessage(
        "Amazing choices! Get ready for an incredible learning adventure, " + formData.name + "! Let's make learning magical together!",
        'assistant'
      );
    }, 500);
  };

  if (step === 'splash') {
    return <SplashScreen onComplete={() => setStep('name')} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4"
    >
      <div className="flex justify-center mb-12">
        <Logo size="lg" />
      </div>

      <motion.div
        className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-blue-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <OnboardingMessage
                  content={message.content}
                  type={message.type}
                />
              </motion.div>
            ))}

            {step === 'name' && (
              <OnboardingMessage
                key="name-input"
                type="input"
                onSubmit={handleNameSubmit}
                placeholder="Type your name here..."
              />
            )}

            {step === 'age' && (
              <OnboardingMessage
                key="age-input"
                type="input"
                inputType="number"
                onSubmit={handleAgeSubmit}
                placeholder="Enter your age"
                min={5}
                max={16}
              />
            )}

            {step === 'topics' && !isLoading && (
              <OnboardingTopics 
                key="topics"
                blocks={blocks}
                onSubmit={handleTopicsSubmit}
              />
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 text-red-600 p-4 rounded-lg"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-6 text-gray-600"
      >
        <p>Join thousands of young wizards on their learning journey!</p>
      </motion.div>
    </motion.div>
  );
}