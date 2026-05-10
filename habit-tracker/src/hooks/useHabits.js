import { useMemo } from 'react';
import { useHabitContext } from '../context/HabitContext';
import { isCompletedToday, calculateCurrentStreak, calculateLongestStreak } from '../utils/streakUtils';
import { getTodayISO, formatISODate } from '../utils/dateUtils';

export const useHabits = () => {
  const {
    habits,
    darkMode,
    ollamaModel,
    showMotivation,
    addHabit,
    editHabit,
    deleteHabit,
    toggleHabit,
    setDarkMode,
    setOllamaModel,
    setShowMotivation,
    importData,
    resetAllData,
  } = useHabitContext();

  const getHabitById = (id) => habits.find((h) => h.id === id);

  const getActiveHabits = useMemo(() => habits.filter((h) => h.isActive !== false), [habits]);

  const getTodayHabits = useMemo(() => getActiveHabits, [getActiveHabits]);

  const getCompletedTodayCount = useMemo(
    () => getActiveHabits.filter((h) => isCompletedToday(h.completionLog)).length,
    [getActiveHabits]
  );

  const getTotalTodayCount = useMemo(() => getActiveHabits.length, [getActiveHabits]);

  const getCompletionPercentage = useMemo(() => {
    if (getTotalTodayCount === 0) return 0;
    return Math.round((getCompletedTodayCount / getTotalTodayCount) * 100);
  }, [getCompletedTodayCount, getTotalTodayCount]);

  const getBestStreak = useMemo(() => {
    return getActiveHabits.reduce((max, habit) => Math.max(max, habit.currentStreak || 0), 0);
  }, [getActiveHabits]);

  const getHabitWithBestStreak = useMemo(() => {
    if (getActiveHabits.length === 0) return null;
    return getActiveHabits.reduce((best, habit) =>
      (habit.currentStreak || 0) > (best?.currentStreak || 0) ? habit : best
    , null);
  }, [getActiveHabits]);

  const getHabitsByCategory = (category) =>
    getActiveHabits.filter((h) => h.category === category);

  const getHabitsByPriority = (priority) =>
    getActiveHabits.filter((h) => h.priority === priority);

  const getHabitsSortedBy = (sortBy) => {
    const sorted = [...getActiveHabits];
    switch (sortBy) {
      case 'streak':
        return sorted.sort((a, b) => (b.currentStreak || 0) - (a.currentStreak || 0));
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'priority':
        const priorityOrder = { High: 0, Medium: 1, Low: 2 };
        return sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      case 'dateAdded':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return sorted;
    }
  };

  const getAllTimeCompletions = useMemo(() => {
    return getActiveHabits.reduce((total, habit) => {
      return total + Object.values(habit.completionLog || {}).filter(Boolean).length;
    }, 0);
  }, [getActiveHabits]);

  const getMostConsistentDay = useMemo(() => {
    if (getActiveHabits.length === 0) return 'Monday';

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayCompletions = dayNames.map((day) => ({ day, count: 0 }));

    getActiveHabits.forEach((habit) => {
      Object.entries(habit.completionLog || {}).forEach(([dateStr, completed]) => {
        if (completed) {
          const dayIndex = new Date(dateStr).getDay();
          dayCompletions[dayIndex].count++;
        }
      });
    });

    const maxDay = dayCompletions.reduce((max, day) => (day.count > max.count ? day : max), dayCompletions[0]);
    return maxDay.count > 0 ? maxDay.day : 'Monday';
  }, [getActiveHabits]);

  return {
    habits: getActiveHabits,
    allHabits: habits,
    darkMode,
    ollamaModel,
    showMotivation,
    todayHabits: getTodayHabits,
    completedTodayCount: getCompletedTodayCount,
    totalTodayCount: getTotalTodayCount,
    completionPercentage: getCompletionPercentage,
    bestStreak: getBestStreak,
    habitWithBestStreak: getHabitWithBestStreak,
    allTimeCompletions: getAllTimeCompletions,
    mostConsistentDay: getMostConsistentDay,
    getHabitById,
    getHabitsByCategory,
    getHabitsByPriority,
    getHabitsSortedBy,
    addHabit,
    editHabit,
    deleteHabit,
    toggleHabit,
    setDarkMode,
    setOllamaModel,
    setShowMotivation,
    importData,
    resetAllData,
  };
};

export default useHabits;
