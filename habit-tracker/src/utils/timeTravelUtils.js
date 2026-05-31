import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'ht_dream_diary';

export const getDaySnapshot = (habits, moodLog, dateStr) => {
  const date = new Date(dateStr);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  
  const completedHabits = habits.filter(h => h.completionLog?.[dateStr]);
  const missedHabits = habits.filter(h => !h.completionLog?.[dateStr]);
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedHabits.length / totalHabits) * 100) : 0;
  
  const mood = moodLog?.[dateStr] || null;
  const points = completedHabits.length * 10;
  
  let narrative = '';
  if (completionRate === 100) {
    narrative = `A perfect day! All habits were completed. ${completedHabits[0]?.name} showed exceptional dedication.`;
  } else if (completionRate >= 70) {
    narrative = `A solid day with ${completionRate}% completion. ${completedHabits.length} of ${totalHabits} habits done.`;
  } else if (completionRate >= 30) {
    narrative = `A challenging day. ${completedHabits.length} completed, ${missedHabits.length} missed. Keep pushing!`;
  } else {
    narrative = `A tough day with only ${completionRate}% completion. Tomorrow is a fresh start!`;
  }
  
  return {
    date: dateStr,
    dayName,
    completedHabits: completedHabits.map(h => ({ id: h.id, name: h.name, icon: h.icon })),
    missedHabits: missedHabits.map(h => ({ id: h.id, name: h.name, icon: h.icon })),
    totalHabits,
    completionRate,
    mood,
    points,
    narrative
  };
};

export const getJourneyMilestones = (habits) => {
  if (!habits || habits.length === 0) return [];
  
  const milestones = [];
  const today = new Date();
  
  const firstHabit = habits.reduce((earliest, h) => {
    if (!h.createdAt) return earliest;
    const created = new Date(h.createdAt);
    return !earliest || created < earliest ? created : earliest;
  }, null);
  
  if (firstHabit) {
    milestones.push({
      date: firstHabit.toISOString().split('T')[0],
      type: 'first_habit',
      title: 'Journey Began',
      description: `Started tracking ${habits.length} habits`
    });
  }
  
  const bestStreakHabit = habits.reduce((best, h) => (h.currentStreak || 0) > (best?.currentStreak || 0) ? h : best, habits[0]);
  if (bestStreakHabit?.currentStreak >= 7) {
    milestones.push({
      date: today.toISOString().split('T')[0],
      type: 'streak',
      title: `${bestStreakHabit.currentStreak}-Day Streak`,
      description: `Achieved with ${bestStreakHabit.name}`
    });
  }
  
  return milestones;
};

export const saveDiaryEntry = (entry) => {
  try {
    const entries = loadDiaryEntries();
    const updated = entries.filter(e => e.date !== entry.date || e.type !== entry.type);
    updated.push({ ...entry, id: uuidv4() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 30)));
  } catch (e) {
    console.error('Failed to save diary entry', e);
  }
};

export const loadDiaryEntries = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to load diary entries', e);
    return [];
  }
};

export const getTodayEntry = (type) => {
  const today = new Date().toISOString().split('T')[0];
  const entries = loadDiaryEntries();
  return entries.find(e => e.date === today && e.type === type);
};

export default { getDaySnapshot, getJourneyMilestones, saveDiaryEntry, loadDiaryEntries, getTodayEntry };