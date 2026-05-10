import { format, parseISO, subDays } from 'date-fns';
import { getTodayISO } from './dateUtils';

export const MOODS = [
  { id: 1, emoji: '😢', label: 'Terrible', color: '#E24B4A', bgColor: '#FCEBEB' },
  { id: 2, emoji: '😞', label: 'Bad', color: '#D85A30', bgColor: '#FAECE7' },
  { id: 3, emoji: '😐', label: 'Okay', color: '#BA7517', bgColor: '#FAEEDA' },
  { id: 4, emoji: '😀', label: 'Good', color: '#1D9E75', bgColor: '#E1F5EE' },
  { id: 5, emoji: '🤩', label: 'Amazing', color: '#534AB7', bgColor: '#EEEDFE' },
];

export const getMoodById = (moodId) => {
  if (!moodId) return null;
  return MOODS.find((m) => m.id === moodId) || null;
};

export const getTodayMood = (moodLog) => {
  if (!moodLog) return null;
  const today = getTodayISO();
  const moodId = moodLog[today];
  if (!moodId) return null;
  return getMoodById(moodId);
};

export const getWeekMoods = (moodLog) => {
  if (!moodLog) return [];
  const days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const moodId = moodLog[dateStr];
    days.push({
      date: dateStr,
      day: format(date, 'EEE'),
      mood: moodId ? getMoodById(moodId) : null,
    });
  }

  return days;
};

export const getLast30DaysMoods = (moodLog) => {
  if (!moodLog) return [];
  const days = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const moodId = moodLog[dateStr];
    days.push({
      date: dateStr,
      day: format(date, 'EEE'),
      mood: moodId ? getMoodById(moodId) : null,
    });
  }

  return days;
};

export const getAverageMood = (moodLog, days = 7) => {
  if (!moodLog || Object.keys(moodLog).length === 0) return null;

  const today = new Date();
  let totalScore = 0;
  let count = 0;

  for (let i = 0; i < days; i++) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const moodId = moodLog[dateStr];
    if (moodId && moodId >= 1 && moodId <= 5) {
      totalScore += moodId;
      count++;
    }
  }

  return count > 0 ? (totalScore / count).toFixed(1) : null;
};

export const getMoodHabitCorrelation = (moodLog, habits) => {
  if (!moodLog || !habits || habits.length === 0) return [];

  const today = new Date();
  const habitData = [];

  for (const habit of habits) {
    let moodWithHabit = [];
    let moodWithoutHabit = [];

    for (let i = 0; i < 30; i++) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const moodId = moodLog[dateStr];

      if (!moodId) continue;

      const habitCompleted = habit.completionLog?.[dateStr];

      if (habitCompleted) {
        moodWithHabit.push(moodId);
      } else {
        moodWithoutHabit.push(moodId);
      }
    }

    if (moodWithHabit.length < 3 || moodWithoutHabit.length < 3) continue;

    const avgWith = moodWithHabit.reduce((a, b) => a + b, 0) / moodWithHabit.length;
    const avgWithout = moodWithoutHabit.reduce((a, b) => a + b, 0) / moodWithoutHabit.length;
    const improvement = avgWith > avgWithout
      ? (((avgWith - avgWithout) / avgWithout) * 100).toFixed(0)
      : (((avgWithout - avgWith) / avgWithout) * -100).toFixed(0);

    habitData.push({
      habitName: habit.name,
      habitIcon: habit.icon || '⭐',
      avgMoodWithHabit: avgWith.toFixed(1),
      avgMoodWithoutHabit: avgWithout.toFixed(1),
      improvement: parseInt(improvement),
      hasImprovement: avgWith > avgWithout,
    });
  }

  return habitData.sort((a, b) => b.improvement - a.improvement).slice(0, 5);
};

export const getBestMoodDay = (moodLog) => {
  if (!moodLog || Object.keys(moodLog).length === 0) return null;

  const dayScores = {
    0: { name: 'Sunday', scores: [] },
    1: { name: 'Monday', scores: [] },
    2: { name: 'Tuesday', scores: [] },
    3: { name: 'Wednesday', scores: [] },
    4: { name: 'Thursday', scores: [] },
    5: { name: 'Friday', scores: [] },
    6: { name: 'Saturday', scores: [] },
  };

  const today = new Date();

  for (let i = 0; i < 90; i++) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const moodId = moodLog[dateStr];

    if (!moodId) continue;

    const dayIndex = date.getDay();
    dayScores[dayIndex].scores.push(moodId);
  }

  let bestDay = null;
  let bestAvg = 0;

  for (const [dayIndex, data] of Object.entries(dayScores)) {
    if (data.scores.length < 3) continue;
    const avg = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
    if (avg > bestAvg) {
      bestAvg = avg;
      bestDay = data.name;
    }
  }

  return bestDay;
};

export const getMoodStreak = (moodLog) => {
  if (!moodLog || Object.keys(moodLog).length === 0) return 0;

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');

    if (moodLog[dateStr]) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return streak;
};

export const getLoggedDaysCount = (moodLog) => {
  if (!moodLog) return 0;
  return Object.keys(moodLog).filter((k) => moodLog[k]).length;
};
