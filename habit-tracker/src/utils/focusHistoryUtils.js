import { format, subDays, startOfWeek, isSameDay } from 'date-fns';

const STORAGE_KEY = 'ht_focus_sessions';
const GOAL_KEY = 'ht_focus_goal';

export const getFocusSessions = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const getTodayFocusStats = (sessions) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const todaySessions = sessions.filter(s => s.date === today);

  const totalMinutes = todaySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const sessionCount = todaySessions.length;

  const habitMap = {};
  todaySessions.forEach(s => {
    if (!habitMap[s.habitId]) {
      habitMap[s.habitId] = {
        habitId: s.habitId,
        habitName: s.habitName,
        habitIcon: s.habitIcon,
        minutes: 0
      };
    }
    habitMap[s.habitId].minutes += s.duration || 0;
  });

  const habits = Object.values(habitMap);

  return { totalMinutes, sessionCount, habits };
};

export const getWeekFocusStats = (sessions) => {
  const result = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayName = format(date, 'EEE');

    const daySessions = sessions.filter(s => s.date === dateStr);
    const totalMinutes = daySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const sessionCount = daySessions.length;

    result.push({
      date: dateStr,
      dayName,
      totalMinutes,
      sessionCount
    });
  }

  return result;
};

export const getHabitFocusBreakdown = (sessions) => {
  const habitMap = {};

  sessions.forEach(s => {
    if (!habitMap[s.habitId]) {
      habitMap[s.habitId] = {
        habitId: s.habitId,
        habitName: s.habitName,
        habitIcon: s.habitIcon,
        totalMinutes: 0,
        sessionCount: 0
      };
    }
    habitMap[s.habitId].totalMinutes += s.duration || 0;
    habitMap[s.habitId].sessionCount += 1;
  });

  return Object.values(habitMap).sort((a, b) => b.totalMinutes - a.totalMinutes);
};

export const getFocusStreak = (sessions) => {
  if (!sessions || sessions.length === 0) return 0;

  const dates = [...new Set(sessions.map(s => s.date))].sort().reverse();
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  let streak = 0;
  let checkDate = dates[0] === today ? new Date() : subDays(new Date(), 1);

  for (let i = 0; i < 365; i++) {
    const dateStr = format(checkDate, 'yyyy-MM-dd');
    const hasSession = sessions.some(s => s.date === dateStr);

    if (hasSession) {
      streak++;
      checkDate = subDays(checkDate, 1);
    } else {
      break;
    }
  }

  return streak;
};

export const getPersonalRecords = (sessions) => {
  if (!sessions || sessions.length === 0) {
    return {
      bestDay: null,
      bestWeek: null,
      longestSession: null,
      totalAllTime: 0,
      totalSessions: 0
    };
  }

  const dateMap = {};
  sessions.forEach(s => {
    if (!dateMap[s.date]) {
      dateMap[s.date] = 0;
    }
    dateMap[s.date] += s.duration || 0;
  });

  const sortedDays = Object.entries(dateMap).sort((a, b) => b[1] - a[1]);
  const bestDayDate = sortedDays[0]?.[0];
  const bestDayMinutes = sortedDays[0]?.[1] || 0;

  const longestSession = sessions.reduce((best, s) => {
    return (s.duration || 0) > (best?.duration || 0) ? s : best;
  }, null);

  const totalAllTime = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const totalSessions = sessions.length;

  const bestWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekSessions = sessions.filter(s => {
    const sessionDate = new Date(s.date);
    return sessionDate >= bestWeekStart;
  });
  const bestWeekMinutes = weekSessions.reduce((sum, s) => sum + (s.duration || 0), 0);

  return {
    bestDay: bestDayDate ? {
      date: bestDayDate,
      dayName: format(new Date(bestDayDate), 'EEE, MMM d'),
      totalMinutes: bestDayMinutes
    } : null,
    bestWeek: {
      weekStart: format(bestWeekStart, 'yyyy-MM-dd'),
      totalMinutes: bestWeekMinutes
    },
    longestSession: longestSession ? {
      duration: longestSession.duration,
      habitName: longestSession.habitName,
      date: format(new Date(longestSession.date), 'MMM d')
    } : null,
    totalAllTime,
    totalSessions
  };
};

export const getWeeklyFocusGoalProgress = (sessions, goalMinutes = 300) => {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekSessions = sessions.filter(s => {
    const sessionDate = new Date(s.date);
    return sessionDate >= weekStart;
  });

  const current = weekSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const goal = goalMinutes;
  const percentage = Math.min(100, Math.round((current / goal) * 100));

  return { current, goal, percentage };
};

export const formatMinutes = (minutes) => {
  if (!minutes || minutes < 0) return '0m';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

export const getFocusGoal = () => {
  try {
    return parseInt(localStorage.getItem(GOAL_KEY) || '300');
  } catch {
    return 300;
  }
};

export const setFocusGoal = (minutes) => {
  localStorage.setItem(GOAL_KEY, minutes.toString());
};

export const getRecentSessions = (sessions, limit = 10) => {
  return [...sessions]
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .slice(0, limit);
};

export const getLast7DaysDots = (sessions) => {
  const result = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const hasSession = sessions.some(s => s.date === dateStr);
    result.push({ date: dateStr, hasSession });
  }

  return result;
};