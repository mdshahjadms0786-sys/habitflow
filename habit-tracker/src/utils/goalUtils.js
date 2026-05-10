const GOALS_KEY = 'ht_goals';

export const loadGoals = () => {
  try {
    return JSON.parse(localStorage.getItem(GOALS_KEY)) || {};
  } catch {
    return { daily: null, weekly: null };
  }
};

export const saveGoals = (goals) => {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
};

export const setDailyGoal = (targetHabits) => {
  const goals = loadGoals();
  goals.daily = { targetHabits, startDate: new Date().toISOString().split('T')[0] };
  saveGoals(goals);
  return goals;
};

export const setWeeklyGoal = (targetHabits) => {
  const goals = loadGoals();
  goals.weekly = { targetHabits, startDate: new Date().toISOString().split('T')[0] };
  saveGoals(goals);
  return goals;
};

export const getDailyGoal = () => {
  const goals = loadGoals();
  return goals.daily;
};

export const getWeeklyGoal = () => {
  const goals = loadGoals();
  return goals.weekly;
};

export const checkDailyGoalProgress = (completedCount) => {
  const goal = getDailyGoal();
  if (!goal) return null;
  return {
    completed: completedCount,
    target: goal.targetHabits,
    percentage: Math.round((completedCount / goal.targetHabits) * 100),
    achieved: completedCount >= goal.targetHabits,
  };
};

export const checkWeeklyGoalProgress = (weekCompletedCount) => {
  const goal = getWeeklyGoal();
  if (!goal) return null;
  return {
    completed: weekCompletedCount,
    target: goal.targetHabits,
    percentage: Math.round((weekCompletedCount / goal.targetHabits) * 100),
    achieved: weekCompletedCount >= goal.targetHabits,
  };
};

export const clearGoals = () => {
  saveGoals({ daily: null, weekly: null });
};

export default { setDailyGoal, setWeeklyGoal, getDailyGoal, getWeeklyGoal, checkDailyGoalProgress, checkWeeklyGoalProgress, clearGoals };