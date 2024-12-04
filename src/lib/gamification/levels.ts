export function calculateLevel(points: number): number {
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