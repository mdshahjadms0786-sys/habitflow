export const calculateLifeScore = (habits = [], moodLog = {}) => {
  if (!habits || habits.length === 0) return null;
  
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const Physical = { Health: 0, Fitness: 0 };
  const Mental = { Personal: 0, Learning: 0 };
  const Productivity = { Work: 0, Learning: 0 };
  const Social = { Personal: 0 };
  
  let pTotal = 0, pDone = 0, mTotal = 0, mDone = 0, prodTotal = 0, prodDone = 0, sTotal = 0, sDone = 0;
  
  habits.forEach(h => {
    if (!h.completionLog) return;
    const cat = h.category || 'Personal';
    const daysCounted = new Set();
    for (let i = 0; i < 30; i++) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0];
      if (h.completionLog[dateStr] && !daysCounted.has(dateStr)) {
        daysCounted.add(dateStr);
        if (Physical[cat] !== undefined) { pTotal++; pDone++; }
        else if (cat === 'Personal' || cat === 'Learning') { mTotal++; mDone++; }
        else if (Productivity[cat] !== undefined || cat === 'Work' || cat === 'Learning') { prodTotal++; prodDone++; }
        else { sTotal++; sDone++; }
      } else {
        if (Physical[cat] !== undefined) pTotal++;
        else if (cat === 'Personal' || cat === 'Learning') mTotal++;
        else if (cat === 'Work' || cat === 'Learning') prodTotal++;
        else sTotal++;
      }
    }
  });
  
  const getScore = (done, total) => total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
  const getLabel = (score) => score >= 90 ? 'Exceptional 🌟' : score >= 75 ? 'Great 💪' : score >= 60 ? 'Good 😊' : score >= 45 ? 'Average 📊' : 'Needs Work ⚠️';
  
  const physical = { score: getScore(pDone, pTotal), label: getLabel(pDone / pTotal * 100), color: pDone / pTotal * 100 >= 60 ? '#22c55e' : '#EAB308', icon: '💪' };
  const mental = { score: getScore(mDone, mTotal), label: getLabel(mDone / mTotal * 100), color: mDone / mTotal * 100 >= 60 ? '#22c55e' : '#EAB308', icon: '🧠' };
  const productivity = { score: getScore(prodDone, prodTotal), label: getLabel(prodDone / prodTotal * 100), color: prodDone / prodTotal * 100 >= 60 ? '#22c55e' : '#EAB308', icon: '💼' };
  const social = { score: getScore(sDone, sTotal), label: getLabel(sDone / sTotal * 100), color: sDone / sTotal * 100 >= 60 ? '#22c55e' : '#EAB308', icon: '🤝' };
  
  const overall = Math.round(physical.score * 0.3 + mental.score * 0.25 + productivity.score * 0.25 + social.score * 0.2);
  const grade = overall >= 95 ? 'A+' : overall >= 90 ? 'A' : overall >= 85 ? 'B+' : overall >= 75 ? 'B' : overall >= 65 ? 'C+' : overall >= 55 ? 'C' : 'D';
  
  return { physical, mental, productivity, social, overall, grade, trend: 'stable' };
};