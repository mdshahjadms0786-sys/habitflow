const HABIT_RIPPLES = { 'morning run': ['drink water', 'stretch'], 'meditation': ['journaling', 'gratitude'], 'workout': ['protein', 'sleep early'], 'read': ['journaling', 'notes review'], 'cold shower': ['workout', 'morning meditation'] };

export const getRippleSuggestion = (completedHabitName, existingHabits) => {
  if (!completedHabitName || !existingHabits) return null;
  const name = completedHabitName.toLowerCase();
  for (const [key, suggestions] of Object.entries(HABIT_RIPPLES)) {
    if (name.includes(key)) {
      const suggestion = suggestions.find(s => existingHabits.some(h => h.name.toLowerCase().includes(s) && !h.completionLog?.[new Date().toISOString().split('T')[0]]));
      if (suggestion) {
        const h = existingHabits.find(x => x.name.toLowerCase().includes(suggestion));
        if (h) return { habitId: h.id, habitName: h.name, icon: h.icon, message: `Great timing! Complete ${h.name} while you're in the zone 🌊` };
      }
    }
  }
  return null;
};