// ============================================================
// HabitFlow Points System - Full Version
// ============================================================

const POINTS_KEY = 'ht_points';
const POINTS_HISTORY_KEY = 'ht_points_history';
const DAILY_LOGIN_KEY = 'ht_last_login_bonus';
const REFERRAL_KEY = 'ht_referrals';
import logger from './logger'
const STREAK_MILESTONES_KEY = 'ht_streak_milestones_claimed';
const PERFECT_DAY_KEY = 'ht_perfect_day_claimed';
const WEEKLY_BONUS_KEY = 'ht_weekly_bonus_claimed';

// ============================================================
// CONFIGS
// ============================================================

export const POINTS_CONFIG = {
  // 🏋️ Habit Actions
  habitCompleted: 10,
  habitCreated: 5,
  habitEdited: 2,
  habitDeleted: 0,
  allHabitsCompleted: 30,
  perfectDay: 30,

  // 🔥 Streak Bonuses
  streak3Days: 15,
  streak7Days: 50,
  streak14Days: 100,
  streak21Days: 150,
  streak30Days: 200,
  streak60Days: 400,
  streak100Days: 500,
  streak365Days: 2000,

  // 📅 Daily Login Bonus
  dailyLogin: 5,

  // 🗓️ Weekly Consistency
  weekPerfect: 75,
  week5of7: 30,

  // 📝 Journal & Mood
  journalEntry: 8,
  moodCheckin: 5,
  dreamDiaryEntry: 6,

  // 🎯 Goals & Life Areas
  goalCreated: 10,
  goalCompleted: 50,
  lifeAreaUpdated: 5,
  visionBoardItem: 5,

  // 🧘 Focus Sessions
  focusSessionCompleted: 15,
  focusStreak3: 25,
  breathingExercise: 8,

  // 🏆 Challenges & Social
  challengeJoined: 10,
  challengeCompleted: 100,
  leagueRankUp: 50,
  betWon: 30,
  questCompleted: 20,

  // 🎓 Certifications & Achievements
  certificationEarned: 75,
  badgeUnlocked: 20,

  // 📤 Export / Engagement
  dataExported: 5,
  profileCompleted: 25,
  firstHabit: 20,

  // 👥 Referrals
  referralSent: 10,
  referralCompleted: 100,

  // 🤖 AI Features
  aiCoachMessageSent: 2,
  aiArchitectPlanCreated: 30,
  coachingSessionCompleted: 40,

  // 🧪 Experiments
  experimentStarted: 10,
  experimentCompleted: 30,

  // 📰 Engagement
  newspaperRead: 3,
  weeklyReportViewed: 5,
  weeklyEmailSent: 5,
};

export const PLAN_MULTIPLIERS = {
  free: 1.0,
  pro: 1.25,
  elite: 1.75,
};

export const LEVELS = [
  { level: 1,  name: 'Seed',        minPoints: 0,     icon: '🌱', color: '#6b7280' },
  { level: 2,  name: 'Sprout',      minPoints: 100,   icon: '🌿', color: '#22c55e' },
  { level: 3,  name: 'Apprentice',  minPoints: 300,   icon: '🌲', color: '#16a34a' },
  { level: 4,  name: 'Dedicated',   minPoints: 600,   icon: '⭐', color: '#f59e0b' },
  { level: 5,  name: 'Committed',   minPoints: 1000,  icon: '💪', color: '#f97316' },
  { level: 6,  name: 'Disciplined', minPoints: 1800,  icon: '🔥', color: '#ef4444' },
  { level: 7,  name: 'Champion',    minPoints: 3000,  icon: '🏅', color: '#8b5cf6' },
  { level: 8,  name: 'Habit Master',minPoints: 5000,  icon: '👑', color: '#534AB7' },
  { level: 9,  name: 'Legend',      minPoints: 8000,  icon: '💎', color: '#0ea5e9' },
  { level: 10, name: 'Unstoppable', minPoints: 12000, icon: '🚀', color: '#BA7517' },
];

// ============================================================
// HELPERS
// ============================================================

export const loadPoints = () => {
  try {
    return parseInt(localStorage.getItem(POINTS_KEY)) || 0;
  } catch {
    return 0;
  }
};

export const savePoints = (points) => {
  localStorage.setItem(POINTS_KEY, Math.max(0, points));
  window.dispatchEvent(new CustomEvent('pointsUpdated', { detail: points }));
};

export const getPointsHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(POINTS_HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
};

export const logPointsHistory = (reason, finalPoints, basePoints, multiplier, habitId) => {
  try {
    const history = getPointsHistory();
    history.unshift({
      reason,
      points: finalPoints,
      base: basePoints,
      multiplier,
      timestamp: Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...(habitId ? { habitId } : {}),
    });
    localStorage.setItem(POINTS_HISTORY_KEY, JSON.stringify(history.slice(0, 200)));
  } catch {
    // ignore
  }
};

export const addPoints = (reason, options = {}) => {
  const { silent: _silent = false, customAmount = null, plan = null, habitId = null } = options;

  let basePoints = 0;
  if (customAmount !== null) {
    basePoints = customAmount;
  } else if (typeof reason === 'number') {
    basePoints = reason;
  } else {
    basePoints = POINTS_CONFIG[reason] || 0;
  }

  if (basePoints === 0) return 0;

  const currentPlan = plan || (localStorage.getItem('ht_plan') || 'free');
  const multiplier = PLAN_MULTIPLIERS[currentPlan] || 1.0;
  const finalPoints = Math.round(basePoints * multiplier);

  const current = loadPoints();
  const updated = current + finalPoints;
  savePoints(updated);
  logPointsHistory(reason, finalPoints, basePoints, multiplier, habitId);

  return finalPoints;
};

export const deductPoints = (amount) => {
  const current = loadPoints();
  const updated = Math.max(0, current - amount);
  savePoints(updated);
  logPointsHistory('deducted', -amount, -amount, 1);
  return updated;
};

export const claimDailyLoginBonus = () => {
  const today = new Date().toISOString().split('T')[0];
  const lastBonus = localStorage.getItem(DAILY_LOGIN_KEY);
  if (lastBonus === today) return 0;

  localStorage.setItem(DAILY_LOGIN_KEY, today);
  return addPoints('dailyLogin');
};

export const hasDailyBonusClaimed = () => {
  const today = new Date().toISOString().split('T')[0];
  return localStorage.getItem(DAILY_LOGIN_KEY) === today;
};

export const checkAndAwardStreakBonus = (streak, habitId) => {
  try {
    const milestones = JSON.parse(localStorage.getItem(STREAK_MILESTONES_KEY) || '{}');
    const thresholds = [
      { days: 3, reward: 'streak3Days' },
      { days: 7, reward: 'streak7Days' },
      { days: 14, reward: 'streak14Days' },
      { days: 21, reward: 'streak21Days' },
      { days: 30, reward: 'streak30Days' },
      { days: 60, reward: 'streak60Days' },
      { days: 100, reward: 'streak100Days' },
      { days: 365, reward: 'streak365Days' },
    ];

    for (const t of thresholds) {
      const claimKey = `${habitId}_${t.days}`;
      if (streak >= t.days && !milestones[claimKey]) {
        milestones[claimKey] = true;
        localStorage.setItem(STREAK_MILESTONES_KEY, JSON.stringify(milestones));
        const pts = addPoints(t.reward);
        return { days: t.days, points: pts, reason: t.reward };
      }
    }
  } catch (e) {
    logger.error('Streak bonus error:', e);
  }
  return null;
};

export const getReferralCode = () => {
  let code = localStorage.getItem('ht_referral_code');
  if (!code) {
    code = 'HF-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    localStorage.setItem('ht_referral_code', code);
  }
  return code;
};

export const getReferralStats = () => {
  try {
    return JSON.parse(localStorage.getItem(REFERRAL_KEY) || '{"sent":0,"completed":0}');
  } catch {
    return { sent: 0, completed: 0 };
  }
};

export const addReferral = (type = 'sent') => {
  const stats = getReferralStats();
  stats[type] = (stats[type] || 0) + 1;
  localStorage.setItem(REFERRAL_KEY, JSON.stringify(stats));
  const reason = type === 'completed' ? 'referralCompleted' : 'referralSent';
  return addPoints(reason);
};

export const checkAndAwardPerfectDay = (completedCount, totalCount) => {
  if (completedCount === 0 || totalCount === 0 || completedCount < totalCount) return false;
  const today = new Date().toISOString().split('T')[0];
  if (localStorage.getItem(PERFECT_DAY_KEY) === today) return false;
  localStorage.setItem(PERFECT_DAY_KEY, today);
  addPoints('allHabitsCompleted');
  return true;
};

const getWeekKey = () => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${week}`;
};

export const checkWeeklyConsistency = (completedDays) => {
  try {
    const weekKey = getWeekKey();
    const claimed = JSON.parse(localStorage.getItem(WEEKLY_BONUS_KEY) || '{}');
    if (claimed[weekKey]) return null;

    if (completedDays >= 7) {
      claimed[weekKey] = 'perfect';
      localStorage.setItem(WEEKLY_BONUS_KEY, JSON.stringify(claimed));
      return addPoints('weekPerfect');
    } else if (completedDays >= 5) {
      claimed[weekKey] = '5of7';
      localStorage.setItem(WEEKLY_BONUS_KEY, JSON.stringify(claimed));
      return addPoints('week5of7');
    }
  } catch {
    // ignore
  }
  return null;
};

export const getCurrentLevel = () => {
  const points = loadPoints();
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) return LEVELS[i];
  }
  return LEVELS[0];
};

export const getNextLevel = () => {
  const current = getCurrentLevel();
  const idx = LEVELS.findIndex(l => l.level === current.level);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
};

export const getPointsToNextLevel = () => {
  const next = getNextLevel();
  return next ? next.minPoints - loadPoints() : 0;
};

export const getProgressToNextLevel = () => {
  const current = getCurrentLevel();
  const next = getNextLevel();
  if (!next) return 100;
  const points = loadPoints();
  return Math.min(100, Math.round(((points - current.minPoints) / (next.minPoints - current.minPoints)) * 100));
};

export const getPointsEarnedToday = () => {
  const today = new Date().toISOString().split('T')[0];
  const history = getPointsHistory();
  return history
    .filter(h => h.date === today && h.points > 0)
    .reduce((sum, h) => sum + h.points, 0);
};

export const getTotalPoints = () => {
  return loadPoints();
};

export const getLevel = () => {
  return getCurrentLevel();
};

export const getPointsForHabit = (habitId) => {
  const history = getPointsHistory();
  const habitPoints = history.filter(h => {
    const isCompletion = h.reason === 'habitCompleted' || h.reason === 'allHabitsCompleted';
    if (h.habitId) return isCompletion && h.habitId === habitId;
    return isCompletion;
  });
  return habitPoints.reduce((sum, h) => sum + h.points, 0);
};