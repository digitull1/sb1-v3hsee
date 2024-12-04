import type { Question } from '../../types';

export function generateQuizQuestions(topic: string, content: string): Question[] {
  return [
    {
      id: '1',
      question: `What did we learn about ${topic}?`,
      options: [
        'The basic principles',
        'Advanced concepts',
        'Historical background',
        'Future applications'
      ],
      correctAnswer: 0,
      explanation: 'Great job! Keep exploring to learn more amazing things!',
    },
    {
      id: '2',
      question: 'Ready to explore more?',
      options: [
        'Yes, show me related topics!',
        'Let\'s try some experiments',
        'I want to learn more facts',
        'Time for a challenge'
      ],
      correctAnswer: 0,
      explanation: 'Awesome! Let\'s continue our magical learning journey! ✨',
    }
  ];
}