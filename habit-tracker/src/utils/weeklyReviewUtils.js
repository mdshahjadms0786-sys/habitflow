import { format, subDays, startOfWeek, endOfWeek, parseISO, isSunday } from 'date-fns';

const REVIEW_SHOWN_KEY = 'ht_review_shown';

export const generateWeeklyReport = (habits, moodLog) => {
  if (!habits || habits.length === 0) return null;

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

  const weekStartStr = format(weekStart, 'yyyy-MM-dd');
  const weekEndStr = format(weekEnd, 'yyyy-MM-dd');

  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = subDays(
      endOfWeek(today, { weekStartsOn: 1 }),
      6 - i
    );
    const dateStr = format(date, 'yyyy-MM-dd');
    let completed = 0;
    habits.forEach((h) => {
      if (h.completionLog?.[dateStr]) completed++;
    });
    days.push({
      day: format(date, 'EEE'),
      date: dateStr,
      completed,
      total: habits.length,
      percentage: habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0,
    });
  }

  const totalCompleted = days.reduce((sum, d) => sum + d.completed, 0);
  const totalPossible = habits.length * 7;
  const completionRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  let bestHabit = { name: '', icon: '⭐', completedDays: 0 };
  let worstHabit = { name: '', icon: '⭐', completedDays: 999 };

  habits.forEach((h) => {
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const d = format(subDays(weekEnd, 6 - i), 'yyyy-MM-dd');
      if (h.completionLog?.[d]) count++;
    }
    if (count > bestHabit.completedDays) {
      bestHabit = { name: h.name, icon: h.icon || '⭐', completedDays: count };
    }
    if (count < worstHabit.completedDays) {
      worstHabit = { name: h.name, icon: h.icon || '⭐', completedDays: count };
    }
  });

  if (worstHabit.completedDays === 999) {
    worstHabit = { name: 'N/A', icon: '⭐', completedDays: 0 };
  }

  let moodTotal = 0;
  let moodCount = 0;
  for (let i = 0; i < 7; i++) {
    const d = format(subDays(weekEnd, 6 - i), 'yyyy-MM-dd');
    const m = moodLog?.[d];
    if (m) {
      moodTotal += m;
      moodCount++;
    }
  }
  const averageMood = moodCount > 0 ? (moodTotal / moodCount).toFixed(1) : null;

  const moodEmojis = { 1: '😢', 2: '😞', 3: '😐', 4: '😀', 5: '🤩' };
  const moodLabels = { 1: 'Terrible', 2: 'Bad', 3: 'Okay', 4: 'Good', 5: 'Amazing' };
  const moodEmoji = averageMood ? moodEmojis[Math.round(parseFloat(averageMood))] : '😐';

  let topStreak = { name: '', icon: '⭐', streak: 0 };
  habits.forEach((h) => {
    if ((h.currentStreak || 0) > topStreak.streak) {
      topStreak = { name: h.name, icon: h.icon || '⭐', streak: h.currentStreak || 0 };
    }
  });

  const bestDay = days.reduce((best, d) => (d.percentage > best.percentage ? d : best), days[0]);

  const improvements = [];
  if (completionRate < 50) {
    improvements.push('Try completing habits before noon for better consistency');
    improvements.push('Consider reducing the number of active habits to focus on quality');
  } else if (completionRate < 75) {
    improvements.push('You are close to great consistency — push for 80%+');
    improvements.push('Stack habits together to complete them as a routine');
  } else {
    improvements.push('Excellent consistency! Consider adding a new challenging habit');
  }

  if (averageMood && parseFloat(averageMood) < 3) {
    improvements.push('Your mood improves when habits are completed — prioritize them');
  }

  const bestHabitName = bestHabit.name || '';
  if (bestHabitName) {
    const bestHabitObj = habits.find((h) => h.name === bestHabitName);
    if (bestHabitObj && bestHabit.completedDays >= 5) {
      improvements.push(`${bestHabitObj.icon} ${bestHabitName} is your strongest habit — keep it up!`);
    }
  }

  while (improvements.length < 3) {
    improvements.push('Review your habits weekly to stay on track');
  }

  const achievements = [];
  if (completionRate >= 80) achievements.push('🏆 Over 80% weekly completion');
  if (completionRate === 100) achievements.push('🌟 Perfect week!');
  if (topStreak.streak >= 7) achievements.push(`🔥 ${topStreak.name} on a ${topStreak.streak}-day streak`);
  if (averageMood && parseFloat(averageMood) >= 4) achievements.push('😊 Great mood week!');
  if (bestDay && bestDay.percentage === 100) achievements.push(`💪 Perfect day on ${bestDay.day}`);
  if (achievements.length === 0) achievements.push('📅 Keep tracking — next week will be better!');

  return {
    weekStart: format(weekStart, 'MMM d'),
    weekEnd: format(weekEnd, 'MMM d, yyyy'),
    weekStartISO: weekStartStr,
    weekEndISO: weekEndStr,
    totalHabits: habits.length,
    totalCompleted,
    totalPossible,
    completionRate,
    bestHabit,
    worstHabit,
    averageMood,
    moodEmoji,
    topStreak,
    dailyBreakdown: days,
    improvements: improvements.slice(0, 3),
    achievements,
  };
};

export const isReviewDay = () => {
  return isSunday(new Date());
};

export const hasReviewBeenShown = (weekStart) => {
  try {
    const data = localStorage.getItem(REVIEW_SHOWN_KEY);
    if (!data) return false;
    const shown = JSON.parse(data);
    return shown?.weekStart === weekStart;
  } catch {
    return false;
  }
};

export const markReviewShown = (weekStart) => {
  try {
    localStorage.setItem(REVIEW_SHOWN_KEY, JSON.stringify({ weekStart, timestamp: new Date().toISOString() }));
  } catch (e) {
    console.error('Failed to mark review as shown:', e);
  }
};
