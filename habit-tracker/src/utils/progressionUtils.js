export const HABIT_PROGRESSIONS = {
  'run': [
    { level: 1, name: 'Morning Walk', target: '10 min walk', pointsRequired: 0 },
    { level: 2, name: 'Easy Runner', target: '2km run', pointsRequired: 100 },
    { level: 3, name: '5K Finisher', target: '5km run', pointsRequired: 300 },
    { level: 4, name: '10K Runner', target: '10km run', pointsRequired: 700 },
    { level: 5, name: 'Marathon Prep', target: '21km training', pointsRequired: 1500 }
  ],
  'read': [
    { level: 1, name: 'Casual Reader', target: '10 pages/day', pointsRequired: 0 },
    { level: 2, name: 'Book Worm', target: '30 pages/day', pointsRequired: 100 },
    { level: 3, name: 'Speed Reader', target: '50 pages/day', pointsRequired: 300 },
    { level: 4, name: 'Book Devourer', target: '1 book/week', pointsRequired: 700 },
    { level: 5, name: 'Library Master', target: '50 books/year', pointsRequired: 1500 }
  ],
  'meditation': [
    { level: 1, name: 'Mindful Beginner', target: '5 min', pointsRequired: 0 },
    { level: 2, name: 'Quiet Mind', target: '10 min', pointsRequired: 100 },
    { level: 3, name: 'Centered Soul', target: '15 min', pointsRequired: 300 },
    { level: 4, name: 'Zen Master', target: '20 min', pointsRequired: 700 },
    { level: 5, name: 'Inner Peace', target: '30 min', pointsRequired: 1500 }
  ],
  'workout': [
    { level: 1, name: 'Easy Start', target: '15 min', pointsRequired: 0 },
    { level: 2, name: 'Gym Rookie', target: '30 min', pointsRequired: 100 },
    { level: 3, name: 'Fitness Fan', target: '45 min', pointsRequired: 300 },
    { level: 4, name: 'Training Beast', target: '1 hour', pointsRequired: 700 },
    { level: 5, name: 'Athlete', target: '2 hours', pointsRequired: 1500 }
  ],
  'journal': [
    { level: 1, name: 'Note Taker', target: '50 words', pointsRequired: 0 },
    { level: 2, name: 'Journal Writer', target: '150 words', pointsRequired: 100 },
    { level: 3, name: 'Daily Chronicler', target: '300 words', pointsRequired: 300 },
    { level: 4, name: 'Life Documenter', target: '500 words', pointsRequired: 700 },
    { level: 5, name: 'Storyteller', target: '1000 words', pointsRequired: 1500 }
  ],
  'water': [
    { level: 1, name: 'Glass Drinker', target: '1 glass', pointsRequired: 0 },
    { level: 2, name: 'Hydration Hero', target: '4 glasses', pointsRequired: 100 },
    { level: 3, name: 'Water Warrior', target: '6 glasses', pointsRequired: 300 },
    { level: 4, name: 'Aqua Master', target: '8 glasses', pointsRequired: 700 },
    { level: 5, name: 'Fully Hydrated', target: '10 glasses', pointsRequired: 1500 }
  ]
};

export const getHabitProgression = (habitName) => {
  if (!habitName) return null;
  const lower = habitName.toLowerCase();
  for (const [key, progression] of Object.entries(HABIT_PROGRESSIONS)) {
    if (lower.includes(key)) return progression;
  }
  return null;
};

export const getCurrentLevel = (habit, progression) => {
  if (!progression || !habit) return null;
  const streak = habit.currentStreak || 0;
  const points = habit.totalPoints || 0;
  
  for (let i = progression.length - 1; i >= 0; i--) {
    if (streak >= progression[i].level * 7 || points >= progression[i].pointsRequired) {
      return progression[i];
    }
  }
  return progression[0];
};

export const getNextLevel = (habit, progression) => {
  const current = getCurrentLevel(habit, progression);
  if (!current || !progression) return null;
  const currentIndex = progression.findIndex(p => p.level === current.level);
  return progression[currentIndex + 1] || null;
};

export default { HABIT_PROGRESSIONS, getHabitProgression, getCurrentLevel, getNextLevel };