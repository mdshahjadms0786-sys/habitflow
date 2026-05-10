const CERT_STORAGE_KEY = 'ht_certifications';

export const CERTIFICATIONS = [
  {
    id: 'first_week',
    name: 'Week Warrior',
    description: 'Complete any habit for 7 consecutive days',
    requirement: { type: 'streak', days: 7 },
    badge: '🥉',
    color: '#CD7F32'
  },
  {
    id: 'habit_master_21',
    name: 'Habit Former',
    description: 'Maintain any habit for 21 days — a new habit is born!',
    requirement: { type: 'streak', days: 21 },
    badge: '🥈',
    color: '#C0C0C0'
  },
  {
    id: 'habit_master_66',
    name: 'Habit Master',
    description: 'Complete the 66-day challenge — your habit is now automatic!',
    requirement: { type: 'streak', days: 66 },
    badge: '🥇',
    color: '#FFD700'
  },
  {
    id: 'century',
    name: 'Century Champion',
    description: '100 days of consistent habit completion',
    requirement: { type: 'streak', days: 100 },
    badge: '💎',
    color: '#B9F2FF'
  },
  {
    id: 'perfect_week',
    name: 'Perfect Week',
    description: '100% completion for 7 consecutive days',
    requirement: { type: 'perfect_days', days: 7 },
    badge: '⭐',
    color: '#FFD700'
  },
  {
    id: 'consistency_king',
    name: 'Consistency King',
    description: '90% completion rate over 30 days',
    requirement: { type: 'rate', rate: 90, days: 30 },
    badge: '👑',
    color: '#FFD700'
  }
];

export function checkCertifications(habits) {
  if (!habits || habits.length === 0) return [];
  
  const earned = [];
  
  for (const cert of CERTIFICATIONS) {
    const { requirement } = cert;
    
    for (const habit of habits) {
      if (requirement.type === 'streak') {
        if (habit.currentStreak >= requirement.days) {
          earned.push({ ...cert, habitId: habit.id, habitName: habit.name });
          break;
        }
        if (habit.longestStreak >= requirement.days) {
          earned.push({ ...cert, habitId: habit.id, habitName: habit.name });
          break;
        }
      } else if (requirement.type === 'perfect_days') {
        const days = getPerfectStreakDays(habit.completionLog);
        if (days >= requirement.days) {
          earned.push({ ...cert, habitId: habit.id, habitName: habit.name });
          break;
        }
      } else if (requirement.type === 'rate') {
        const rate = getCompletionRate(habit, requirement.days);
        if (rate >= requirement.rate) {
          earned.push({ ...cert, habitId: habit.id, habitName: habit.name });
          break;
        }
      }
    }
  }
  
  return earned;
}

function getPerfectStreakDays(completionLog) {
  if (!completionLog) return 0;
  let maxPerfect = 0;
  let current = 0;
  const dates = Object.keys(completionLog).sort();
  
  for (const date of dates) {
    if (completionLog[date]?.completed) {
      current++;
      maxPerfect = Math.max(maxPerfect, current);
    } else {
      current = 0;
    }
  }
  return maxPerfect;
}

function getCompletionRate(habit, days) {
  if (!habit.completionLog) return 0;
  const today = new Date();
  let completed = 0;
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    if (habit.completionLog[dateStr]?.completed) {
      completed++;
    }
  }
  
  return (completed / days) * 100;
}

export function generateCertificate(certification, userName, habitName, date) {
  return {
    id: `${certification.id}_${Date.now()}`,
    certification,
    userName,
    habitName,
    date,
    earnedAt: new Date().toISOString()
  };
}

export function saveCertifications(certs) {
  localStorage.setItem(CERT_STORAGE_KEY, JSON.stringify(certs));
}

export function loadCertifications() {
  const stored = localStorage.getItem(CERT_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getCertificationProgress(habits) {
  const progress = [];
  
  for (const cert of CERTIFICATIONS) {
    const { requirement } = cert;
    let currentValue = 0;
    let targetValue = requirement.days;
    let bestHabit = null;
    
    for (const habit of habits) {
      let value = 0;
      if (requirement.type === 'streak') {
        value = Math.max(habit.currentStreak || 0, habit.longestStreak || 0);
      }
      
      if (value > currentValue) {
        currentValue = value;
        bestHabit = habit.name;
      }
    }
    
    progress.push({
      ...cert,
      current: currentValue,
      target: targetValue,
      percentage: Math.min((currentValue / targetValue) * 100, 100),
      bestHabit
    });
  }
  
  return progress;
}