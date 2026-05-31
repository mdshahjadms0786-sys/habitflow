const COACHING_SESSIONS_KEY = 'ht_coaching_sessions';
const COACH_PERSONALITY_KEY = 'ht_coach_personality';

export const COACH_PERSONALITIES = {
  strict: { name: 'Strict', icon: '🏋️', description: 'Direct and challenging' },
  motivational: { name: 'Motivational', icon: '🌟', description: 'Encouraging and inspiring' },
  analytical: { name: 'Analytical', icon: '📊', description: 'Data-driven and logical' },
  gentle: { name: 'Gentle', icon: '💚', description: 'Supportive and understanding' }
};

export function getCoachPersonality() {
  return localStorage.getItem(COACH_PERSONALITY_KEY) || 'motivational';
}

export function saveCoachPersonality(personality) {
  localStorage.setItem(COACH_PERSONALITY_KEY, personality);
}

export function getWeeklyCoachingPrompt(habits, moodLog, weeklyStats) {
  const personality = getCoachPersonality();
  
  const totalHabits = habits?.length || 0;
  const completedCount = weeklyStats?.completed || 0;
  const totalPossible = weeklyStats?.total || totalHabits * 7;
  const completionRate = totalPossible > 0 ? Math.round((completedCount / totalPossible) * 100) : 0;
  
  const habitStats = habits?.map(h => {
    let weekCompletions = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      if (h.completionLog?.[dateStr]?.completed) weekCompletions++;
    }
    return { name: h.name, completions: weekCompletions, rate: Math.round((weekCompletions / 7) * 100) };
  }) || [];
  
  const sortedByRate = [...habitStats].sort((a, b) => b.rate - a.rate);
  const bestHabit = sortedByRate[0];
  const worstHabit = sortedByRate[sortedByRate.length - 1];
  
  const bestStreak = Math.max(...habits?.map(h => h.currentStreak || 0) || [0]);
  
  const moodValues = Object.values(moodLog || {}).filter(m => typeof m === 'number' || m?.score);
  const avgMood = moodValues.length > 0 
    ? (moodValues.reduce((a, b) => a + (typeof b === 'number' ? b : b.score || 0), 0) / moodValues.length).toFixed(1)
    : null;
  
  const toneInstructions = {
    strict: 'Be direct and demanding. Push hard for results.',
    motivational: 'Be encouraging and uplifting. Celebrate wins.',
    analytical: 'Be logical and precise. Use data to support advice.',
    gentle: 'Be kind and understanding. Be supportive of setbacks.'
  };

  return `You are a personal habit coach with a ${personality} coaching style. ${toneInstructions[personality]}

Here is my data for this week:
- Habits tracked: ${totalHabits}
- Completion rate: ${completionRate}% (${completedCount}/${totalPossible})
- Best performing habit: ${bestHabit ? `${bestHabit.name} (${bestHabit.rate}%)` : 'N/A'}
- Struggling habit: ${worstHabit && worstHabit.rate < 50 ? `${worstHabit.name} (${worstHabit.rate}%)` : 'All habits doing well'}
- Current streak: ${bestStreak} days
- Mood average: ${avgMood ? `${avgMood}/5` : 'No data'}
- Previous week completion: ${weeklyStats?.prevPercentage || 'N/A'}%

Please provide a coaching response with these 4 sections exactly:
1. "What you did well:" - 2-3 specific observations about my wins this week
2. "Areas to improve:" - 2-3 specific things that need attention
3. "Your plan for next week:" - 3 actionable steps I should take
4. "Key insight:" - 1 motivational insight based on my data

Keep response under 300 words total. Be specific to my data, not generic advice.`;
}

export function generateImprovementPlan(weakHabits, strongHabits, moodData) {
  const weakNames = weakHabits?.map(h => h.name).join(', ') || 'none identified';
  const strongNames = strongHabits?.map(h => h.name).join(', ') || 'none identified';
  
  const avgMood = moodData ? Object.values(moodData).reduce((a, b) => a + (b?.score || b || 0), 0) / Object.values(moodData).length : null;
  const moodAdvice = avgMood ? (avgMood < 3 ? 'Your mood has been low - consider adding mood-boosting habits.' : '') : '';
  
  return `Based on your performance analysis:
- Strong habits: ${strongNames}
- Weak habits: ${weakNames}
- Current mood: ${avgMood ? avgMood.toFixed(1) + '/5' : 'No data'}
${moodAdvice}

Create a personalized improvement plan with:
1. Which habit to prioritize first
2. Specific adjustment to make
3. How to maintain your strong habits while improving weak ones
4. A realistic target for next week`;
}

export function analyzeProgressTrend(weeklyHistory) {
  if (!weeklyHistory || weeklyHistory.length < 2) {
    return { trend: 'stable', percentage: 0, insight: 'Not enough data to determine trend yet.' };
  }
  
  const recent = weeklyHistory.slice(-4);
  const first = recent[0]?.percentage || 0;
  const last = recent[recent.length - 1]?.percentage || 0;
  const change = last - first;
  
  if (change >= 10) {
    return { 
      trend: 'improving', 
      percentage: change,
      insight: `Great progress! You've improved ${change}% over the last ${recent.length} weeks.`
    };
  } else if (change <= -10) {
    return { 
      trend: 'declining', 
      percentage: Math.abs(change),
      insight: `You've declined ${Math.abs(change)}% over ${recent.length} weeks. Let's focus on recovery.`
    };
  } else {
    return { 
      trend: 'stable', 
      percentage: Math.abs(change),
      insight: 'Your performance has been consistent. Keep the momentum going!'
    };
  }
}

export function saveCoachingSession(session) {
  const sessions = loadCoachingSessions();
  sessions.unshift({
    ...session,
    id: `session_${Date.now()}`,
    savedAt: new Date().toISOString()
  });
  localStorage.setItem(COACHING_SESSIONS_KEY, JSON.stringify(sessions));
}

export function loadCoachingSessions() {
  const stored = localStorage.getItem(COACHING_SESSIONS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getThisWeekSession() {
  const sessions = loadCoachingSessions();
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  return sessions.find(s => new Date(s.date) >= startOfWeek);
}

export function getWeekCoachingStats(habits) {
  const today = new Date();
  let completed = 0;
  let total = 0;
  const dailyStats = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    let dayCompletions = 0;
    habits?.forEach(h => {
      if (h.completionLog?.[dateStr]?.completed) dayCompletions++;
    });
    
    completed += dayCompletions;
    total += habits?.length || 0;
    
    dailyStats.push({ date: dateStr, completions: dayCompletions, total: habits?.length || 0 });
  }
  
  return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0, dailyStats };
}

export function generateFallbackCoaching(habits, weeklyStats) {
  const rate = weeklyStats?.percentage || 0;
  const bestHabit = habits?.reduce((best, h) => {
    const weekRate = Object.values(h.completionLog || {}).filter(c => c.completed).length / 7 * 100;
    return weekRate > (best?.rate || 0) ? { name: h.name, rate: weekRate } : best;
  }, null);
  
  const strugglingHabits = habits?.filter(h => {
    const weekRate = Object.values(h.completionLog || {}).filter(c => c.completed).length / 7 * 100;
    return weekRate < 50;
  }) || [];
  
  let response = '';
  
  response += 'What you did well:\n';
  if (rate >= 70) {
    response += `• You maintained a ${rate}% completion rate this week - great consistency!\n`;
    if (bestHabit) response += `• ${bestHabit.name} was your strongest habit at ${Math.round(bestHabit.rate)}%\n`;
  } else {
    response += `• You completed ${weeklyStats?.completed || 0} habit sessions this week\n`;
  }
  
  response += '\nAreas to improve:\n';
  if (strugglingHabits.length > 0) {
    response += `• Focus on "${strugglingHabits[0].name}" - only ${Math.round(Object.values(strugglingHabits[0].completionLog || {}).filter(c => c.completed).length / 7 * 100)}% this week\n`;
  }
  if (rate < 50) {
    response += `• Your completion rate needs attention - try starting with just 2-3 habits\n`;
  }
  
  response += '\nYour plan for next week:\n';
  response += '• Complete at least one habit every day - aim for 50%+ overall\n';
  if (strugglingHabits.length > 0) {
    response += `• Focus on ${strugglingHabits[0].name} - try breaking it into smaller steps\n`;
  }
  response += '• Continue your best-performing habits to maintain momentum\n';
  
  response += '\nKey insight:\n';
  response += rate >= 70 
    ? 'Your consistency is your superpower! Keep this energy going into next week.'
    : 'Every journey begins with a single step. Focus on building one habit at a time.';
  
  return response;
}