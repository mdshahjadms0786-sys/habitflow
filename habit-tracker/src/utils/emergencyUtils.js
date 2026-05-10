const STORAGE_KEY = 'ht_emergency_mode';

const PRIORITY_WEIGHTS = {
  high: 3,
  medium: 2,
  low: 1
};

export const getTop3Habits = (habits) => {
  if (!habits || habits.length === 0) return [];
  if (habits.length <= 3) return habits;

  const scored = habits.map(habit => {
    const priorityWeight = PRIORITY_WEIGHTS[habit.priority || 'medium'];
    const streak = habit.currentStreak || 0;
    const difficulty = (habit.difficulty || 'medium') === 'hard' ? 3 : (habit.difficulty || 'medium') === 'easy' ? 1 : 2;
    
    const score = priorityWeight + (streak * 2) + difficulty;
    
    return { ...habit, _score: score };
  });

  scored.sort((a, b) => b._score - a._score);

  return scored.slice(0, 3).map(({ _score, ...rest }) => rest);
};

export const saveEmergencyMode = (isActive, activatedAt = null) => {
  try {
    const data = {
      isActive,
      activatedAt: activatedAt || new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save emergency mode', e);
  }
};

export const isEmergencyModeActive = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    
    const data = JSON.parse(stored);
    if (!data.isActive) return false;
    
    const activatedDate = new Date(data.activatedAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const activatedDay = activatedDate.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (activatedDay !== todayStr && activatedDay !== yesterdayStr) {
      saveEmergencyMode(false);
      return false;
    }
    
    return true;
  } catch (e) {
    console.error('Failed to check emergency mode', e);
    return false;
  }
};

export const checkAndResetExpiredEmergencyMode = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    
    const data = JSON.parse(stored);
    if (!data.isActive) return false;
    
    const activatedDate = new Date(data.activatedAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const activatedDay = activatedDate.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (activatedDay !== todayStr && activatedDay !== yesterdayStr) {
      saveEmergencyMode(false);
      return false;
    }
    
    return true;
  } catch (e) {
    return false;
  }
};

export default { 
  getTop3Habits, 
  saveEmergencyMode, 
  isEmergencyModeActive,
  checkAndResetExpiredEmergencyMode 
};