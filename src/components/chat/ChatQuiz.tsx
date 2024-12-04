import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Question, DifficultyLevel } from '../../types';

interface ChatQuizProps {
  questions: Question[];
  onComplete: (score: number, total: number) => void;
}

export function ChatQuiz({ questions, onComplete }: ChatQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const currentDifficulty = questions[currentQuestion]?.difficulty || 'easy';

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    const isCorrect = index === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion === questions.length - 1) {
      onComplete(score, questions.length);
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  if (!questions.length) return null;

  return (
    <div className="bg-white rounded-lg p-4 shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Question {currentQuestion + 1} of {questions.length}
        </h3>
        <span className={cn(
          'text-sm font-medium px-3 py-1.5 rounded-full',
          currentDifficulty === 'easy' ? 'bg-green-100 text-green-700' :
          currentDifficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        )}>
          {currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}
        </span>
      </div>

      <p className="text-gray-800">{questions[currentQuestion].question}</p>

      <div className="space-y-2">
        {questions[currentQuestion].options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={selectedAnswer !== null}
            onClick={() => handleAnswer(index)}
            className={cn(
              'w-full p-3 rounded-lg text-left transition-colors',
              selectedAnswer === index
                ? index === questions[currentQuestion].correctAnswer
                  ? 'bg-green-100 border-2 border-green-500'
                  : 'bg-red-100 border-2 border-red-500'
                : 'bg-gray-100 hover:bg-gray-200'
            )}
          >
            <div className="flex items-center justify-between">
              <span>{option}</span>
              {selectedAnswer === index && (
                index === questions[currentQuestion].correctAnswer
                  ? <CheckCircle className="w-5 h-5 text-green-500" />
                  : <XCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-3 bg-blue-50 rounded-lg"
          >
            <p className="text-blue-800">
              {questions[currentQuestion].explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {showExplanation && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleNext}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </motion.button>
      )}
    </div>
  );
}