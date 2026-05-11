const STORAGE_KEY = 'ht_plan';
const TRIAL_KEY = 'ht_trial_active';
const TRIAL_DAYS = 14;

export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    tagline: 'Start Your Journey',
    price: 0,
    badge: '🆓',
    color: '#888780',
    gradient: 'linear-gradient(135deg, #888780, #a8a8a0)',
    maxHabits: 3,
    maxCompletedPerDay: 5,
    maxTemplatePacks: 5,
    maxHabitsPerStack: 3,
    historyDays: 7,
    maxJournalEntries: 0,
    maxFocusSessions: 0,
    maxStreakFreeze: 1,
    maxBadges: 10,
    maxChatMessages: 0,
    features: {
      basicTracking: true,
      unlimitedHabits: false,
      streaks: true,
      difficultyLevels: true,
      completionSounds: false,
      basicAnalytics: true,
      weeklyHeatmap: true,
      streakCharts: true,
      categoryPieChart: false,
      completionBarChart: false,
      monthlyHeatmap: false,
      timeOfDayAnalysis: false,
      weekdayAnalysis: false,
      habitComparison: false,
      personalRecords: false,
      habitDNA: false,
      deepAnalysis: false,
      aiCoach: false,
      aiCoachPro: false,
      coachingSessions: false,
      customAIPersonality: false,
      focusMode: false,
      focusHistory: false,
      focusStreaks: false,
      focusWeekChart: false,
      focusHabitBreakdown: false,
      focusPersonalRecords: false,
      breathingExercises: false,
      focusSounds: false,
      journal: false,
      moodTracking: false,
      moodCalendar: false,
      moodInsights: false,
      moodHabitCorrelation: false,
      sentimentAnalysis: false,
      dreamDiary: false,
      visionBoard: false,
      goals: false,
      lifeAreas: false,
      lifeScore: false,
      habitStacks: false,
      habitTemplates: false,
      experiments: false,
      leagues: false,
      betting: false,
      challenges: false,
      certifications: false,
      quests: false,
      hallOfFame: false,
      schedule: false,
      timeline: false,
      newspaper: false,
      burnoutTracker: false,
      darkMode: true,
      themeCustomization: false,
      profile: true,
      onboarding: true,
      widgets: false,
      exportData: false,
      importData: false,
      apiAccess: false,
      teamSpaces: false,
      pushNotifications: false,
      weatherSync: false,
      prioritySupport: false,
      allTemplates: false,
      customTemplates: false,
      aiHabitArchitect: false,
      lifeOSDashboard: false,
      predictiveAI: false,
      smartIntervention: false,
      monthlyBehaviorReport: false,
      habitROIDashboard: false,
      habitTwin: false,
      weeklyEmail: false,
      dnaEvolution: false,
      whiteGloveOnboarding: false,
      elitePacks: false,
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    tagline: 'Level Up Your Habits',
    price: 199,
    badge: '💎',
    color: '#534AB7',
    gradient: 'linear-gradient(135deg, #534AB7, #8b5cf6)',
    maxHabits: 50,
    maxCompletedPerDay: 100,
    maxTemplatePacks: 35,
    maxHabitsPerStack: 10,
    historyDays: 365,
    maxJournalEntries: 365,
    maxFocusSessions: 999,
    maxStreakFreeze: 10,
    maxBadges: 999,
    maxChatMessages: 9999,
    features: {
      basicTracking: true,
      unlimitedHabits: true,
      streaks: true,
      difficultyLevels: true,
      completionSounds: true,
      basicAnalytics: true,
      weeklyHeatmap: true,
      streakCharts: true,
      categoryPieChart: true,
      completionBarChart: true,
      monthlyHeatmap: true,
      timeOfDayAnalysis: true,
      weekdayAnalysis: true,
      habitComparison: true,
      personalRecords: true,
      habitDNA: true,
      deepAnalysis: false,
      aiCoach: true,
      aiCoachPro: false,
      coachingSessions: false,
      customAIPersonality: false,
      focusMode: true,
      focusHistory: true,
      focusStreaks: true,
      focusWeekChart: true,
      focusHabitBreakdown: true,
      focusPersonalRecords: true,
      breathingExercises: true,
      focusSounds: true,
      journal: true,
      moodTracking: true,
      moodCalendar: true,
      moodInsights: true,
      moodHabitCorrelation: true,
      sentimentAnalysis: true,
      dreamDiary: false,
      visionBoard: true,
      goals: true,
      lifeAreas: true,
      lifeScore: true,
      habitStacks: true,
      habitTemplates: true,
      experiments: true,
      leagues: true,
      betting: true,
      challenges: true,
      certifications: true,
      quests: true,
      hallOfFame: true,
      schedule: true,
      timeline: true,
      newspaper: true,
      burnoutTracker: true,
      darkMode: true,
      themeCustomization: true,
      profile: true,
      onboarding: true,
      widgets: true,
      exportData: true,
      importData: true,
      apiAccess: false,
      teamSpaces: false,
      pushNotifications: true,
      weatherSync: true,
      prioritySupport: false,
      allTemplates: true,
      customTemplates: true,
      aiHabitArchitect: false,
      lifeOSDashboard: false,
      predictiveAI: false,
      smartIntervention: false,
      monthlyBehaviorReport: false,
      habitROIDashboard: false,
      habitTwin: false,
      weeklyEmail: false,
      dnaEvolution: false,
      whiteGloveOnboarding: false,
      elitePacks: false,
    }
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    tagline: 'Ultimate Habit Master',
    price: 499,
    badge: '👑',
    color: '#BA7517',
    gradient: 'linear-gradient(135deg, #BA7517, #f59e0b)',
    maxHabits: 999,
    maxCompletedPerDay: 9999,
    maxTemplatePacks: 45,
    maxHabitsPerStack: 999,
    historyDays: 9999,
    maxJournalEntries: 9999,
    maxFocusSessions: 9999,
    maxStreakFreeze: 999,
    maxBadges: 9999,
    maxChatMessages: 99999,
    features: {
      basicTracking: true,
      unlimitedHabits: true,
      streaks: true,
      difficultyLevels: true,
      completionSounds: true,
      basicAnalytics: true,
      weeklyHeatmap: true,
      streakCharts: true,
      categoryPieChart: true,
      completionBarChart: true,
      monthlyHeatmap: true,
      timeOfDayAnalysis: true,
      weekdayAnalysis: true,
      habitComparison: true,
      personalRecords: true,
      habitDNA: true,
      deepAnalysis: true,
      aiCoach: true,
      aiCoachPro: true,
      coachingSessions: true,
      customAIPersonality: true,
      focusMode: true,
      focusHistory: true,
      focusStreaks: true,
      focusWeekChart: true,
      focusHabitBreakdown: true,
      focusPersonalRecords: true,
      breathingExercises: true,
      focusSounds: true,
      journal: true,
      moodTracking: true,
      moodCalendar: true,
      moodInsights: true,
      moodHabitCorrelation: true,
      sentimentAnalysis: true,
      dreamDiary: true,
      visionBoard: true,
      goals: true,
      lifeAreas: true,
      lifeScore: true,
      habitStacks: true,
      habitTemplates: true,
      experiments: true,
      leagues: true,
      betting: true,
      challenges: true,
      certifications: true,
      quests: true,
      hallOfFame: true,
      schedule: true,
      timeline: true,
      newspaper: true,
      burnoutTracker: true,
      darkMode: true,
      themeCustomization: true,
      profile: true,
      onboarding: true,
      widgets: true,
      exportData: true,
      importData: true,
      apiAccess: true,
      teamSpaces: true,
      pushNotifications: true,
      weatherSync: true,
      prioritySupport: true,
      allTemplates: true,
      customTemplates: true,
      aiHabitArchitect: true,
      lifeOSDashboard: true,
      predictiveAI: true,
      smartIntervention: true,
      monthlyBehaviorReport: true,
      habitROIDashboard: true,
      habitTwin: true,
      weeklyEmail: true,
      dnaEvolution: true,
      whiteGloveOnboarding: true,
      elitePacks: true,
    }
  }
};

export const ELITE_FEATURES = {
  aiHabitArchitect: {
    name: 'AI Habit Architect',
    icon: '🏗️',
    description: 'Get a personalized 90-day transformation plan from AI',
    page: '/ai-architect',
  },
  lifeOSDashboard: {
    name: 'Life OS Dashboard',
    icon: '🖥️',
    description: 'Single screen overview of your entire life',
    page: '/life-os',
  },
  lifeScore: {
    name: 'Life Score Tracker',
    icon: '🎯',
    description: 'Track and improve your overall life balance score',
    page: '/life-score',
  },
  lifeAreas: {
    name: 'Life Areas Wheel',
    icon: '🗺️',
    description: 'Balance 8 key areas of your life for fulfillment',
    page: '/life-areas',
  },
  predictiveAI: {
    name: 'Predictive AI Engine',
    icon: '🔮',
    description: 'AI predicts your daily success rate every morning',
    page: '/predictive',
  },
  smartIntervention: {
    name: 'Smart Intervention System',
    icon: '🚨',
    description: 'AI proactively warns and adjusts your schedule',
    page: '/intervention',
  },
  monthlyBehaviorReport: {
    name: 'Monthly Behavior Report',
    icon: '🧬',
    description: 'Downloadable PDF with psychological habit profile',
    page: '/behavior-report',
  },
  habitROIDashboard: {
    name: 'Habit ROI Dashboard',
    icon: '💰',
    description: 'Calculate financial impact of your habits',
    page: '/habit-roi',
  },
  habitTwin: {
    name: 'Habit Twin Benchmarking',
    icon: '👥',
    description: 'Compare with similar users anonymously',
    page: '/habit-twin',
  },
  weeklyEmail: {
    name: 'Executive Weekly Email',
    icon: '📧',
    description: 'Beautiful weekly summary delivered to your inbox',
    page: '/weekly-email',
  },
  dnaEvolution: {
    name: 'DNA Evolution Timeline',
    icon: '🧬',
    description: 'Track your monthly personality evolution',
    page: '/dna-evolution',
  },
  whiteGloveOnboarding: {
    name: 'White Glove AI Onboarding',
    icon: '🎯',
    description: 'Special AI-powered setup for elite users',
    page: '/white-glove',
  },
};

export const ELITE_HABIT_PACKS = [
  {
    id: 41,
    name: 'CEO Morning Protocol',
    icon: '👔',
    difficulty: 'extreme',
    habits: [
      { name: '5 AM Wake Up', difficulty: 'extreme', time: 'early' },
      { name: 'Cold Plunge 3 Min', difficulty: 'extreme', time: 'morning' },
      { name: '90 Min Deep Work', difficulty: 'extreme', time: 'morning' },
      { name: 'No Meetings Before 12', difficulty: 'hard', time: 'all' },
      { name: 'Evening Metrics Review', difficulty: 'medium', time: 'evening' },
    ],
  },
  {
    id: 42,
    name: 'Navy SEAL Discipline',
    icon: '🎖️',
    difficulty: 'extreme',
    habits: [
      { name: '4 AM Wake Up', difficulty: 'extreme', time: 'early' },
      { name: '2 Hour Workout', difficulty: 'extreme', time: 'morning' },
      { name: 'Cold Shower Extreme', difficulty: 'extreme', time: 'morning' },
      { name: 'Mental Toughness Drill', difficulty: 'hard', time: 'afternoon' },
      { name: 'Evening Debrief Journal', difficulty: 'medium', time: 'evening' },
    ],
  },
  {
    id: 43,
    name: 'Billionaire Mindset',
    icon: '💰',
    difficulty: 'hard',
    habits: [
      { name: 'Read 2 Hours Daily', difficulty: 'hard', time: 'morning' },
      { name: 'Network One Person', difficulty: 'medium', time: 'all' },
      { name: 'Review Investments', difficulty: 'easy', time: 'evening' },
      { name: 'Learn One New Skill', difficulty: 'hard', time: 'evening' },
      { name: 'Visualization Practice', difficulty: 'easy', time: 'evening' },
    ],
  },
  {
    id: 44,
    name: 'Longevity Protocol',
    icon: '🧬',
    difficulty: 'hard',
    habits: [
      { name: 'Zone 2 Cardio 45min', difficulty: 'hard', time: 'morning' },
      { name: 'Strength Training', difficulty: 'hard', time: 'morning' },
      { name: '8 Hour Sleep Strict', difficulty: 'extreme', time: 'night' },
      { name: 'Supplement Protocol', difficulty: 'easy', time: 'morning' },
      { name: 'Stress Measurement', difficulty: 'easy', time: 'evening' },
    ],
  },
  {
    id: 45,
    name: 'High Performance',
    icon: '⚡',
    difficulty: 'extreme',
    habits: [
      { name: 'Morning + Evening Workout', difficulty: 'extreme', time: 'morning' },
      { name: 'Precise Nutrition Tracking', difficulty: 'hard', time: 'all' },
      { name: 'Recovery Protocol', difficulty: 'medium', time: 'afternoon' },
      { name: 'Mental Performance Drill', difficulty: 'hard', time: 'evening' },
      { name: 'Competition Visualization', difficulty: 'medium', time: 'evening' },
    ],
  },
];

export function getCurrentPlan() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored || 'free';
}

export function setPlan(planId) {
  localStorage.setItem(STORAGE_KEY, planId);
  window.dispatchEvent(new CustomEvent('planChanged', { detail: planId }));
}

export function hasFeature(featureName) {
  const planId = getCurrentPlan();
  const planData = PLANS[planId];
  if (!planData) return false;
  return !!planData.features[featureName];
}

export function getPlanLimit(limitName) {
  const planId = getCurrentPlan();
  const planData = PLANS[planId];
  if (!planData) return PLANS.free[limitName] || 0;
  return planData[limitName] || PLANS.free[limitName] || 0;
}

export function getMaxHabits() {
  return getPlanLimit('maxHabits');
}

export function getMaxCompletedPerDay() {
  return getPlanLimit('maxCompletedPerDay');
}

export function getMaxTemplatePacks() {
  return getPlanLimit('maxTemplatePacks');
}

export function getMaxHabitsPerStack() {
  return getPlanLimit('maxHabitsPerStack');
}

export function getHistoryDays() {
  return getPlanLimit('historyDays');
}

export function getMaxJournalEntries() {
  return getPlanLimit('maxJournalEntries');
}

export function getMaxFocusSessions() {
  return getPlanLimit('maxFocusSessions');
}

export function getMaxStreakFreeze() {
  return getPlanLimit('maxStreakFreeze');
}

export function getMaxBadges() {
  return getPlanLimit('maxBadges');
}

export function getMaxChatMessages() {
  return getPlanLimit('maxChatMessages');
}

export function canUseFeature(featureName) {
  if (hasFeature(featureName)) return true;

  const limitMap = {
    aiCoach: 'maxChatMessages',
    journal: 'maxJournalEntries',
    focusMode: 'maxFocusSessions',
  };

  const limit = limitMap[featureName];
  if (limit) {
    const currentUsage = getCurrentUsage(limit);
    const limitValue = getPlanLimit(limit);
    return currentUsage < limitValue;
  }

  return false;
}

export function getCurrentUsage(limitName) {
  const key = `ht_usage_${limitName}`;
  const stored = localStorage.getItem(key);
  return parseInt(stored) || 0;
}

export function incrementUsage(limitName, amount = 1) {
  const key = `ht_usage_${limitName}`;
  const current = getCurrentUsage(limitName);
  localStorage.setItem(key, current + amount);
}

export function isPro() {
  const planId = getCurrentPlan();
  return planId === 'pro' || planId === 'elite';
}

export function isElite() {
  return getCurrentPlan() === 'elite';
}

export function isFree() {
  return getCurrentPlan() === 'free';
}

export function getPlanBadge() {
  const planId = getCurrentPlan();
  return PLANS[planId]?.badge || '🆓';
}

export function getPlanColor() {
  const planId = getCurrentPlan();
  return PLANS[planId]?.color || '#888780';
}

export function getPlanGradient() {
  const planId = getCurrentPlan();
  return PLANS[planId]?.gradient || 'linear-gradient(135deg, #888780, #a8a8a0)';
}

export function getPlanName() {
  const planId = getCurrentPlan();
  return PLANS[planId]?.name || 'Free';
}

export function getPlanTagline() {
  const planId = getCurrentPlan();
  return PLANS[planId]?.tagline || 'Start Your Journey';
}

export function isTrialActive() {
  const trialStart = localStorage.getItem(TRIAL_KEY);
  if (!trialStart) return false;

  const daysSinceTrial = Math.floor(
    (Date.now() - new Date(trialStart).getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysSinceTrial < TRIAL_DAYS;
}

export function startTrial() {
  localStorage.setItem(TRIAL_KEY, new Date().toISOString());
  setPlan('pro');
}

export function getTrialDaysRemaining() {
  const trialStart = localStorage.getItem(TRIAL_KEY);
  if (!trialStart) return 0;

  const daysSinceTrial = Math.floor(
    (Date.now() - new Date(trialStart).getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.max(0, TRIAL_DAYS - daysSinceTrial);
}

export function cancelTrial() {
  localStorage.removeItem(TRIAL_KEY);
  setPlan('free');
}

export function getUpgradeMessage(featureName) {
  const featureMessages = {
    basicTracking: 'Upgrade to Pro for unlimited habits!',
    unlimitedHabits: 'Upgrade to Pro for unlimited habits!',
    streaks: 'Keep your streaks safe with Pro!',
    difficultyLevels: 'Add challenge with difficulty levels!',
    completionSounds: 'Get satisfying completion sounds!',

    categoryPieChart: 'See category breakdown with Pro!',
    completionBarChart: 'Track completion with Pro charts!',
    monthlyHeatmap: 'Full year heatmap in Pro!',
    timeOfDayAnalysis: 'Discover your peak hours!',
    weekdayAnalysis: 'Understand your weekly patterns!',
    habitComparison: 'Compare habits side by side!',
    personalRecords: 'Track your personal records!',
    habitDNA: 'Get your Habit DNA analysis!',
    deepAnalysis: 'Get deep behavior insights!',

    aiCoach: 'Chat with AI Coach in Pro!',
    aiCoachPro: 'Upgrade to Elite for AI Life Coach!',
    coachingSessions: 'Get weekly coaching sessions in Elite!',
    customAIPersonality: 'Customize your AI personality in Elite!',

    focusMode: 'Focus Mode available in Pro!',
    focusHistory: 'Track your focus history!',
    focusStreaks: 'Build focus streaks!',
    focusWeekChart: 'See weekly focus patterns!',
    focusHabitBreakdown: 'Break down focus by habit!',
    focusPersonalRecords: 'Track focus personal records!',
    breathingExercises: 'Use breathing exercises!',
    focusSounds: 'Focus with ambient sounds!',

    journal: 'Start journaling in Pro!',
    moodTracking: 'Track your mood!',
    moodCalendar: 'View mood calendar!',
    moodInsights: 'Get mood insights!',
    moodHabitCorrelation: 'See mood-habit correlation!',
    sentimentAnalysis: 'Analyze journal sentiment!',
    dreamDiary: 'Keep a dream diary in Elite!',

    visionBoard: 'Create vision boards!',
    goals: 'Set and track goals!',
    lifeAreas: 'Balance your life areas!',
    lifeScore: 'Calculate your life score!',

    habitStacks: 'Build habit stacks!',
    habitTemplates: 'Use all habit templates!',
    experiments: 'Run habit experiments!',

    leagues: 'Join leagues!',
    betting: 'Bet on your habits!',
    challenges: 'Join monthly challenges!',
    certifications: 'Earn certifications!',
    quests: 'Complete daily quests!',
    hallOfFame: 'Enter the hall of fame!',

    schedule: 'Use the scheduler!',
    timeline: 'View your journey timeline!',
    newspaper: 'Get daily habit news!',
    burnoutTracker: 'Track burnout level!',

    themeCustomization: 'Customize your theme!',
    widgets: 'Create shareable widgets!',
    exportData: 'Export your data!',
    importData: 'Import from other apps!',
    apiAccess: 'Get API access in Elite!',
    teamSpaces: 'Create team spaces in Elite!',
    pushNotifications: 'Enable push notifications!',
    weatherSync: 'Sync with weather!',
    prioritySupport: 'Get priority support in Elite!',

    allTemplates: 'Access all template packs!',
    customTemplates: 'Create custom templates!',

    aiHabitArchitect: 'AI Habit Architect available in Elite!',
    lifeOSDashboard: 'Life OS Dashboard available in Elite!',
    predictiveAI: 'Predictive AI Engine available in Elite!',
    smartIntervention: 'Smart Intervention available in Elite!',
    monthlyBehaviorReport: 'Monthly Report available in Elite!',
    habitROIDashboard: 'Habit ROI available in Elite!',
    habitTwin: 'Habit Twin available in Elite!',
    weeklyEmail: 'Weekly Email available in Elite!',
    dnaEvolution: 'DNA Evolution available in Elite!',
    whiteGloveOnboarding: 'White Glove Onboarding for Elite!',
    elitePacks: 'Elite Packs available in Elite!',
  };

  return featureMessages[featureName] || `Upgrade to unlock this feature!`;
}

export function getPlanComparisonData() {
  return [
    { name: 'Max Habits', free: '3', pro: '50', elite: 'Unlimited' },
    { name: 'Daily Completions', free: '5', pro: '100', elite: 'Unlimited' },
    { name: 'History', free: '7 days', pro: '1 Year', elite: 'Unlimited' },
    { name: 'Template Packs', free: '3', pro: '40+', elite: '45 (incl. Elite)' },
    { name: 'Habit Stacks', free: false, pro: true, elite: true },
    { name: 'AI Coach', free: false, pro: true, elite: true },
    { name: 'AI Life Coach Pro', free: false, pro: false, elite: true },
    { name: 'Weekly Coaching Sessions', free: false, pro: false, elite: true },
    { name: 'Focus Mode', free: false, pro: true, elite: true },
    { name: 'Journal & Mood', free: false, pro: true, elite: true },
    { name: 'Vision Board', free: false, pro: true, elite: true },
    { name: 'Life Areas & Score', free: false, pro: true, elite: true },
    { name: 'Goals & Schedule', free: false, pro: true, elite: true },
    { name: 'Leagues & Betting', free: false, pro: true, elite: true },
    { name: 'Challenges', free: false, pro: true, elite: true },
    { name: 'Certifications', free: false, pro: true, elite: true },
    { name: 'Deep Analytics', free: false, pro: false, elite: true },
    { name: 'Team Spaces', free: false, pro: false, elite: true },
    { name: 'API Access', free: false, pro: false, elite: true },
    { name: 'Export/Import', free: false, pro: true, elite: true },
    { name: 'Priority Support', free: false, pro: false, elite: true },
    { name: 'AI Habit Architect', free: false, pro: false, elite: true },
    { name: 'Life OS Dashboard', free: false, pro: false, elite: true },
    { name: 'Predictive AI Engine', free: false, pro: false, elite: true },
    { name: 'Smart Intervention', free: false, pro: false, elite: true },
    { name: 'Monthly Behavior Report', free: false, pro: false, elite: true },
    { name: 'Habit ROI Dashboard', free: false, pro: false, elite: true },
    { name: 'Habit Twin Benchmarking', free: false, pro: false, elite: true },
    { name: 'Executive Weekly Email', free: false, pro: false, elite: true },
    { name: 'DNA Evolution Timeline', free: false, pro: false, elite: true },
    { name: 'White Glove Onboarding', free: false, pro: false, elite: true },
  ];
}

export function getAvailableTemplatePacks(planId) {
  const maxPacks = PLANS[planId]?.maxTemplatePacks || 3;
  if (planId === 'elite') return ELITE_HABIT_PACKS;
  return []; // Basic template packs should be defined elsewhere
}