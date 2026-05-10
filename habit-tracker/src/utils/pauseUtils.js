import { getTodayISO } from './dateUtils';

export const PAUSE_REASONS = [
  { id: 'vacation', label: 'Vacation 🏖️', icon: '🏖️' },
  { id: 'sick', label: 'Sick 🤒', icon: '🤒' },
  { id: 'travelling', label: 'Travelling ✈️', icon: '✈️' },
  { id: 'busy', label: 'Too Busy 😰', icon: '😰' },
  { id: 'custom', label: 'Other Reason', icon: '📝' }
];

export const isHabitPaused = (habit) => {
  if (!habit.pausedUntil) return false;
  const today = new Date();
  const pauseEnd = new Date(habit.pausedUntil);
  return pauseEnd >= today;
};

export const isPauseExpired = (habit) => {
  if (!habit.pausedUntil) return false;
  const today = new Date();
  const pauseEnd = new Date(habit.pausedUntil);
  return pauseEnd < today;
};

export const getPauseDaysLeft = (habit) => {
  if (!habit.pausedUntil) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const pauseEnd = new Date(habit.pausedUntil);
  pauseEnd.setHours(0, 0, 0, 0);
  const diffTime = pauseEnd - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export const getPauseCost = (extraDays) => {
  const freeDays = 7;
  const costPerExtraDay = 50;
  
  if (extraDays <= freeDays) {
    return { freeDays: extraDays, extraDays: 0, totalCost: 0 };
  }
  
  const actualExtraDays = extraDays - freeDays;
  return {
    freeDays,
    extraDays: actualExtraDays,
    totalCost: actualExtraDays * costPerExtraDay
  };
};

export const autoResumePausedHabits = (habits) => {
  return habits.map(habit => {
    if (isPauseExpired(habit)) {
      const { pausedUntil, pauseReason, pausedAt, ...rest } = habit;
      return rest;
    }
    return habit;
  });
};

export const getPausedHabits = (habits) => {
  return habits.filter(habit => isHabitPaused(habit));
};

export const getActiveHabits = (habits) => {
  return habits.filter(habit => !isHabitPaused(habit));
};