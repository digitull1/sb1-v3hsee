import type { Block } from '../../types';

const TOPICS = [
  {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    color: 'from-blue-400 to-cyan-400',
    questions: [
      {
        title: 'Why do rainbows appear after rain?',
        description: 'Discover the colorful magic of light and water!',
        difficulty: 'easy',
      },
      {
        title: 'How do plants eat sunlight?',
        description: 'Uncover the secret recipe plants use to grow!',
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'space',
    name: 'Space',
    icon: '🚀',
    color: 'from-indigo-400 to-purple-400',
    questions: [
      {
        title: 'Why do stars twinkle at night?',
        description: 'Learn about the dancing lights in our night sky!',
        difficulty: 'easy',
      },
      {
        title: 'How many moons does Jupiter have?',
        description: 'Explore the giant planet and its many moons!',
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'nature',
    name: 'Nature',
    icon: '🌿',
    color: 'from-green-400 to-emerald-400',
    questions: [
      {
        title: 'How do butterflies transform?',
        description: "Watch nature's most amazing makeover!",
        difficulty: 'easy',
      },
      {
        title: 'Why do leaves change color?',
        description: "Explore autumn's beautiful color palette!",
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: '💻',
    color: 'from-blue-500 to-indigo-500',
    questions: [
      {
        title: 'How do computers think?',
        description: 'Peek inside the brain of your computer!',
        difficulty: 'medium',
      },
      {
        title: 'What makes robots move?',
        description: 'Learn how robots come to life!',
        difficulty: 'easy',
      },
    ],
  },
  {
    id: 'art',
    name: 'Art',
    icon: '🎨',
    color: 'from-pink-400 to-rose-400',
    questions: [
      {
        title: 'How do artists mix colors?',
        description: 'Create a rainbow with just three colors!',
        difficulty: 'easy',
      },
      {
        title: 'Why does music make us feel?',
        description: 'Explore how sounds create emotions!',
        difficulty: 'medium',
      },
    ],
  },
];

export function getTopicBlocks(age: number): Block[] {
  const blocks: Block[] = [];
  
  // Select one question from each topic based on age
  TOPICS.forEach((topic) => {
    const questions = topic.questions.filter(q => 
      (age <= 8 && q.difficulty === 'easy') ||
      (age > 8)
    );
    
    // Take only one question per topic
    const selectedQuestion = questions[Math.floor(Math.random() * questions.length)];
    if (selectedQuestion) {
      blocks.push({
        id: `${topic.id}-${Date.now()}`,
        title: selectedQuestion.title,
        description: selectedQuestion.description,
        points: calculatePoints(selectedQuestion.difficulty),
        icon: topic.icon,
        difficulty: selectedQuestion.difficulty,
        parentId: topic.name,
      });
    }
  });
  
  return blocks;
}

function calculatePoints(difficulty: string): number {
  const points = {
    easy: 10,
    medium: 20,
    hard: 30,
  };
  
  return points[difficulty as keyof typeof points] || 10;
}