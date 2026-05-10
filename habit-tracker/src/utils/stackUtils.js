import { v4 as uuidv4 } from 'uuid';

const STACKS_KEY = 'ht_habit_stacks';

export const PREDEFINED_STACK_TEMPLATES = [
  {
    name: 'Power Morning',
    icon: '🌅',
    type: 'morning',
    color: '#F59E0B',
    description: 'Start your day with energy',
    suggestedHabits: ['Wake up at 6 AM', 'Cold shower', 'Morning meditation', 'Healthy breakfast', 'Morning journaling']
  },
  {
    name: 'Wind Down',
    icon: '🌙',
    type: 'evening', 
    color: '#7C3AED',
    description: 'End your day peacefully',
    suggestedHabits: ['No screen before bed', 'Read before sleep', 'Gratitude journal', 'Sleep by 10 PM']
  },
  {
    name: 'Warrior Workout',
    icon: '💪',
    type: 'workout',
    color: '#EF4444',
    description: 'Complete fitness routine',
    suggestedHabits: ['30 min workout', 'Drink 3L water', 'Post-workout stretch', 'Protein intake']
  },
  {
    name: 'Deep Work',
    icon: '💻',
    type: 'work',
    color: '#0EA5E9',
    description: 'Maximum productivity session',
    suggestedHabits: ['No social media before noon', '2hr deep work', 'Complete MIT first', 'Plan tomorrow tonight']
  }
];

export function saveStacks(stacks) {
  localStorage.setItem(STACKS_KEY, JSON.stringify(stacks));
}

export function loadStacks() {
  const stored = localStorage.getItem(STACKS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function createStack(stackData) {
  return {
    id: uuidv4(),
    name: stackData.name,
    description: stackData.description || '',
    icon: stackData.icon || '📋',
    type: stackData.type || 'custom',
    color: stackData.color || '#6366F1',
    habitIds: stackData.habitIds || [],
    isActive: true,
    completionLog: {},
    currentStreak: 0,
    longestStreak: 0,
    createdAt: new Date().toISOString()
  };
}

export function calculateStackCompletion(stack, habits, date) {
  const dateStr = date.toISOString().split('T')[0];
  const stackHabits = habits.filter(h => stack.habitIds.includes(h.id));
  const completed = stackHabits.filter(h => h.completionLog?.[dateStr]?.completed).length;
  const total = stackHabits.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return { completed, total, percentage, isComplete: completed === total && total > 0 };
}

export function getStackStreak(stack, habits) {
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const result = calculateStackCompletion(stack, habits, date);
    
    if (result.isComplete) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  
  return streak;
}

export function updateStackStreaks(stacks, habits) {
  const today = new Date();
  
  return stacks.map(stack => {
    const todayResult = calculateStackCompletion(stack, habits, today);
    const currentStreak = getStackStreak(stack, habits);
    
    let longestStreak = stack.longestStreak || 0;
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }
    
    const completionLog = { ...stack.completionLog };
    completionLog[today.toISOString().split('T')[0]] = todayResult.isComplete;
    
    return {
      ...stack,
      currentStreak,
      longestStreak,
      completionLog
    };
  });
}

export function getTodayStackStatus(stacks, habits) {
  const today = new Date();
  
  return stacks.filter(s => s.isActive).map(stack => ({
    ...stack,
    todayCompletion: calculateStackCompletion(stack, habits, today),
    streak: getStackStreak(stack, habits)
  }));
}

export function matchHabitsToTemplate(template, existingHabits) {
  const matchedHabits = [];
  const existingNames = existingHabits.map(h => h.name.toLowerCase());
  
  for (const suggestedName of template.suggestedHabits) {
    const match = existingHabits.find(h => 
      h.name.toLowerCase() === suggestedName.toLowerCase() ||
      h.name.toLowerCase().includes(suggestedName.toLowerCase().split(' ')[0])
    );
    
    if (match) {
      matchedHabits.push(match.id);
    } else {
      matchedHabits.push(suggestedName);
    }
  }
  
  return matchedHabits;
}

export function completeStack(stackId, habits) {
  const stacks = loadStacks();
  const stack = stacks.find(s => s.id === stackId);
  
  if (!stack) return false;
  
  const today = new Date().toISOString().split('T')[0];
  const stackHabits = habits.filter(h => stack.habitIds.includes(h.id));
  const incompleteHabits = stackHabits.filter(h => !h.completionLog?.[today]?.completed);
  
  return incompleteHabits.map(h => h.id);
}

export function getStackStats(stacks) {
  const activeStacks = stacks.filter(s => s.isActive);
  const today = new Date().toISOString().split('T')[0];
  
  const activeToday = activeStacks.filter(s => s.completionLog?.[today]).length;
  const bestStreak = Math.max(...stacks.map(s => s.longestStreak || 0), 0);
  
  return {
    total: stacks.length,
    active: activeStacks.length,
    activeToday,
    bestStreak
  };
}