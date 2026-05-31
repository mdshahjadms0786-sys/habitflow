import { format, subDays } from 'date-fns';

export const DIFFICULTY_LEVELS = {
  easy: {
    id: 'easy',
    label: 'Easy',
    emoji: '🟢',
    color: '#1D9E75',
    bgColor: '#E1F5EE',
    points: 10,
    streakBonus: 2,
    description: 'Simple daily task'
  },
  medium: {
    id: 'medium',
    label: 'Medium',
    emoji: '🟡',
    color: '#BA7517',
    bgColor: '#FAEEDA',
    points: 25,
    streakBonus: 5,
    description: 'Requires some effort'
  },
  hard: {
    id: 'hard',
    label: 'Hard',
    emoji: '🔴',
    color: '#E24B4A',
    bgColor: '#FCEBEB',
    points: 50,
    streakBonus: 10,
    description: 'Challenging but doable'
  },
  extreme: {
    id: 'extreme',
    label: 'Extreme',
    emoji: '💀',
    color: '#2C2C2A',
    bgColor: '#D3D1C7',
    points: 100,
    streakBonus: 20,
    description: 'Maximum challenge'
  }
};

export const getDifficultyLevel = (difficultyId) => {
  return DIFFICULTY_LEVELS[difficultyId] || DIFFICULTY_LEVELS.medium;
};

export const calculatePointsForCompletion = (habit) => {
  const difficulty = getDifficultyLevel(habit.difficulty || 'medium');
  const basePoints = difficulty.points;
  const streakBonus = (habit.currentStreak || 0) * difficulty.streakBonus;
  const total = basePoints + streakBonus;
  
  return { basePoints, streakBonus, total };
};

export const suggestDifficulty = (completionLog) => {
  if (!completionLog) return 'medium';
  
  const today = new Date();
  let completed = 0;
  let total = 0;
  
  for (let i = 0; i < 30; i++) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    total++;
    if (completionLog[dateStr]) {
      const entry = completionLog[dateStr];
      if (entry === true || (typeof entry === 'object' && entry.completed)) {
        completed++;
      }
    }
  }
  
  if (total === 0) return 'medium';
  
  const rate = (completed / total) * 100;
  
  if (rate >= 90) return 'easy';
  if (rate >= 60) return 'medium';
  if (rate >= 30) return 'hard';
  return 'extreme';
};

export const shouldSuggestUpgrade = (habit) => {
  if (!habit || habit.difficulty === 'extreme') return false;
  
  const today = new Date();
  let completed = 0;
  let total = 0;
  
  for (let i = 0; i < 7; i++) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    total++;
    if (habit.completionLog?.[dateStr]) {
      const entry = habit.completionLog[dateStr];
      if (entry === true || (typeof entry === 'object' && entry.completed)) {
        completed++;
      }
    }
  }
  
  return total > 0 && (completed / total) * 100 >= 100;
};

export const shouldSuggestDowngrade = (habit) => {
  if (!habit || habit.difficulty === 'easy') return false;
  
  const today = new Date();
  let completed = 0;
  let total = 0;
  
  for (let i = 0; i < 7; i++) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    total++;
    if (habit.completionLog?.[dateStr]) {
      const entry = habit.completionLog[dateStr];
      if (entry === true || (typeof entry === 'object' && entry.completed)) {
        completed++;
      }
    }
  }
  
  return total > 0 && (completed / total) * 100 < 30;
};

export const getDifficultyStats = (habits) => {
  if (!habits || habits.length === 0) {
    return { easy: 0, medium: 0, hard: 0, extreme: 0, hardestCompleted: null, difficultyScore: 0 };
  }
  
  const counts = { easy: 0, medium: 0, hard: 0, extreme: 0 };
  const weightMap = { easy: 1, medium: 2, hard: 3, extreme: 4 };
  
  let hardestHabit = null;
  let maxDifficulty = 0;
  let totalWeighted = 0;
  
  habits.forEach(habit => {
    const difficulty = habit.difficulty || 'medium';
    counts[difficulty] = (counts[difficulty] || 0) + 1;
    
    const weight = weightMap[difficulty] || 2;
    totalWeighted += weight;
    
    if (weight > maxDifficulty) {
      maxDifficulty = weight;
      hardestHabit = habit;
    }
  });
  
  const difficultyScore = Math.round((totalWeighted / (habits.length * 4)) * 100);
  
  return { ...counts, hardestCompleted: hardestHabit, difficultyScore };
};

export const getNextDifficulty = (currentDifficulty) => {
  const order = ['easy', 'medium', 'hard', 'extreme'];
  const currentIndex = order.indexOf(currentDifficulty);
  if (currentIndex === -1 || currentIndex >= order.length - 1) {
    return 'extreme';
  }
  return order[currentIndex + 1];
};

export const shouldShowUpgradeSuggestion = (habitId) => {
  const key = `ht_upgrade_dismissed_${habitId}`;
  const dismissed = localStorage.getItem(key);
  if (!dismissed) return true;
  
  const dismissedDate = new Date(dismissed);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return dismissedDate < sevenDaysAgo;
};

export const dismissUpgradeSuggestion = (habitId) => {
  const key = `ht_upgrade_dismissed_${habitId}`;
  localStorage.setItem(key, new Date().toISOString());
};