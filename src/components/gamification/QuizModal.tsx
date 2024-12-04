import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizModalProps {
  questions: Question[];
  onComplete: (score: number) => void;
  onClose: () => void;
}

export function QuizModal({ questions, onComplete, onClose }: QuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    const isCorrect = index === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
    
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion === questions.length - 1) {
      onComplete(score);
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-xl w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">
            Question {currentQuestion + 1} of {questions.length}
          </h3>
          <span className="text-blue-500 font-medium">
            Score: {score}/{questions.length}
          </span>
        </div>

        <p className="text-lg mb-6">{questions[currentQuestion].question}</p>

        <div className="space-y-3">
          {questions[currentQuestion].options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={showExplanation}
              onClick={() => handleAnswer(index)}
              className={`w-full p-4 rounded-lg text-left transition-colors ${
                selectedAnswer === index
                  ? index === questions[currentQuestion].correctAnswer
                    ? 'bg-green-100 border-2 border-green-500'
                    : 'bg-red-100 border-2 border-red-500'
                  : 'bg-gray-100 hover:bg-gray-200'
              } ${showExplanation ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showExplanation && index === selectedAnswer && (
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
              className="mt-6 p-4 bg-blue-50 rounded-lg"
            >
              <p className="text-blue-800">
                {questions[currentQuestion].explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex justify-end">
          {showExplanation && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleNext}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {currentQuestion === questions.length - 1 ? 'Finish' : 'Next Question'}
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}