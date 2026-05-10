export const calculateBurnoutRisk = (habits, moodLog) => {
  if (!habits || habits.length === 0) {
    return { riskLevel: 'low', riskScore: 0, signals: [], recoveryPlan: [], message: 'You are doing great!' };
  }

  const signals = [];
  let totalScore = 0;

  const completionTrends = habits.map(h => {
    const entries = Object.keys(h.completionLog || {});
    if (entries.length < 14) return 0;
    const recent = entries.slice(-7);
    const older = entries.slice(-14, -7);
    const recentRate = recent.length / 7;
    const olderRate = older.length / 7;
    return recentRate - olderRate;
  });

  const decliningTrend = completionTrends.filter(t => t < -0.1).length;
  if (decliningTrend >= 3) {
    signals.push({ name: 'Declining completion', severity: 'high', description: 'Completion rate dropping for multiple habits' });
    totalScore += 35;
  } else if (decliningTrend >= 1) {
    signals.push({ name: 'Slight decline', severity: 'medium', description: 'Some habits getting harder to maintain' });
    totalScore += 20;
  }

  const moodEntries = Object.values(moodLog || {});
  const negativeMoods = moodEntries.filter(m => m && m.id <= 2).length;
  if (negativeMoods >= 3) {
    signals.push({ name: 'Low mood', severity: 'high', description: 'Multiple low mood days detected' });
    totalScore += 30;
  } else if (negativeMoods >= 1) {
    signals.push({ name: 'Mixed emotions', severity: 'medium', description: 'Some emotionally challenging days' });
    totalScore += 15;
  }

  const longStreak = Math.max(...habits.map(h => h.currentStreak || 0));
  if (longStreak > 30) {
    signals.push({ name: 'Streak fatigue', severity: 'medium', description: 'Long streaks may lead to burnout' });
    totalScore += 15;
  }

  if (habits.length > 10) {
    signals.push({ name: 'Habit overload', severity: 'medium', description: 'Managing many habits at once' });
    totalScore += 20;
  }

  const hardHabits = habits.filter(h => (h.difficulty || 'medium') === 'hard').length;
  if (hardHabits > 3) {
    signals.push({ name: 'High difficulty', severity: 'medium', description: 'Several challenging habits' });
    totalScore += 15;
  }

  const riskScore = Math.min(100, totalScore);
  let riskLevel = 'low';
  if (riskScore >= 70) riskLevel = 'critical';
  else if (riskScore >= 50) riskLevel = 'high';
  else if (riskScore >= 30) riskLevel = 'medium';

  const recoveryPlan = generateRecoveryPlan(signals);

  let message = "You're doing great! Keep it up.";
  if (riskLevel === 'critical') message = "🆘 Take a rest day NOW. You've been pushing hard.";
  else if (riskLevel === 'high') message = "🚨 Burnout risk detected. Consider taking it easy.";
  else if (riskLevel === 'medium') message = "⚠️ Watch out — signs of fatigue showing.";

  return { riskLevel, riskScore, signals, recoveryPlan, message };
};

const generateRecoveryPlan = (signals) => {
  const plan = [];
  
  if (signals.find(s => s.name === 'Declining completion' || s.name === 'Streak fatigue')) {
    plan.push('Take a 1-day break from non-essential habits');
    plan.push('Focus on your top 3 habits only');
  }
  
  if (signals.find(s => s.name === 'Habit overload')) {
    plan.push('Temporarily pause 2-3 lower priority habits');
  }
  
  if (signals.find(s => s.name === 'Low mood' || s.name === 'High difficulty')) {
    plan.push('Add a self-care habit (meditation, walks)');
    plan.push('Celebrate small wins');
  }
  
  if (plan.length === 0) {
    plan.push('Keep your current routine');
    plan.push('Stay consistent');
  }

  return plan;
};

export default { calculateBurnoutRisk };