const CHALLENGE_KEY = 'ht_monthly_challenges';

export const CHALLENGE_TEMPLATES = [
  { month: 1, name: 'New Year Warrior', description: 'Complete 20 habits in January', target: 20, type: 'total_completions', reward: 500, badge: '🏆' },
  { month: 2, name: 'Love Yourself', description: 'Complete 15 self-care habits', target: 15, type: 'category_completions', category: 'Health', reward: 400, badge: '❤️' },
  { month: 3, name: 'Spring Starter', description: 'Build a 7-day streak', target: 7, type: 'streak', reward: 350, badge: '🌸' },
  { month: 4, name: 'April Achiever', description: 'Complete habits 20 different days', target: 20, type: 'active_days', reward: 450, badge: '🌼' },
  { month: 5, name: 'May Champion', description: 'Complete 25 total habits', target: 25, type: 'total_completions', reward: 500, badge: '🏅' },
  { month: 6, name: 'Summer Warrior', description: 'Achieve 80% completion rate', target: 80, type: 'completion_rate', reward: 600, badge: '☀️' },
  { month: 7, name: 'Monsoon Master', description: 'Complete 5 different habit categories', target: 5, type: 'categories_used', reward: 400, badge: '🌧️' },
  { month: 8, name: 'August Grinder', description: 'Build a 14-day streak', target: 14, type: 'streak', reward: 700, badge: '💪' },
  { month: 9, name: 'September Scholar', description: 'Complete 20 Learning habits', target: 20, type: 'category_completions', category: 'Learning', reward: 450, badge: '📚' },
  { month: 10, name: 'October Optimizer', description: 'Complete all habits on 10 days', target: 10, type: 'perfect_days', reward: 600, badge: '⭐' },
  { month: 11, name: 'November Ninja', description: 'Complete 30 total habits', target: 30, type: 'total_completions', reward: 550, badge: '🥷' },
  { month: 12, name: 'December Champion', description: 'End year with 10-day streak', target: 10, type: 'streak', reward: 1000, badge: '🎄' }
];

const getMonthName = (month) => {
  const names = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return names[month];
};

export const getCurrentChallenge = () => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  
  const template = CHALLENGE_TEMPLATES.find(c => c.month === month);
  if (!template) return null;
  
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;
  
  return {
    ...template,
    startDate,
    endDate,
    monthName: getMonthName(month),
  };
};

export const calculateChallengeProgress = (challenge, habits) => {
  if (!challenge || !habits) return { current: 0, target: challenge.target, percentage: 0 };
  
  const now = new Date();
  const year = now.getFullYear();
  const month = challenge.month;
  
  // Get completions for this month
  const monthCompletions = {};
  
  habits.forEach(habit => {
    if (!habit.completionLog) return;
    Object.keys(habit.completionLog).forEach(date => {
      const d = new Date(date);
      if (d.getMonth() + 1 === month && d.getFullYear() === year) {
        monthCompletions[date] = (monthCompletions[date] || 0) + 1;
      }
    });
  });
  
  let current = 0;
  
  switch (challenge.type) {
    case 'total_completions':
      current = Object.keys(monthCompletions).length;
      break;
      
    case 'streak':
      current = Math.max(...habits.map(h => h.currentStreak || 0), 0);
      break;
      
    case 'active_days':
      current = Object.keys(monthCompletions).length;
      break;
      
    case 'completion_rate':
      const totalDays = Object.keys(monthCompletions).length;
      const daysInMonth = new Date(year, month, 0).getDate();
      current = Math.round((totalDays / daysInMonth) * 100);
      break;
      
    case 'category_completions':
      if (challenge.category) {
        current = habits
          .filter(h => h.category === challenge.category)
          .reduce((sum, h) => sum + (h.completionLog ? Object.keys(h.completionLog).filter(d => {
            const date = new Date(d);
            return date.getMonth() + 1 === month && date.getFullYear() === year;
          }).length : 0), 0);
      }
      break;
      
    case 'perfect_days':
      const activeHabits = habits.filter(h => h.isActive !== false).length;
      current = Object.values(monthCompletions).filter(count => count >= activeHabits).length;
      break;
      
    case 'categories_used':
      const categories = new Set();
      habits.forEach(habit => {
        if (habit.completionLog && habit.category) {
          const hasCompletion = Object.keys(habit.completionLog).some(d => {
            const date = new Date(d);
            return date.getMonth() + 1 === month && date.getFullYear() === year;
          });
          if (hasCompletion) categories.add(habit.category);
        }
      });
      current = categories.size;
      break;
      
    default:
      current = 0;
  }
  
  const percentage = Math.min(100, Math.round((current / challenge.target) * 100));
  
  return { current, target: challenge.target, percentage };
};

export const isChallengeCompleted = (challenge) => {
  if (!challenge) return false;
  try {
    const data = JSON.parse(localStorage.getItem(CHALLENGE_KEY) || '{}');
    const key = `${challenge.month}-${new Date().getFullYear()}`;
    return !!data[key]?.completedAt;
  } catch {
    return false;
  }
};

export const markChallengeCompleted = (challenge) => {
  if (!challenge) return;
  try {
    const data = JSON.parse(localStorage.getItem(CHALLENGE_KEY) || '{}');
    const key = `${challenge.month}-${new Date().getFullYear()}`;
    data[key] = {
      completedAt: new Date().toISOString(),
      badge: challenge.badge,
      reward: challenge.reward,
    };
    localStorage.setItem(CHALLENGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save challenge:', e);
  }
};

export const getPastChallenges = () => {
  try {
    const data = JSON.parse(localStorage.getItem(CHALLENGE_KEY) || '{}');
    return data;
  } catch {
    return {};
  }
};

export const getDaysLeftInMonth = () => {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return lastDay - now.getDate();
};