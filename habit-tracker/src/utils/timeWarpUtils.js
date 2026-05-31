const TIME_WARP_KEY = 'ht_timewarp_history';

export const getTimeWarpHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(TIME_WARP_KEY)) || [];
  } catch {
    return [];
  }
};

export const saveTimeWarp = (entry) => {
  const history = getTimeWarpHistory();
  history.unshift({ ...entry, timestamp: new Date().toISOString() });
  localStorage.setItem(TIME_WARP_KEY, JSON.stringify(history.slice(0, 50)));
};

export const canTimeWarp = (date) => {
  const today = new Date();
  const targetDate = new Date(date);
  const diffDays = Math.floor((today - targetDate) / (1000 * 60 * 60 * 24));
  return diffDays >= 1 && diffDays <= 7;
};

export const getTimeWarpPenalty = (date) => {
  const today = new Date();
  const targetDate = new Date(date);
  const diffDays = Math.floor((today - targetDate) / (1000 * 60 * 60 * 24));
  
  if (diffDays > 7) return null;
  
  return {
    daysAgo: diffDays,
    pointsMultiplier: Math.max(0.1, 1 - (diffDays * 0.15)),
    label: diffDays === 1 ? '1 day ago' : `${diffDays} days ago`,
  };
};

export const useTimeWarp = () => {
  const history = getTimeWarpHistory();
  
  return {
    history,
    canTimeWarp,
    getTimeWarpPenalty,
  };
};

export default { getTimeWarpHistory, saveTimeWarp, canTimeWarp, getTimeWarpPenalty };