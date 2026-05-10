export const calculateCompoundGrowth = (startValue, dailyRate, days) => {
  const result = startValue * Math.pow(1 + dailyRate / 100, days);
  return {
    day30: Math.round(startValue * Math.pow(1 + dailyRate / 100, 30)),
    day90: Math.round(startValue * Math.pow(1 + dailyRate / 100, 90)),
    day180: Math.round(startValue * Math.pow(1 + dailyRate / 100, 180)),
    day365: Math.round(startValue * Math.pow(1 + dailyRate / 100, 365))
  };
};

export const getHabitCompoundStats = (habits) => {
  return habits.map(h => {
    const completions = Object.keys(h.completionLog || {}).length;
    const total = 30;
    const rate = completions / total;
    const projections = calculateCompoundGrowth(100, rate * 10, 365);
    return { habitId: h.id, name: h.name, icon: h.icon, rate, projections };
  });
};

export const generateCompoundInsight = (habits) => {
  if (!habits || habits.length === 0) return null;
  
  const stats = getHabitCompoundStats(habits);
  const best = stats.sort((a, b) => b.rate - a.rate)[0];
  if (!best || best.rate < 0.3) return null;
  
  const multiplier = Math.pow(1 + best.rate * 10 / 100, 365);
  const compoundedValue = Math.round(multiplier);
  
  return `At your current pace, you'll be ${compoundedValue}x better in 1 year. ${best.name} shows ${Math.round(best.rate * 100)}% consistency — that's ${compoundedValue}x improvement!`;
};

export default { calculateCompoundGrowth, getHabitCompoundStats, generateCompoundInsight };