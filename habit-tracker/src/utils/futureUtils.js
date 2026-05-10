export const predictFutureStats = (habits = [], days = 30) => {
  if (!habits || habits.length === 0) return null;
  const now = new Date();
  const totalCompletions = Object.values(habits).reduce((s, h) => s + (h.completionLog ? Object.keys(h.completionLog).length : 0), 0);
  const avgDaily = totalCompletions / 30 || 1;
  const currentStreak = Math.max(...habits.map(h => h.currentStreak || 0));
  const projectedStreak = Math.round(currentStreak + (avgDaily * days / 30));
  const projectedPoints = Math.round(avgDaily * days * 10);
  const streakMsg = projectedStreak > currentStreak + days ? 'amazing growth!' : projectedStreak > currentStreak ? 'steady progress!' : 'keep building!';
  return { days, streak: projectedStreak, points: projectedPoints, message: `In ${days} days at this pace, you'll have a ${projectedStreak} day streak! ${streakMsg}` };
};