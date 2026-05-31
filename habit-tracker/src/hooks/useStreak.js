import { useMemo } from 'react';
import { calculateCurrentStreak, calculateLongestStreak, getWeekCompletions } from '../utils/streakUtils';

export const useStreak = (habit) => {
  const currentStreak = useMemo(() => {
    if (!habit?.completionLog) return 0;
    return calculateCurrentStreak(habit.completionLog);
  }, [habit?.completionLog]);

  const longestStreak = useMemo(() => {
    if (!habit?.completionLog) return 0;
    return calculateLongestStreak(habit.completionLog);
  }, [habit?.completionLog]);

  const weekCompletions = useMemo(() => {
    if (!habit?.completionLog) return [];
    return getWeekCompletions(habit.completionLog);
  }, [habit?.completionLog]);

  return {
    currentStreak,
    longestStreak,
    weekCompletions,
  };
};

export const useStreaks = (habits) => {
  const streaks = useMemo(() => {
    return habits.map((habit) => ({
      habitId: habit.id,
      habitName: habit.name,
      currentStreak: calculateCurrentStreak(habit.completionLog),
      longestStreak: calculateLongestStreak(habit.completionLog),
    }));
  }, [habits]);

  const bestCurrentStreak = useMemo(() => {
    if (streaks.length === 0) return { habitId: null, habitName: '', currentStreak: 0 };
    return streaks.reduce((best, streak) =>
      streak.currentStreak > best.currentStreak ? streak : best
    , streaks[0]);
  }, [streaks]);

  const bestLongestStreak = useMemo(() => {
    if (streaks.length === 0) return { habitId: null, habitName: '', longestStreak: 0 };
    return streaks.reduce((best, streak) =>
      streak.longestStreak > best.longestStreak ? streak : best
    , streaks[0]);
  }, [streaks]);

  const averageStreak = useMemo(() => {
    if (streaks.length === 0) return 0;
    const total = streaks.reduce((sum, streak) => sum + streak.currentStreak, 0);
    return Math.round((total / streaks.length) * 10) / 10;
  }, [streaks]);

  return {
    streaks,
    bestCurrentStreak,
    bestLongestStreak,
    averageStreak,
  };
};

export default useStreak;
