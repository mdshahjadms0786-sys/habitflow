const POINTS_KEY = 'ht_points';

const POINTS_CONFIG = {
  habitCompleted: 10,
  streak7Days: 50,
  streak30Days: 200,
  streak100Days: 500,
  perfectDay: 25,
  goalAchieved: 100,
  habitCreated: 5,
  journalEntry: 5,
};

const LEVELS = [
  { level: 1, name: 'Beginner', minPoints: 0, icon: '🌱' },
  { level: 2, name: 'Novice', minPoints: 100, icon: '🌿' },
  { level: 3, name: 'Apprentice', minPoints: 300, icon: '🌲' },
  { level: 4, name: 'Dedicated', minPoints: 600, icon: '⭐' },
  { level: 5, name: 'Committed', minPoints: 1000, icon: '💪' },
  { level: 6, name: 'Disciplined', minPoints: 1500, icon: '🔥' },
  { level: 7, name: 'Habit Master', minPoints: 2500, icon: '👑' },
  { level: 8, name: 'Elite', minPoints: 4000, icon: '🏆' },
  { level: 9, name: 'Legend', minPoints: 6000, icon: '💎' },
  { level: 10, name: 'Unstoppable', minPoints: 10000, icon: '🚀' },
];

export const loadPoints = () => {
  try {
    return parseInt(localStorage.getItem(POINTS_KEY)) || 0;
  } catch {
    return 0;
  }
};

export const savePoints = (points) => {
  localStorage.setItem(POINTS_KEY, points);
};

export const addPoints = (reason) => {
  const points = POINTS_CONFIG[reason] || 0;
  if (points === 0) return 0;
  
  const current = loadPoints();
  const updated = current + points;
  savePoints(updated);
  return points;
};

export const deductPoints = (amount) => {
  const current = loadPoints();
  const updated = Math.max(0, current - amount);
  savePoints(updated);
  return updated;
};

export const getCurrentLevel = () => {
  const points = loadPoints();
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
};

export const getNextLevel = () => {
  const current = getCurrentLevel();
  const currentIndex = LEVELS.findIndex(l => l.level === current.level);
  if (currentIndex >= LEVELS.length - 1) return null;
  return LEVELS[currentIndex + 1];
};

export const getPointsToNextLevel = () => {
  const current = getCurrentLevel();
  const next = getNextLevel();
  if (!next) return 0;
  const currentPoints = loadPoints();
  return next.minPoints - currentPoints;
};

export const getProgressToNextLevel = () => {
  const current = getCurrentLevel();
  const next = getNextLevel();
  if (!next) return 100;
  
  const currentPoints = loadPoints();
  const progress = ((currentPoints - current.minPoints) / (next.minPoints - current.minPoints)) * 100;
  return Math.min(100, Math.round(progress));
};

export const getTotalPoints = () => loadPoints();

export const getPointsForHabit = (habitId) => {
  const habits = JSON.parse(localStorage.getItem('habit-tracker-habits') || '[]');
  const habit = habits.find(h => h.id === habitId);
  if (!habit) return 0;
  
  const completions = Object.values(habit.completionLog || {}).filter(c => c.completed).length;
  let points = completions * POINTS_CONFIG.habitCompleted;
  
  if (habit.currentStreak >= 7) points += POINTS_CONFIG.streak7Days;
  if (habit.currentStreak >= 30) points += POINTS_CONFIG.streak30Days;
  if (habit.currentStreak >= 100) points += POINTS_CONFIG.streak100Days;
  
  return points;
};

export const getLevel = () => {
  const points = loadPoints();
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) return LEVELS[i].level;
  }
  return 1;
};

export { POINTS_CONFIG, LEVELS };

export default { loadPoints, savePoints, addPoints, deductPoints, getCurrentLevel, getNextLevel, getPointsToNextLevel, getProgressToNextLevel, POINTS_CONFIG, LEVELS, getTotalPoints, getLevel };