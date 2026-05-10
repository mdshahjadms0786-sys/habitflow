import { format, startOfDay, endOfDay, subDays, differenceInSeconds, isBefore, isAfter } from 'date-fns';

export const getTodayWindow = () => {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const todayStr = format(now, 'yyyy-MM-dd');
  
  return {
    start: todayStart,
    end: todayEnd,
    todayStr,
  };
};

export const isWithinTodayWindow = (timestamp) => {
  if (!timestamp) return false;
  
  const now = new Date();
  const date = new Date(timestamp);
  const { start, end } = getTodayWindow();
  
  return isAfter(date, start) && isBefore(date, end);
};

export const getTimeRemainingToday = () => {
  const now = new Date();
  const { end } = getTodayWindow();
  
  const totalSeconds = differenceInSeconds(end, now);
  
  if (totalSeconds <= 0) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      percentage: 0,
      isUrgent: true,
    };
  }
  
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const percentage = Math.round((totalSeconds / (24 * 60 * 60)) * 100);
  
  return {
    hours,
    minutes,
    seconds,
    percentage,
    isUrgent: totalSeconds < 7200,
  };
};

export const isHabitCompletedToday = (completionLog) => {
  if (!completionLog) return false;
  
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const entry = completionLog[today];
  if (!entry) return false;
  
  if (entry === true) return true;
  if (typeof entry === 'object' && entry?.completed === true) return true;
  
  return false;
};

export const getMissedHabitsForDisplay = (habits) => {
  if (!habits || habits.length === 0) return [];
  
  const today = new Date();
  const yesterday = subDays(today, 1);
  const yesterdayStr = format(yesterday, 'yyyy-MM-dd');
  const twoDaysAgo = subDays(today, 2);
  const twoDaysAgoStr = format(twoDaysAgo, 'yyyy-MM-dd');
  
  return habits.filter(habit => {
    if (habit.isPaused === true) return false;
    
    if (!habit.createdAt) return false;
    
    const createdDate = format(new Date(habit.createdAt), 'yyyy-MM-dd');
    if (createdDate === format(today, 'yyyy-MM-dd')) return false;
    
    const wasCompletedYesterday = completionLogHasDate(habit.completionLog, yesterdayStr);
    const wasCompletedTwoDaysAgo = completionLogHasDate(habit.completionLog, twoDaysAgoStr);
    
    if (!wasCompletedYesterday && !wasCompletedTwoDaysAgo) {
      const missedDate = wasCompletedTwoDaysAgo ? twoDaysAgoStr : yesterdayStr;
      return {
        ...habit,
        missedDate,
      };
    }
    
    return false;
  }).map(habit => {
    const wasCompletedYesterday = completionLogHasDate(habit.completionLog, yesterdayStr);
    const missedDate = wasCompletedYesterday ? yesterdayStr : twoDaysAgoStr;
    return {
      ...habit,
      missedDate,
    };
  });
};

const completionLogHasDate = (completionLog, dateStr) => {
  if (!completionLog || !completionLog[dateStr]) return false;
  
  const entry = completionLog[dateStr];
  if (entry === true) return true;
  if (typeof entry === 'object' && entry?.completed === true) return true;
  
  return false;
};

export const checkAndAutoExpire = (habits) => {
  if (!habits || habits.length === 0) {
    return { pending: [], completed: [], missed: [], expired: [] };
  }
  
  const today = new Date();
  const yesterday = subDays(today, 1);
  const yesterdayStr = format(yesterday, 'yyyy-MM-dd');
  const twoDaysAgo = subDays(today, 2);
  const twoDaysAgoStr = format(twoDaysAgo, 'yyyy-MM-dd');
  
  const result = {
    pending: [],
    completed: [],
    missed: [],
    expired: [],
  };
  
  habits.forEach(habit => {
    if (habit.isPaused === true) return;
    
    if (!habit.createdAt) {
      result.pending.push(habit);
      return;
    }
    
    const createdDate = format(new Date(habit.createdAt), 'yyyy-MM-dd');
    const todayStr = format(today, 'yyyy-MM-dd');
    const isCreatedToday = createdDate === todayStr;
    
    if (isCreatedToday) {
      result.pending.push(habit);
      return;
    }
    
    const isCompletedToday = isHabitCompletedToday(habit.completionLog);
    if (isCompletedToday) {
      result.completed.push(habit);
      return;
    }
    
    const isCompletedYesterday = completionLogHasDate(habit.completionLog, yesterdayStr);
    const isCompletedTwoDaysAgo = completionLogHasDate(habit.completionLog, twoDaysAgoStr);
    
    if (isCompletedYesterday) {
      result.pending.push(habit);
    } else if (isCompletedTwoDaysAgo) {
      result.missed.push({ ...habit, missedDate: yesterdayStr });
    } else {
      const missedEarlierThan48h = !isCompletedYesterday && !isCompletedTwoDaysAgo;
      if (missedEarlierThan48h) {
        result.expired.push({ ...habit, missedDate: yesterdayStr });
      } else {
        result.missed.push({ ...habit, missedDate: yesterdayStr });
      }
    }
  });
  
  return result;
};

export const getMidnightCountdown = () => {
  const { hours, minutes, seconds } = getTimeRemainingToday();
  
  const formatTime = (num) => num.toString().padStart(2, '0');
  
  return `${formatTime(hours)}h ${formatTime(minutes)}m ${formatTime(seconds)}s remaining today`;
};

export default {
  getTodayWindow,
  isWithinTodayWindow,
  getTimeRemainingToday,
  isHabitCompletedToday,
  getMissedHabitsForDisplay,
  checkAndAutoExpire,
  getMidnightCountdown,
};