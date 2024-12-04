import { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Brain, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';

export function OnboardingForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
  });
  const { setUser } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      name: formData.name,
      age: parseInt(formData.age),
      level: 1,
      points: 0,
      streak: 0,
    });
  };

  const handleNext = () => {
    if (step === 1 && formData.name) {
      setStep(2);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="flex justify-center mb-6">
        <Brain className="w-16 h-16 text-blue-500" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-center">What's your name? 👋</h2>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Enter your name"
              autoFocus
            />
            <button
              type="button"
              onClick={handleNext}
              disabled={!formData.name}
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next <Rocket className="inline-block ml-2 w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-center">How old are you? 🎂</h2>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              min="5"
              max="16"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Enter your age"
              autoFocus
            />
            <button
              type="submit"
              disabled={!formData.age}
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Learning <Sparkles className="inline-block ml-2 w-4 h-4" />
            </button>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
}