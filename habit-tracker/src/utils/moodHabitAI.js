import { getLast30DaysMoods, getMoodById } from './moodUtils';
import { getTodayISO, getLastNDays } from './dateUtils';

export const analyzeMoodHabitCorrelation = (habits, moodLog) => {
  if (!habits || habits.length === 0 || !moodLog || Object.keys(moodLog).length < 7) {
    return null;
  }

  const moodCorrelation = {};
  const last7Days = getLastNDays(7).map(d => d.iso);
  
  habits.forEach(habit => {
    const completionByMood = {};
    
    Object.entries(habit.completionLog || {}).forEach(([date, completed]) => {
      if (completed && last7Days.includes(date)) {
        const mood = moodLog[date];
        if (mood) {
          if (!completionByMood[mood]) {
            completionByMood[mood] = 0;
          }
          completionByMood[mood]++;
        }
      }
    });
    
    const totalCompletions = Object.values(completionByMood).reduce((a, b) => a + b, 0);
    
    if (totalCompletions > 0) {
      const moodCounts = Object.entries(completionByMood).map(([moodId, count]) => {
        const moodInfo = getMoodById(parseInt(moodId));
        return {
          moodId: parseInt(moodId),
          emoji: moodInfo?.emoji || '😐',
          label: moodInfo?.label || 'Unknown',
          count,
          percentage: Math.round((count / totalCompletions) * 100),
        };
      }).sort((a, b) => b.percentage - a.percentage);
      
      const moodCorrelationScore = moodCounts[0]?.percentage >= 60 ? 
        { bestMood: moodCounts[0], isStrong: moodCounts[0].percentage >= 80 } :
        null;
      
      moodCorrelation[habit.id] = {
        habitName: habit.name,
        habitIcon: habit.icon,
        totalCompletions,
        moodBreakdown: moodCounts,
        correlation: moodCorrelationScore,
      };
    }
  });

  return moodCorrelation;
};

export const getAIRecommendation = (habits, moodLog) => {
  const correlation = analyzeMoodHabitCorrelation(habits, moodLog);
  
  if (!correlation || Object.keys(correlation).length === 0) {
    return {
      emoji: '🤖',
      message: 'Build more data! Track your mood for 7+ days to get personalized insights.',
      confidence: 'low',
    };
  }

  const strongCorrelations = Object.values(correlation).filter(c => c.correlation?.isStrong);
  
  if (strongCorrelations.length > 0) {
    const best = strongCorrelations[0];
    return {
      emoji: '🎯',
      message: `You're most likely to complete habits when feeling ${best.correlation.bestMood.emoji} ${best.correlation.bestMood.label}!`,
      confidence: 'high',
      data: best,
      advice: `Try scheduling important tasks when you're in a ${best.correlation.bestMood.label} mood for best results.`,
    };
  }

  return {
    emoji: '💡',
    message: 'Keep tracking! Your mood patterns will become clearer with more data.',
    confidence: 'medium',
  };
};

export const predictCompletionLikelihood = (habit, moodLog) => {
  const todayMood = moodLog[getTodayISO()];
  
  if (!todayMood) {
    return { emoji: '🤔', message: 'Check in with your mood first!', likelihood: null };
  }

  const correlation = analyzeMoodHabitCorrelation([habit], moodLog);
  const habitData = correlation?.[habit.id];
  
  if (!habitData) {
    return { emoji: '🤔', message: 'Not enough data to predict yet!', likelihood: null };
  }

  const moodMatch = habitData.moodBreakdown.find(m => m.moodId === todayMood);
  
  if (moodMatch) {
    return {
      emoji: moodMatch.percentage >= 70 ? '🔥' : '✨',
      message: `${moodMatch.percentage}% likelihood of completion today`,
      likelihood: moodMatch.percentage,
      basedOn: `${moodMatch.emoji} ${moodMatch.label} mood`,
    };
  }

  return {
    emoji: '🤔',
    message: 'No pattern found for your current mood yet',
    likelihood: 50,
    basedOn: 'No historical data for this mood',
  };
};

export const getMoodInsights = (habits, moodLog) => {
  return {
    correlation: analyzeMoodHabitCorrelation(habits, moodLog),
    recommendation: getAIRecommendation(habits, moodLog),
  };
};

export default { analyzeMoodHabitCorrelation, getAIRecommendation, predictCompletionLikelihood, getMoodInsights };