import type { Achievement } from '../types';

export function calculateLevel(points: number): number {
  // Points needed for each level increases exponentially
  return Math.floor(Math.sqrt(points / 100)) + 1;
}

export function getNextLevelPoints(currentPoints: number): { current: number; next: number } {
  const currentLevel = calculateLevel(currentPoints);
  const currentLevelPoints = Math.pow(currentLevel - 1, 2) * 100;
  const nextLevelPoints = Math.pow(currentLevel, 2) * 100;
  
  return {
    current: currentLevelPoints,
    next: nextLevelPoints,
  };
}

export function checkAchievements(points: number, streak: number): Achievement[] {
  const achievements: Achievement[] = [];
  
  // Point-based achievements
  const pointMilestones = [100, 500, 1000, 5000];
  for (const milestone of pointMilestones) {
    if (points >= milestone && points - milestone < 100) {
      achievements.push({
        id: `points-${milestone}`,
        title: `${milestone} Points Master!`,
        description: `You've earned ${milestone} points on your learning journey!`,
        points: Math.floor(milestone * 0.1),
        type: 'points',
      });
    }
  }
  
  // Streak-based achievements
  const streakMilestones = [3, 7, 14, 30];
  for (const milestone of streakMilestones) {
    if (streak === milestone) {
      achievements.push({
        id: `streak-${milestone}`,
        title: `${milestone} Day Streak!`,
        description: `You've been learning for ${milestone} days in a row!`,
        points: milestone * 5,
        type: 'streak',
      });
    }
  }
  
  return achievements;
}

export function generateQuizQuestions(topic: string, content: string): any[] {
  // This is a placeholder. In a real app, we would use the Groq API
  // to generate contextual quiz questions based on the conversation
  return [
    {
      id: '1',
      question: `What did we learn about ${topic}?`,
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctAnswer: 0,
      explanation: 'Great job! Keep exploring to learn more amazing things!',
    },
  ];
}