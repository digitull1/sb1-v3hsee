interface QuizHandlerParams {
  score: number;
  total: number;
  userPoints: number;
  userLevel: number;
  updatePoints: (points: number) => void;
  setLevelUpData: (data: { level: number; points: number }) => void;
  setShowLevelUp: (show: boolean) => void;
}

export function handleQuizComplete({
  score,
  total,
  userPoints,
  userLevel,
  updatePoints,
  setLevelUpData,
  setShowLevelUp,
}: QuizHandlerParams): void {
  const points = score * 10;
  const newLevel = Math.floor(Math.sqrt(userPoints + points) / 10) + 1;
  
  if (newLevel > userLevel) {
    setLevelUpData({ level: newLevel, points });
    setShowLevelUp(true);
  }
  
  updatePoints(points);
}