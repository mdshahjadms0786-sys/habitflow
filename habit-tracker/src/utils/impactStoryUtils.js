export const generateImpactStory = (habits, startDate) => {
  if (!habits || habits.length === 0) return { story: 'Start tracking habits to see your impact!', impacts: [] };
  
  const impacts = [];
  const today = new Date();
  const start = startDate ? new Date(startDate) : new Date(Math.min(...habits.map(h => new Date(h.createdAt || today))));
  const days = Math.max(1, Math.floor((today - start) / (1000 * 60 * 60 * 24)));
  
  habits.forEach(habit => {
    const streak = habit.currentStreak || 0;
    const name = habit.name.toLowerCase();
    
    if (name.includes('run') || name.includes('walk') || name.includes('exercise')) {
      const km = Math.round(streak * 0.5 * 10) / 10;
      const marathons = Math.floor(km / 42);
      impacts.push({ emoji: '🏃', value: `${km}km run`, detail: marathons > 0 ? `${marathons} marathons!` : `${streak} days active` });
    }
    
    if (name.includes('water') || name.includes('drink')) {
      const glasses = streak * 3;
      impacts.push({ emoji: '💧', value: `${glasses}L water`, detail: `${Math.round(glasses / 2)} weeks hydrated` });
    }
    
    if (name.includes('read') || name.includes('book')) {
      const pages = streak * 30;
      const books = Math.floor(pages / 200);
      impacts.push({ emoji: '📚', value: `${pages} pages`, detail: books > 0 ? `~${books} books!` : `${streak} days reading` });
    }
    
    if (name.includes('meditation') || name.includes('meditate') || name.includes('breathe')) {
      const mins = streak * 15;
      const hours = Math.round(mins / 60 * 10) / 10;
      impacts.push({ emoji: '🧘', value: `${hours}h meditated`, detail: `${mins} min mindfulness` });
    }
    
    if (name.includes('journal') || name.includes('write')) {
      const words = streak * 100;
      impacts.push({ emoji: '✍️', value: `${words} words`, detail: `${streak} entries written` });
    }
  });
  
  const daysSinceStart = Math.max(1, days);
  const story = `In ${daysSinceStart} days of your habit journey:
${impacts.map(i => `${i.emoji} You've ${i.value} — ${i.detail}`).join('\n')}
Every habit counts. Every day matters.`;
  
  return { story, impacts, days: daysSinceStart };
};

export default { generateImpactStory };