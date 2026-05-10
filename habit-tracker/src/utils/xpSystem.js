const XP_PER_COMPLETION = 10;
const BONUS_XP_STREAK_7 = 25;
const BONUS_XP_STREAK_30 = 100;
const BONUS_XP_STREAK_100 = 500;

export const getLevelFromXP = (xp) => {
  if (xp >= 10000) return 20;
  if (xp >= 7500) return 19;
  if (xp >= 5500) return 18;
  if (xp >= 4000) return 17;
  if (xp >= 2800) return 16;
  if (xp >= 1900) return 15;
  if (xp >= 1250) return 14;
  if (xp >= 800) return 13;
  if (xp >= 500) return 12;
  if (xp >= 300) return 11;
  if (xp >= 175) return 10;
  if (xp >= 100) return 9;
  if (xp >= 55) return 8;
  if (xp >= 30) return 7;
  if (xp >= 15) return 6;
  if (xp >= 7) return 5;
  if (xp >= 3) return 4;
  if (xp >= 1) return 3;
  return 1;
};

export const getXPForLevel = (level) => {
  const thresholds = [0, 1, 3, 7, 15, 30, 55, 100, 175, 300, 500, 800, 1250, 1900, 2800, 4000, 5500, 7500, 10000];
  return thresholds[level - 1] || 0;
};

export const getLevelTitle = (level) => {
  const titles = [
    'Seed', 'Sprout', 'Grow', 'Bloom', 'Thrive',
    'Flourish', 'Shine', 'Spark', 'Blaze', 'Radiance',
    'Aurora', 'Nebula', 'Cosmos', 'Stellar', 'Luminous',
    'Eclipse', 'Celestial', 'Transcendent', 'Infinite', 'Legend'
  ];
  return titles[level - 1] || 'Seed';
};

export const calculateXP = (streak, isPerfectDay = false) => {
  let xp = XP_PER_COMPLETION;
  if (streak >= 7) xp += BONUS_XP_STREAK_7;
  if (streak >= 30) xp += BONUS_XP_STREAK_30;
  if (streak >= 100) xp += BONUS_XP_STREAK_100;
  if (isPerfectDay) xp *= 2;
  return xp;
};

export const getTotalXP = () => {
  try {
    const stats = JSON.parse(localStorage.getItem('ht_stats') || '{}');
    return stats.totalXP || 0;
  } catch {
    return 0;
  }
};

export const addXP = (amount) => {
  try {
    const stats = JSON.parse(localStorage.getItem('ht_stats') || '{}');
    stats.totalXP = (stats.totalXP || 0) + amount;
    localStorage.setItem('ht_stats', JSON.stringify(stats));
    return stats.totalXP;
  } catch {
    return 0;
  }
};