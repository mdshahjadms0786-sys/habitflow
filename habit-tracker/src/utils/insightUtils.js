import { getTodayISO } from './dateUtils';

export const generateInsights = (habits = [], moodLog = {}) => {
  const insights = [];
  
  if (!habits || habits.length === 0) return insights;
  
  // Check if enough data exists
  const completionDates = new Set();
  Object.values(habits).forEach(habit => {
    if (habit.completionLog) {
      Object.keys(habit.completionLog).forEach(date => completionDates.add(date));
    }
  });
  
  const daysWithData = completionDates.size;
  if (daysWithData < 3) {
    insights.push({
      type: 'encourage',
      title: 'Keep Going! 🌱',
      message: 'Insights unlock after 3 days of tracking habits.',
      icon: '🌱',
      color: '#10B981',
      priority: 100
    });
    return insights;
  }

  // Helper functions
  const getLast7DaysCompletions = (habit) => {
    const today = new Date();
    const counts = { total: 0, completed: 0 };
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      if (habit.completionLog?.[dateStr]) {
        counts.completed++;
      }
      counts.total++;
    }
    return counts.completed / counts.total * 100;
  };

  const getLast30DaysCompletions = (habit) => {
    const today = new Date();
    let completed = 0;
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      if (habit.completionLog?.[dateStr]) {
        completed++;
      }
    }
    return completed;
  };

  // Best streak insight
  const habitWithBestStreak = habits.reduce((best, habit) => {
    const streak = habit.currentStreak || 0;
    const bestStreak = best?.currentStreak || 0;
    return streak > bestStreak ? habit : best;
  }, null);
  
  if (habitWithBestStreak && habitWithBestStreak.currentStreak > 0) {
    insights.push({
      type: 'strongest',
      title: 'Strongest Habit',
      message: `${habitWithBestStreak.name} has a ${habitWithBestStreak.currentStreak} day streak! 🔥`,
      icon: '🔥',
      color: '#F59E0B',
      priority: 80
    });
  }

  // Total completions this month
  const thisMonthCompletions = habits.reduce((total, habit) => {
    return total + getLast30DaysCompletions(habit);
  }, 0);
  
  if (thisMonth Completions > 0) {
    insights.push({
      type: 'total',
      title: 'This Month',
      message: `You've completed ${thisMonth Completions} habits this month! 📊`,
      icon: '📊',
      color: '#6366F1',
      priority: 70
    });
  }

  // Category breakdown
  const categoryStats = {};
  habits.forEach(habit => {
    if (!categoryStats[habit.category]) {
      categoryStats[habit.category] = { total: 0, completed: 0 };
    }
    categoryStats[habit.category].total++;
    const weekPct = getLast7DaysCompletions(habit);
    if (weekPct > 0) {
      categoryStats[habit.category].completed++;
    }
  });

  const topCategory = Object.entries(categoryStats).sort((a, b) => b[1].completed - a[1].completed)[0];
  if (topCategory && topCategory[1].completed > 0) {
    insights.push({
      type: 'category',
      title: 'Category Champion',
      message: `${topCategory[0]} is your strongest category! 🏆`,
      icon: '🏆',
      color: '#8B5CF6',
      priority: 60
    });
  }

  // Consistency rate
  const completedDays = Array.from(completionDates).filter(date => {
    const d = new Date(date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return d >= thirtyDaysAgo;
  }).length;
  
  const consistencyRate = Math.round((completedDays / 30) * 100);
  if (consistencyRate > 0) {
    let label = 'room for improvement';
    if (consistencyRate >= 80) label = 'amazing!';
    else if (consistencyRate >= 60) label = 'pretty good!';
    else if (consistencyRate >= 40) label = 'not bad!';
    
    insights.push({
      type: 'consistency',
      title: 'Consistency Rate',
      message: `You've been consistent ${consistencyRate}% of the last 30 days — ${label} 📈`,
      icon: '📈',
      color: '#10B981',
      priority: 50
    });
  }

  // Needs attention (lowest performing habit)
  const lowestHabit = habits.reduce((low, habit) => {
    const lowPct = low ? getLast7DaysCompletions(low) : 100;
    const habPct = getLast7DaysCompletions(habit);
    return habPct < lowPct ? habit : low;
  }, null);
  
  if (lowestHabit && getLast7DaysCompletions(lowestHabit) < 50) {
    insights.push({
      type: 'attention',
      title: 'Needs Attention',
      message: `${lowestHabit.name} only ${Math.round(getLast7DaysCompletions(lowestHabit))}% this week — try to improve! ⚠️`,
      icon: '⚠️',
      color: '#EF4444',
      priority: 90
    });
  }

  // Mood correlation (if mood data exists)
  if (moodLog && Object.keys(moodLog).length > 5) {
    const goodMoodDays = Object.entries(moodLog)
      .filter(([_, mood]) => mood?.score >= 4)
      .map(([date]) => date);
    
    if (goodMoodDays.length > 0) {
      // Find habit most completed on good mood days
      const habitCorrelations = {};
      goodMoodDays.forEach(date => {
        habits.forEach(habit => {
          if (habit.completionLog?.[date]) {
            habitCorrelations[habit.name] = (habitCorrelations[habit.name] || 0) + 1;
          }
        });
      });
      
      const bestCorr = Object.entries(habitCorrelations).sort((a, b) => b[1] - a[1])[0];
      if (bestCorr && bestCorr[1] >= 2) {
        insights.push({
          type: 'mood',
          title: 'Mood Booster',
          message: `On good mood days, you complete ${bestCorr[0]} most! 😊`,
          icon: '😊',
          color: '#EC4899',
          priority: 40
        });
      }
    }
  }

  // Sort and limit
  insights.sort((a, b) => a.priority - b.priority);
  return insights.slice(0, 5);
};