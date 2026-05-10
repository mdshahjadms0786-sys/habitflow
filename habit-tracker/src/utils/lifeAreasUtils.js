const LIFE_AREAS_KEY = 'ht_life_areas';
const ASSESSMENTS_KEY = 'ht_life_assessments';

export const LIFE_AREAS = [
  { 
    id: 'health', 
    name: 'Health & Body', 
    icon: '💪', 
    color: '#1D9E75',
    description: 'Physical fitness, nutrition, sleep',
    habitCategories: ['Health', 'Fitness'],
    keywords: ['health', 'fitness', 'exercise', 'workout', 'sleep', 'diet', 'nutrition', 'water', 'stretch', 'run', 'walk', 'gym']
  },
  { 
    id: 'wealth', 
    name: 'Wealth & Finance', 
    icon: '💰', 
    color: '#BA7517',
    description: 'Income, savings, investments',
    habitCategories: ['Personal'],
    keywords: ['money', 'save', 'invest', 'expense', 'finance', 'budget', 'income', 'financial']
  },
  { 
    id: 'career', 
    name: 'Career & Work', 
    icon: '🚀', 
    color: '#534AB7',
    description: 'Professional growth, skills, productivity',
    habitCategories: ['Work', 'Learning'],
    keywords: ['work', 'career', 'job', 'project', 'task', 'deadline', 'meeting', 'email', 'focus', 'deep work']
  },
  { 
    id: 'relationships', 
    name: 'Relationships', 
    icon: '❤️', 
    color: '#E24B4A',
    description: 'Family, friends, social connections',
    keywords: ['family', 'friend', 'social', 'call', 'connect', 'relationship', 'partner', 'parent', 'child']
  },
  { 
    id: 'growth', 
    name: 'Personal Growth', 
    icon: '🌱', 
    color: '#059669',
    description: 'Learning, skills, self-improvement',
    habitCategories: ['Learning', 'Personal'],
    keywords: ['learn', 'read', 'study', 'skill', 'course', 'book', 'journal', 'reflect', 'practice']
  },
  { 
    id: 'fun', 
    name: 'Fun & Recreation', 
    icon: '🎉', 
    color: '#EC4899',
    description: 'Hobbies, entertainment, joy',
    keywords: ['hobby', 'game', 'fun', 'creative', 'music', 'art', 'play', 'entertain', 'leisure']
  },
  { 
    id: 'spiritual', 
    name: 'Spiritual & Mindfulness', 
    icon: '🙏', 
    color: '#7C3AED',
    description: 'Meditation, prayer, inner peace',
    keywords: ['meditat', 'pray', 'spiritual', 'mindful', 'grateful', 'breath', 'yoga', 'chant', 'spiritual']
  },
  { 
    id: 'environment', 
    name: 'Environment & Home', 
    icon: '🏡', 
    color: '#10B981',
    description: 'Living space, nature, sustainability',
    keywords: ['clean', 'organiz', 'home', 'nature', 'environment', 'plant', 'garden', 'sustain', 'recycle']
  }
];

export function calculateAreaScore(areaId, habits, days = 30) {
  const area = LIFE_AREAS.find(a => a.id === areaId);
  if (!area) return 0;
  
  const matchingHabits = habits.filter(habit => {
    const categoryMatch = area.habitCategories.includes(habit.category);
    const keywordMatch = area.keywords.some(kw => 
      habit.name.toLowerCase().includes(kw) || 
      (habit.category && habit.category.toLowerCase().includes(kw))
    );
    return categoryMatch || keywordMatch;
  });
  
  if (matchingHabits.length === 0) return null;
  
  const today = new Date();
  let totalCompletions = 0;
  let totalPossible = matchingHabits.length * days;
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    matchingHabits.forEach(habit => {
      if (habit.completionLog?.[dateStr]?.completed) {
        totalCompletions++;
      }
    });
  }
  
  const difficultyWeights = { easy: 1, medium: 1.2, hard: 1.5 };
  let weightedScore = 0;
  let weightTotal = 0;
  
  matchingHabits.forEach(habit => {
    const weight = difficultyWeights[habit.difficulty] || 1;
    let habitCompletions = 0;
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      if (habit.completionLog?.[dateStr]?.completed) {
        habitCompletions++;
      }
    }
    
    weightedScore += (habitCompletions / days * 100) * weight;
    weightTotal += weight;
  });
  
  return weightTotal > 0 ? Math.round(weightedScore / weightTotal) : 0;
}

export function calculateAllAreaScores(habits) {
  const scores = {};
  
  LIFE_AREAS.forEach(area => {
    scores[area.id] = calculateAreaScore(area.id, habits);
  });
  
  return scores;
}

export function getWeakestArea(scores) {
  let weakest = null;
  let lowestScore = 101;
  
  Object.entries(scores).forEach(([areaId, score]) => {
    if (score !== null && score < lowestScore) {
      lowestScore = score;
      weakest = areaId;
    }
  });
  
  return weakest;
}

export function getStrongestArea(scores) {
  let strongest = null;
  let highestScore = -1;
  
  Object.entries(scores).forEach(([areaId, score]) => {
    if (score !== null && score > highestScore) {
      highestScore = score;
      strongest = areaId;
    }
  });
  
  return strongest;
}

export function getBalanceScore(scores) {
  const validScores = Object.values(scores).filter(s => s !== null);
  
  if (validScores.length === 0) return 0;
  
  const avg = validScores.reduce((a, b) => a + b, 0) / validScores.length;
  const variance = validScores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / validScores.length;
  const stdDev = Math.sqrt(variance);
  
  const maxStdDev = 50;
  const balance = Math.max(0, 100 - (stdDev / maxStdDev) * 100);
  
  return Math.round(balance);
}

export function getAreaHabits(areaId, habits) {
  const area = LIFE_AREAS.find(a => a.id === areaId);
  if (!area) return [];
  
  return habits.filter(habit => {
    const categoryMatch = area.habitCategories.includes(habit.category);
    const keywordMatch = area.keywords.some(kw => 
      habit.name.toLowerCase().includes(kw) ||
      (habit.category && habit.category.toLowerCase().includes(kw))
    );
    return categoryMatch || keywordMatch;
  });
}

export function getAreaInsights(scores, habits) {
  const insights = [];
  const sortedAreas = Object.entries(scores)
    .filter(([_, score]) => score !== null)
    .sort((a, b) => a[1] - b[1]);
  
  const strongest = getStrongestArea(scores);
  const weakest = getWeakestArea(scores);
  const balance = getBalanceScore(scores);
  
  if (strongest) {
    const area = LIFE_AREAS.find(a => a.id === strongest);
    insights.push(`Your ${area?.name} is your strongest area at ${scores[strongest]}%`);
  }
  
  if (weakest && scores[weakest] < 50) {
    const area = LIFE_AREAS.find(a => a.id === weakest);
    insights.push(`${area?.name} needs attention — only ${scores[weakest]}%`);
  }
  
  if (balance >= 70) {
    insights.push('Great balance! All areas above 50%');
  } else if (balance >= 50) {
    insights.push('Moderate balance - focus on weaker areas');
  } else {
    insights.push('Life balance needs work - prioritize lowest areas');
  }
  
  return insights;
}

export function getSuggestedHabitsForArea(areaId) {
  const suggestions = {
    health: [
      { name: 'Morning workout', category: 'Fitness', difficulty: 'medium', icon: '🏃' },
      { name: 'Drink 3L water', category: 'Health', difficulty: 'easy', icon: '💧' },
      { name: 'Sleep by 10 PM', category: 'Health', difficulty: 'hard', icon: '😴' }
    ],
    wealth: [
      { name: 'Track expenses', category: 'Personal', difficulty: 'easy', icon: '📊' },
      { name: 'Save 20% income', category: 'Personal', difficulty: 'hard', icon: '🏦' },
      { name: 'Review budget weekly', category: 'Personal', difficulty: 'medium', icon: '💰' }
    ],
    career: [
      { name: '2hr deep work', category: 'Work', difficulty: 'hard', icon: '💻' },
      { name: 'Plan tomorrow', category: 'Work', difficulty: 'easy', icon: '📝' },
      { name: 'Learn new skill', category: 'Learning', difficulty: 'medium', icon: '📚' }
    ],
    relationships: [
      { name: 'Call family', category: 'Personal', difficulty: 'easy', icon: '📞' },
      { name: 'Connect with friend', category: 'Personal', difficulty: 'easy', icon: '👋' },
      { name: 'Date night', category: 'Personal', difficulty: 'medium', icon: '❤️' }
    ],
    growth: [
      { name: 'Read 30 minutes', category: 'Learning', difficulty: 'easy', icon: '📖' },
      { name: 'Practice skill', category: 'Learning', difficulty: 'medium', icon: '🎯' },
      { name: 'Journal daily', category: 'Personal', difficulty: 'easy', icon: '📝' }
    ],
    fun: [
      { name: 'Play instrument', category: 'Personal', difficulty: 'medium', icon: '🎸' },
      { name: 'Creative hobby', category: 'Personal', difficulty: 'easy', icon: '🎨' },
      { name: 'Watch movie', category: 'Personal', difficulty: 'easy', icon: '🎬' }
    ],
    spiritual: [
      { name: 'Meditate 10 min', category: 'Health', difficulty: 'easy', icon: '🧘' },
      { name: 'Gratitude journal', category: 'Personal', difficulty: 'easy', icon: '🙏' },
      { name: 'Deep breathing', category: 'Health', difficulty: 'easy', icon: '💨' }
    ],
    environment: [
      { name: 'Clean workspace', category: 'Personal', difficulty: 'easy', icon: '🧹' },
      { name: 'Organize home', category: 'Personal', difficulty: 'medium', icon: '🏠' },
      { name: 'Water plants', category: 'Personal', difficulty: 'easy', icon: '🌱' }
    ]
  };
  
  return suggestions[areaId] || [];
}

export function saveWeeklyAssessment(assessment) {
  const assessments = loadAssessments();
  assessments.unshift({
    ...assessment,
    id: `assessment_${Date.now()}`,
    date: new Date().toISOString()
  });
  localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(assessments));
}

export function loadAssessments() {
  const stored = localStorage.getItem(ASSESSMENTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getLatestAssessment() {
  const assessments = loadAssessments();
  return assessments[0] || null;
}

export function getPreviousWeekAssessment() {
  const assessments = loadAssessments();
  const now = new Date();
  const lastWeekStart = new Date(now);
  lastWeekStart.setDate(now.getDate() - 7);
  
  return assessments.find(a => new Date(a.date) >= lastWeekStart);
}