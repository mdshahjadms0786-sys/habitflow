import { format, parseISO, differenceInDays, isToday, startOfWeek, endOfWeek, eachDayOfInterval, getDay, subDays } from 'date-fns';

const isDayCompleted = (completionLog, dateStr) => {
  const entry = completionLog[dateStr];
  if (!entry) return false;
  if (entry === true) return true;
  if (typeof entry === 'object' && entry?.completed === true) return true;
  return false;
};

export const calculateCurrentStreak = (completionLog) => {
  if (!completionLog || Object.keys(completionLog).length === 0) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayStr = format(today, 'yyyy-MM-dd');
  const todayCompleted = isDayCompleted(completionLog, todayStr);
  
  let streak = 0;
  let checkDate = new Date(today);
  
  if (!todayCompleted) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = format(yesterday, 'yyyy-MM-dd');
    if (!isDayCompleted(completionLog, yesterdayStr)) return 0;
    checkDate = yesterday;
  }
  
  while (streak < 1000) {
    const dateStr = format(checkDate, 'yyyy-MM-dd');
    if (!isDayCompleted(completionLog, dateStr)) break;
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }
  
  return streak;
};

export const calculateLongestStreak = (completionLog) => {
  if (!completionLog || Object.keys(completionLog).length === 0) return 0;
  
  const completedDates = Object.keys(completionLog)
    .filter(date => isDayCompleted(completionLog, date))
    .map(date => parseISO(date))
    .sort((a, b) => a - b);

  if (completedDates.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < completedDates.length; i++) {
    const diff = differenceInDays(completedDates[i], completedDates[i - 1]);
    if (diff === 1) {
      current++;
    } else if (diff > 1) {
      longest = Math.max(longest, current);
      current = 1;
    }
  }

  return Math.max(longest, current);
};

export const isCompletedToday = (completionLog) => {
  if (!completionLog) return false;
  const today = format(new Date(), 'yyyy-MM-dd');
  return !!completionLog[today];
};

export const getWeekCompletions = (completionLog) => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return weekDays.map((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return {
      day: format(day, 'EEE'),
      date: dateStr,
      completed: !!completionLog?.[dateStr],
    };
  });
};

export const getCompletionPercentage = (completionLog, days = 7) => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - days + 1);

  let totalDays = 0;
  let completedDays = 0;

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = format(date, 'yyyy-MM-dd');
    totalDays++;
    if (completionLog?.[dateStr]) {
      completedDays++;
    }
  }

  return totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
};

export const getTotalCompletions = (completionLog) => {
  if (!completionLog) return 0;
  return Object.values(completionLog).filter(Boolean).length;
};

export const getAllCompletions = (completionLog) => {
  if (!completionLog) return {};
  return completionLog;
};

const calculateLongestStreakFromLog = (allLogs) => {
  const completedDates = Object.keys(allLogs).sort();
  
  if (completedDates.length === 0) return 0;
  
  let longest = 1;
  let current = 1;
  
  for (let i = 1; i < completedDates.length; i++) {
    const prev = parseISO(completedDates[i-1]);
    const curr = parseISO(completedDates[i]);
    const diff = differenceInDays(curr, prev);
    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else if (diff > 1) {
      current = 1;
    }
  }
  
  return longest;
};

export const getConsistencyStats = (habits) => {
  if (!habits || habits.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      consistencyRate: 0,
      streakBroken: false,
      daysSinceBreak: 0,
      brokenStreakDate: null,
      isFirstTime: true,
    };
  }

  const allLogs = {};
  habits.forEach(habit => {
    if (habit.completionLog) {
      Object.entries(habit.completionLog).forEach(([date, completed]) => {
        const isCompleted = completed === true || 
          (typeof completed === 'object' && completed?.completed === true);
        if (isCompleted) {
          allLogs[date] = (allLogs[date] || 0) + 1;
        }
      });
    }
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = format(today, 'yyyy-MM-dd');
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = format(yesterday, 'yyyy-MM-dd');

  const todayDone = !!allLogs[todayStr];
  const yesterdayDone = !!allLogs[yesterdayStr];

  if (!todayDone && !yesterdayDone) {
    const last30Days = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last30Days.push(format(d, 'yyyy-MM-dd'));
    }
    const completedInLast30 = last30Days.filter(d => allLogs[d]).length;
    return {
      currentStreak: 0,
      longestStreak: calculateLongestStreakFromLog(allLogs),
      consistencyRate: Math.round((completedInLast30 / 30) * 100),
      streakBroken: Object.keys(allLogs).length > 0,
      daysSinceBreak: 1,
      brokenStreakDate: yesterdayStr,
      isFirstTime: Object.keys(allLogs).length < 3,
    };
  }

  let currentStreak = 0;
  let checkDate = new Date(today);
  
  if (!todayDone) {
    checkDate = new Date(yesterday);
  }
  
  while (currentStreak < 1000) {
    const dateStr = format(checkDate, 'yyyy-MM-dd');
    if (!allLogs[dateStr]) break;
    currentStreak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  const longestStreak = calculateLongestStreakFromLog(allLogs);

  const last30Days = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last30Days.push(format(d, 'yyyy-MM-dd'));
  }
  const completedInLast30 = last30Days.filter(d => allLogs[d]).length;
  const consistencyRate = Math.round((completedInLast30 / 30) * 100);

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    consistencyRate,
    streakBroken: false,
    daysSinceBreak: 0,
    brokenStreakDate: null,
    isFirstTime: Object.keys(allLogs).length < 3,
  };
};

export const getStreakHistory = (habits, days = 14) => {
  const history = [];
  
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = format(d, 'yyyy-MM-dd');
    const isCompleted = habits.some(h => h.completionLog?.[dateStr]);
    
    history.push({
      date: dateStr,
      completed: isCompleted,
      dayName: format(d, 'EEE'),
    });
  }
  
  return history.reverse();
};

export const categorizeTodayHabits = (habits) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
  const twoDaysAgo = format(subDays(new Date(), 2), 'yyyy-MM-dd');
  
  const completed = [];
  const pending = [];
  const missed = [];
  
  habits?.forEach(habit => {
    if (habit.completionLog?.[today]) {
      completed.push(habit);
    } else {
      const createdAt = habit.createdAt ? format(new Date(habit.createdAt), 'yyyy-MM-dd') : null;
      const isPaused = habit.isPaused === true;
      const isCreatedToday = createdAt === today;
      
      if (isPaused || isCreatedToday) {
        pending.push(habit);
        return;
      }
      
      if (createdAt && createdAt <= yesterday) {
        if (!habit.completionLog?.[yesterday]) {
          missed.push({
            ...habit,
            missedDate: yesterday,
          });
        } else {
          pending.push(habit);
        }
      } else if (createdAt === today) {
        pending.push(habit);
      } else {
        if (!habit.completionLog?.[yesterday] && !habit.completionLog?.[today]) {
          missed.push({ ...habit, missedDate: yesterday });
        } else {
          pending.push(habit);
        }
      }
    }
  });
  
  const filteredMissed = missed.filter(h => {
    if (!h.missedDate) return false;
    const missedDate = new Date(h.missedDate);
    const twoDays = new Date(twoDaysAgo);
    return missedDate >= twoDays;
  });
  
  return { completed, pending, missed: filteredMissed };
};

export default {
  calculateCurrentStreak,
  calculateLongestStreak,
  isCompletedToday,
  getWeekCompletions,
  getCompletionPercentage,
  getTotalCompletions,
  getConsistencyStats,
  getStreakHistory,
  categorizeTodayHabits,
};
