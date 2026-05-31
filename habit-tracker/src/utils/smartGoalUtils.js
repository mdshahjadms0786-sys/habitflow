import { v4 as uuidv4 } from 'uuid';

const SMART_GOALS_KEY = 'ht_smart_goals';

export function loadSmartGoals() {
  const stored = localStorage.getItem(SMART_GOALS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveSmartGoals(goals) {
  localStorage.setItem(SMART_GOALS_KEY, JSON.stringify(goals));
}

export function createSmartGoal(goalData) {
  return {
    id: uuidv4(),
    title: goalData.title,
    description: goalData.description || '',
    category: goalData.category || 'growth',
    icon: goalData.icon || '🎯',
    targetDate: goalData.targetDate,
    isSmartGoal: goalData.isSmartGoal || false,
    smart: goalData.smart || {},
    milestones: goalData.milestones || [],
    linkedHabitIds: goalData.linkedHabitIds || [],
    status: 'active',
    progress: 0,
    createdAt: new Date().toISOString(),
    completedAt: null
  };
}

export function calculateGoalProgress(goal, habits) {
  let progress = 0;
  
  const milestoneProgress = goal.milestones.length > 0
    ? (goal.milestones.filter(m => m.isComplete).length / goal.milestones.length) * 50
    : 0;
  
  if (goal.linkedHabitIds.length > 0) {
    const linkedHabits = habits.filter(h => goal.linkedHabitIds.includes(h.id));
    const today = new Date();
    let completedThisWeek = 0;
    let totalPossible = linkedHabits.length * 7;
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      linkedHabits.forEach(h => {
        if (h.completionLog?.[dateStr]?.completed) completedThisWeek++;
      });
    }
    
    const habitProgress = totalPossible > 0 ? (completedThisWeek / totalPossible) * 50 : 0;
    progress = Math.round(milestoneProgress + habitProgress);
  } else {
    progress = Math.round(milestoneProgress);
  }
  
  return Math.min(100, Math.max(0, progress));
}

export function getGoalInsight(goal, habits) {
  const progress = calculateGoalProgress(goal, habits);
  const today = new Date();
  const targetDate = new Date(goal.targetDate);
  const daysRemaining = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
  
  if (progress === 100) {
    return "Goal completed! 🎉";
  }
  
  if (daysRemaining < 0) {
    const daysOverdue = Math.abs(daysRemaining);
    return `Overdue by ${daysOverdue} days - need to take action!`;
  }
  
  const expectedProgress = 100 - (daysRemaining / 30 * 100);
  const paceDiff = progress - expectedProgress;
  
  if (paceDiff > 15) {
    return `You're ahead of schedule! ${daysRemaining} days to go.`;
  } else if (paceDiff < -15) {
    return `At current pace, you'll need more time. Try increasing habit completion.`;
  } else {
    return `On track! ${daysRemaining} days remaining to reach ${100 - progress}% more.`;
  }
}

export function getActiveGoals() {
  return loadSmartGoals().filter(g => g.status === 'active');
}

export function getCompletedGoals() {
  return loadSmartGoals().filter(g => g.status === 'completed');
}

export function getGoalsByLifeArea(areaId) {
  return loadSmartGoals().filter(g => g.category === areaId);
}

export function updateGoalStatus(goalId, status) {
  const goals = loadSmartGoals();
  const goal = goals.find(g => g.id === goalId);
  
  if (goal) {
    goal.status = status;
    if (status === 'completed') {
      goal.completedAt = new Date().toISOString();
      goal.progress = 100;
    }
    saveSmartGoals(goals);
  }
  
  return goal;
}

export function addMilestone(goalId, milestone) {
  const goals = loadSmartGoals();
  const goal = goals.find(g => g.id === goalId);
  
  if (goal) {
    goal.milestones.push({
      id: uuidv4(),
      title: milestone.title,
      targetDate: milestone.targetDate,
      isComplete: false,
      completedAt: null
    });
    saveSmartGoals(goals);
  }
  
  return goal;
}

export function toggleMilestone(goalId, milestoneId) {
  const goals = loadSmartGoals();
  const goal = goals.find(g => g.id === goalId);
  
  if (goal) {
    const milestone = goal.milestones.find(m => m.id === milestoneId);
    if (milestone) {
      milestone.isComplete = !milestone.isComplete;
      milestone.completedAt = milestone.isComplete ? new Date().toISOString() : null;
      saveSmartGoals(goals);
    }
  }
  
  return goal;
}

export function getGoalStats() {
  const goals = loadSmartGoals();
  const active = goals.filter(g => g.status === 'active');
  const completed = goals.filter(g => g.status === 'completed');
  
  const thisYear = goals.filter(g => {
    const created = new Date(g.createdAt).getFullYear();
    return created === new Date().getFullYear();
  });
  
  const completionRate = thisYear.length > 0 
    ? Math.round((completed.filter(g => new Date(g.completedAt).getFullYear() === new Date().getFullYear()).length / thisYear.length) * 100)
    : 0;
  
  return {
    active: active.length,
    completed: completed.length,
    total: goals.length,
    completionRate
  };
}

export function getUpcomingDeadlines(days = 30) {
  const goals = getActiveGoals();
  const today = new Date();
  
  return goals
    .filter(g => {
      const target = new Date(g.targetDate);
      const daysUntil = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
      return daysUntil >= 0 && daysUntil <= days;
    })
    .sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));
}

export function getGoalsByCategory() {
  const goals = getActiveGoals();
  const byCategory = {};
  
  goals.forEach(g => {
    if (!byCategory[g.category]) byCategory[g.category] = [];
    byCategory[g.category].push(g);
  });
  
  return byCategory;
}