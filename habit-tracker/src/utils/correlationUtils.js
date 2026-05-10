export const calculateCorrelations = (habits = []) => {
  if (!habits || habits.length < 2) return [];
  
  const pairs = [];
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
    dates.push(d.toISOString().split('T')[0]);
  }
  
  for (let i = 0; i < habits.length; i++) {
    for (let j = i + 1; j < habits.length; j++) {
      const h1 = habits[i], h2 = habits[j];
      let both = 0, either = 0;
      dates.forEach(d => {
        if (h1.completionLog?.[d] && h2.completionLog?.[d]) both++;
        if (h1.completionLog?.[d] || h2.completionLog?.[d]) either++;
      });
      if (either > 0) {
        const corr = both / either;
        pairs.push({ habit1Id: h1.id, habit1Name: h1.name, habit2Id: h2.id, habit2Name: h2.name, correlation: Math.round(corr * 100), strength: corr > 0.7 ? 'strong' : corr > 0.4 ? 'moderate' : 'weak' });
      }
    }
  }
  return pairs.sort((a, b) => b.correlation - a.correlation).slice(0, 5);
};