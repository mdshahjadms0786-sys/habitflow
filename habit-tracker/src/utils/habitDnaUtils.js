export const calculateHabitDNA = (habits = [], completionLog = {}) => {
  if (!habits || habits.length === 0) return null;
  
  const TIMING = { label: 'Flexible', emoji: '⚡', score: 50 };
  const CONSISTENCY = { label: 'Work in Progress', emoji: '🔧', score: 30 };
  const FOCUS = { label: 'All-Rounder', emoji: '⚖️', score: 50 };
  const INTENSITY = { label: 'Smart Optimizer', emoji: '🧠', score: 50 };
  
  const daysWithData = Object.keys(completionLog).length;
  if (daysWithData < 3) return null;
  
  const now = new Date();
  let morningCount = 0, eveningCount = 0;
  let totalCompletions = 0;
  const categoryCount = { Health: 0, Fitness: 0, Work: 0, Personal: 0, Learning: 0 };
  let easyCount = 0, hardCount = 0;
  
  habits.forEach(habit => {
    if (!habit.completionLog) return;
    Object.entries(habit.completionLog).forEach(([date, val]) => {
      if (val?.completedAt) {
        const time = val.completedAt;
        const hour = parseInt(time.split(':')[0]);
        if (hour < 12) morningCount++; else eveningCount++;
        totalCompletions++;
        if (habit.category) categoryCount[habit.category] = (categoryCount[habit.category] || 0) + 1;
        if (habit.difficulty === 'easy') easyCount++; else if (habit.difficulty === 'hard') hardCount++;
      }
    });
  });
  
  const total = morningCount + eveningCount;
  if (total > 0) {
    if (morningCount / total > 0.7) TIMING = { label: 'Morning Person', emoji: '🌅', score: 85 };
    else if (eveningCount / total > 0.7) TIMING = { label: 'Night Owl', emoji: '🦉', score: 85 };
    TIMING.score = Math.min(100, 50 + Math.round((morningCount > eveningCount ? morningCount : eveningCount) / total * 50));
  }
  
  const completionRate = daysWithData > 0 ? Math.round((totalCompletions / (daysWithData * habits.length)) * 100) : 0;
  if (completionRate > 85) CONSISTENCY = { label: 'Consistency King', emoji: '👑', score: 95 };
  else if (completionRate > 60) CONSISTENCY = { label: 'Steady Performer', emoji: '💪', score: 75 };
  else if (completionRate > 40) CONSISTENCY = { label: 'Building Momentum', emoji: '🌱', score: 55 };
  CONSISTENCY.score = Math.min(100, completionRate);
  
  const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];
  if (topCategory && topCategory[1] / totalCompletions > 0.5) {
    const catLabels = { Health: 'Health Champion', Work: 'Productivity Beast', Personal: 'Self-Growth Seeker', Learning: 'LearningMachine' };
    FOCUS = { label: catLabels[topCategory[0]] || 'All-Rounder', emoji: { Health: '💚', Work: '💼', Personal: '🌟', Learning: '📚' }[topCategory[0]] || '⚖️', score: 85 };
  }
  FOCUS.score = Math.min(100, 50 + (topCategory ? topCategory[1] / totalCompletions * 50 : 0));
  
  if (hardCount > easyCount) INTENSITY = { label: 'Challenge Hunter', emoji: '🔥', score: 85 };
  else INTENSITY = { label: 'Smart Optimizer', emoji: '🧠', score: 75 };
  INTENSITY.score = Math.min(100, 50 + (hardCount > easyCount ? hardCount / totalCompletions * 50 : easyCount / totalCompletions * 30));
  
  const dnaCode = `${TIMING.label.toUpperCase().split(' ')[0]}-${CONSISTENCY.label.toUpperCase().split(' ')[0]}-${FOCUS.label.toUpperCase().split(' ')[0]}-${INTENSITY.label.toUpperCase().split(' ')[0]}`;
  
  return {
    timing: TIMING,
    consistency: CONSISTENCY,
    focus: FOCUS,
    intensity: INTENSITY,
    overallDnaCode: dnaCode.replace(/[^A-Z\-]/g, ''),
    shareText: `My Habit DNA: ${TIMING.label} ${TIMING.emoji} | ${CONSISTENCY.label} ${CONSISTENCY.emoji} | ${FOCUS.label} ${FOCUS.emoji} | ${INTENSITY.label} ${INTENSITY.emoji}`
  };
};