const HABIT_IMPACTS = {
  'no junk food': { financial: { amount: 100, unit: 'day', currency: '₹' }, health: 'Reduce heart disease risk by 30%', lifespan: '+2 years' },
  'morning run': { financial: null, health: 'Burns 300 calories per session', lifespan: '+3-5 years' },
  'read': { financial: null, health: null, time: '12 books per year', lifespan: null },
  'drink water': { financial: { amount: 50, unit: 'day', currency: '₹', note: 'vs buying drinks' }, health: 'Improve skin, energy, kidney health', time: null },
  'no alcohol': { financial: { amount: 200, unit: 'day', currency: '₹' }, health: 'Liver health +40%', lifespan: '+5 years' },
  'meditation': { financial: null, health: 'Reduce stress by 30%', time: null, lifespan: null },
  'save': { financial: { amount: null, unit: 'month', currency: '₹', note: '20% of income' }, health: null, time: null },
  'workout': { financial: null, health: 'Build muscle, boost mood', time: null, lifespan: '+3 years' },
  'sleep': { financial: null, health: 'Better cognitive function', time: null, lifespan: '+2 years' }
};

export const getHabitImpact = (habitName) => {
  const name = habitName.toLowerCase();
  for (const [key, value] of Object.entries(HABIT_IMPACTS)) {
    if (name.includes(key) || key.includes(name)) return value;
  }
  return { financial: null, health: 'Building healthy routine', time: null, lifespan: null };
};

export const calculateYearlyImpact = (habit) => {
  if (!habit?.streak || habit.streak < 7) return null;
  const impact = getHabitImpact(habit.name);
  if (!impact?.financial?.amount) return null;
  const yearly = impact.financial.amount * 365;
  return `₹${yearly.toLocaleString()}/year`;
};