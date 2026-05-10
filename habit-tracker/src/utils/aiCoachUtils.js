import { format, subDays, startOfWeek } from 'date-fns';
import { getWeekCompletions } from './streakUtils';

export const analyzeWeeklyHabits = (habits, moodLog) => {
  if (!habits || habits.length === 0) {
    return "I don't have any habits to analyze yet. Help me set up some habits first!";
  }

  const today = new Date();
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    weekDays.push(format(subDays(today, 6 - i), 'yyyy-MM-dd'));
  }

  let habitData = [];
  let bestHabit = null;
  let worstHabit = null;
  let bestRate = -1;
  let worstRate = 101;

  habits.forEach((habit) => {
    if (!habit) return;
    const weekCompletions = getWeekCompletions(habit.completionLog || {});
    let completed = 0;
    weekDays.forEach((day) => {
      if (weekCompletions[day]) completed++;
    });
    const rate = Math.round((completed / 7) * 100);
    habitData.push({ name: habit.name, rate, completed, icon: habit.icon || '⭐' });
    if (rate > bestRate) { bestRate = rate; bestHabit = { name: habit.name, rate, icon: habit.icon || '⭐' }; }
    if (rate < worstRate) { worstRate = rate; worstHabit = { name: habit.name, rate, icon: habit.icon || '⭐' }; }
  });

  let moodValues = [];
  weekDays.forEach((day) => {
    if (moodLog && moodLog[day] !== undefined) {
      moodValues.push(moodLog[day]);
    }
  });
  const avgMood = moodValues.length > 0
    ? (moodValues.reduce((a, b) => a + b, 0) / moodValues.length).toFixed(1)
    : 'N/A';

  const habitList = habitData.map(h => `${h.icon} ${h.name}: ${h.completed}/7 days (${h.rate}%)`).join(', ');
  const best = bestHabit ? `${bestHabit.icon} ${bestHabit.name}` : 'None';
  const worst = worstHabit && worstHabit.name !== bestHabit?.name ? `${worstHabit.icon} ${worstHabit.name}` : (bestHabit ? 'same as best' : 'None');

  return `Here is my habit data for this week: ${habitList || 'No data'}. My average mood was ${avgMood}/5. My best habit was ${best} and worst was ${worst}. Give me 3 specific actionable suggestions to improve next week. Keep response under 150 words.`;
};

export const analyzeMoodPattern = (habits, moodLog) => {
  if (!moodLog || Object.keys(moodLog).length === 0) {
    return "I haven't logged any mood data yet. Start logging your mood daily so I can analyze patterns!";
  }

  const entries = Object.entries(moodLog)
    .map(([date, mood]) => ({ date, mood }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30);

  if (entries.length < 5) {
    return `I only have ${entries.length} days of mood data. Need at least 5 days to find patterns. Keep logging your mood!`;
  }

  const habitData = (habits || []).slice(0, 5).filter(Boolean).map(habit => {
    const completedMoods = entries.filter(e => habit.completionLog?.[e.date]).map(e => e.mood);
    const avgMood = completedMoods.length > 0
      ? (completedMoods.reduce((a, b) => a + b, 0) / completedMoods.length).toFixed(1)
      : 'N/A';
    return { name: habit.name || 'Unknown', avgMood };
  });

  const data = habitData.length > 0
    ? habitData.map(h => `${h.name}: avg mood ${h.avgMood}`).join(', ')
    : 'No habit data';

  return `Here is my mood and habit data: ${data}. Explain what patterns you see between my habits and mood in 2-3 sentences.`;
};

export const generateMotivation = (stats) => {
  const completed = stats?.completionPercentage || 0;
  const streak = stats?.bestStreak || 0;
  return `I completed ${completed}% of my habits today and have a ${streak} day streak. Give me one short motivational sentence under 15 words.`;
};

export const getQuickPrompt = (type, habits, moodLog) => {
  switch (type) {
    case 'analyze_week':
      return analyzeWeeklyHabits(habits, moodLog);
    case 'mood_pattern':
      return analyzeMoodPattern(habits, moodLog);
    case 'improve_streaks':
      return "Give me 5 practical strategies to build longer habit streaks. Focus on psychology of habit formation and common pitfalls.";
    case 'focus_today':
      if (!habits || habits.length === 0) return "I have no habits yet. Suggest 3 important habits I should start building!";
      const pending = habits.filter(h => !h.completionLog?.[Object.keys(h.completionLog || {})[0]]).slice(0, 3);
      const names = pending.map(h => (h.icon || '⭐') + ' ' + h.name).join(', ');
      return `Based on my habits: ${names || 'none specific'}, which ones should I focus on today and why? Keep it brief.`;
    default:
      return "Give me helpful advice about building better habits.";
  }
};