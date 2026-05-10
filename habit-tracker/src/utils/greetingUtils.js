import { format, subDays } from 'date-fns';

export const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

export const getDaysTracked = (createdAt) => {
  if (!createdAt) return 0;
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = now - created;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const getWeekCompletionRate = (habits) => {
  if (!habits || habits.length === 0) return 0;
  
  const today = new Date();
  let total = 0;
  let completed = 0;
  
  for (let i = 1; i < 7; i++) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    habits.forEach(habit => {
      const createdAt = habit.createdAt ? format(new Date(habit.createdAt), 'yyyy-MM-dd') : null;
      if (createdAt && createdAt <= dateStr) {
        total++;
        const entry = habit.completionLog?.[dateStr];
        if (entry === true || (typeof entry === 'object' && entry?.completed === true)) {
          completed++;
        }
      }
    });
  }
  
  return total > 0 ? Math.round((completed / total) * 100) : 0;
};

export const getYesterdayCompletionRate = (habits) => {
  if (!habits || habits.length === 0) return 0;
  
  const yesterday = subDays(new Date(), 1);
  const yesterdayStr = format(yesterday, 'yyyy-MM-dd');
  let total = 0;
  let completed = 0;
  
  habits.forEach(habit => {
    const createdAt = habit.createdAt ? format(new Date(habit.createdAt), 'yyyy-MM-dd') : null;
    if (createdAt && createdAt <= yesterdayStr) {
      total++;
      const entry = habit.completionLog?.[yesterdayStr];
      if (entry === true || (typeof entry === 'object' && entry?.completed === true)) {
        completed++;
      }
    }
  });
  
  return total > 0 ? Math.round((completed / total) * 100) : 0;
};

const getTimeBasedGreeting = (name) => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return `Good Morning, ${name}! ☀️`;
  }
  if (hour >= 12 && hour < 17) {
    return `Good Afternoon, ${name}! 🌤️`;
  }
  if (hour >= 17 && hour < 21) {
    return `Good Evening, ${name}! 🌆`;
  }
  return `Good Night, ${name}! 🌙`;
};

const getSubtext = (stats) => {
  const { streak = 0, allCompletedToday = false, completedCount = 0, totalCount = 0 } = stats;
  const hour = new Date().getHours();
  const isMorning = hour >= 5 && hour < 12;
  const isEvening = hour >= 17;
  
  if (streak > 0) {
    return `🔥 ${streak} day streak — keep it going!`;
  }
  
  if (allCompletedToday) {
    return `✅ All habits complete — amazing work!`;
  }
  
  if (isMorning && completedCount === 0) {
    return `Let's make today count!`;
  }
  
  if (isEvening && completedCount > 0) {
    return `Great progress today!`;
  }
  
  return `Build better habits, one day at a time.`;
};

export const getPersonalizedGreeting = (userName, habits, stats) => {
  const name = userName || 'Champion';
  const timeOfDay = getTimeOfDay();
  
  const {
    streak = 0,
    allCompletedToday = false,
    completedCount = 0,
    totalCount = 0,
  } = stats;
  
  const processedStats = {
    streak,
    allCompletedToday,
    completedCount,
    totalCount,
    habits,
  };
  
  return {
    greeting: getTimeBasedGreeting(name),
    subtext: getSubtext(processedStats),
    emoji: '',
    mood: '',
  };
};

export const getMotivationalSubtext = (stats) => {
  const { streak = 0, points = 0, weeklyCompletionRate = 0, improving = false, diff = 0 } = stats;
  
  if (streak > 30) {
    return "You're in the top 1% of habit builders! 🚀";
  }
  
  if (points > 1000) {
    return `⭐ ${points} points earned — keep going!`;
  }
  
  if (weeklyCompletionRate > 80) {
    return `📊 ${weeklyCompletionRate}% completion this week — outstanding!`;
  }
  
  if (improving) {
    return `📈 Up ${diff}% from last week!`;
  }
  
  return "Let's make today count! 💫";
};

export default {
  getTimeOfDay,
  getDaysTracked,
  getPersonalizedGreeting,
  getMotivationalSubtext,
};