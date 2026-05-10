const STREAK_FREEZE_KEY = 'ht_streak_freezes';

const getFreezeStorage = () => {
  try {
    return JSON.parse(localStorage.getItem(STREAK_FREEZE_KEY) || '{"freezes": 0, "used": []}');
  } catch {
    return { freezes: 0, used: [] };
  }
};

export const getStreakFreezes = () => {
  return getFreezeStorage().freezes;
};

export const addStreakFreeze = (amount = 1) => {
  const data = getFreezeStorage();
  data.freezes += amount;
  localStorage.setItem(STREAK_FREEZE_KEY, JSON.stringify(data));
};

export const useStreakFreeze = (habitId, date) => {
  const data = getFreezeStorage();
  if (data.freezes <= 0) return false;
  
  data.freezes -= 1;
  data.used.push({ habitId, date, usedAt: new Date().toISOString() });
  localStorage.setItem(STREAK_FREEZE_KEY, JSON.stringify(data));
  return true;
};

export const hasUsedFreeze = (habitId, date) => {
  const data = getFreezeStorage();
  return data.used.some(u => u.habitId === habitId && u.date === date);
};

export const getUsedFreezes = () => {
  return getFreezeStorage().used;
};

export const purchaseStreakFreeze = (cost = 100) => {
  const stats = JSON.parse(localStorage.getItem('ht_stats') || '{}');
  const currentXP = stats.totalXP || 0;
  
  if (currentXP >= cost) {
    stats.totalXP -= cost;
    addStreakFreeze(3);
    localStorage.setItem('ht_stats', JSON.stringify(stats));
    return true;
  }
  return false;
};