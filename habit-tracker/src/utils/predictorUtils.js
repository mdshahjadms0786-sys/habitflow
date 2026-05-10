export const predictTodaySuccess = (habits, moodLog, weatherData) => {
  if (!habits || habits.length === 0) {
    return { predictedRate: 0, confidence: 0, predictedCount: 0, factors: [], message: 'Create habits to get predictions' };
  }

  const today = new Date().getDay();
  const dayScores = [0, 85, 75, 80, 85, 90, 95];
  const dayScore = dayScores[today];
  
  const weatherScore = weatherData?.includes('rain') || weatherData?.includes('storm') ? 70 : weatherData?.includes('cloud') ? 85 : 95;
  
  const moodEntry = moodLog?.[new Date().toISOString().split('T')[0]];
  const moodScore = moodEntry ? (moodEntry.id || 3) * 20 : 70;
  
  let totalRate = 0;
  let streakMomentum = 0;
  habits.forEach(h => {
    totalRate += h.completionLog ? Object.keys(h.completionLog).length / 30 : 0;
    streakMomentum += h.currentStreak || 0;
  });
  const avgRate = totalRate / habits.length * 100;
  const trendScore = Math.min(100, avgRate);
  const streakScore = Math.min(100, streakMomentum * 2);

  const predictedRate = Math.round(dayScore * 0.3 + weatherScore * 0.1 + moodScore * 0.2 + trendScore * 0.25 + streakScore * 0.15);
  const predictedCount = Math.round(predictedRate / 100 * habits.length);
  const confidence = Math.round(70 + (streakMomentum / 10));

  const factors = [
    { name: 'Day of Week', impact: dayScore > 85 ? 'positive' : 'neutral', score: dayScore },
    { name: 'Mood', impact: moodScore > 70 ? 'positive' : 'neutral', score: moodScore },
    { name: 'Trend', impact: trendScore > 70 ? 'positive' : 'negative', score: trendScore }
  ];

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const message = `${dayNames[today]}s are your ${dayScore > 85 ? 'best' : dayScore < 75 ? 'challenging' : 'average'} days`;

  const habitPredictions = habits.map(h => ({
    habitId: h.id,
    habitName: h.name,
    probability: Math.min(95, Math.max(30, predictedRate - 10 + Math.random() * 20))
  }));

  return { predictedRate, confidence, predictedCount, factors, message, habitPredictions };
};

export const trackPredictionAccuracy = (predictions, actuals) => {
  if (!predictions || predictions.length === 0) return 0;
  
  let totalDiff = 0;
  predictions.forEach((p, i) => {
    if (actuals[i] !== undefined) {
      totalDiff += Math.abs(p - actuals[i]);
    }
  });
  const avgDiff = totalDiff / predictions.length;
  return Math.max(0, 100 - avgDiff);
};

export default { predictTodaySuccess, trackPredictionAccuracy };