const STORAGE_KEY = 'ht_plan';

export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    badge: '🆓',
    color: '#888780',
    maxHabits: 5,
    maxTemplatePacks: 3,
    historyDays: 7,
    features: {
      basicTracking: true,
      streaks: true,
      basicAnalytics: true,
      darkMode: true,
      onboarding: true,
      profile: true,
      // PRO features
      unlimitedHabits: false,
      aiCoach: false,
      focusMode: false,
      journal: false,
      moodTracking: false,
      visionBoard: false,
      goals: false,
      lifeAreas: false,
      habitStacks: false,
      leagues: false,
      certifications: false,
      betting: false,
      weatherSync: false,
      pushNotifications: false,
      exportImport: false,
      fullAnalytics: false,
      allTemplates: false,
      // ELITE features
      aiCoachPro: false,
      coachingSessions: false,
      teamSpaces: false,
      apiAccess: false,
      deepAnalysis: false,
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 199,
    badge: '💎',
    color: '#534AB7',
    maxHabits: 999,
    maxTemplatePacks: 40,
    historyDays: 365,
    features: {
      basicTracking: true,
      streaks: true,
      basicAnalytics: true,
      darkMode: true,
      onboarding: true,
      profile: true,
      unlimitedHabits: true,
      aiCoach: true,
      focusMode: true,
      journal: true,
      moodTracking: true,
      visionBoard: true,
      goals: true,
      lifeAreas: true,
      habitStacks: true,
      leagues: true,
      certifications: true,
      betting: true,
      weatherSync: true,
      pushNotifications: true,
      exportImport: true,
      fullAnalytics: true,
      allTemplates: true,
      // ELITE features
      aiCoachPro: false,
      coachingSessions: false,
      teamSpaces: false,
      apiAccess: false,
      deepAnalysis: false,
    }
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    price: 499,
    badge: '👑',
    color: '#BA7517',
    maxHabits: 999,
    maxTemplatePacks: 40,
    historyDays: 9999,
    features: {
      // ALL features true
      basicTracking: true,
      streaks: true,
      basicAnalytics: true,
      darkMode: true,
      onboarding: true,
      profile: true,
      unlimitedHabits: true,
      aiCoach: true,
      focusMode: true,
      journal: true,
      moodTracking: true,
      visionBoard: true,
      goals: true,
      lifeAreas: true,
      habitStacks: true,
      leagues: true,
      certifications: true,
      betting: true,
      weatherSync: true,
      pushNotifications: true,
      exportImport: true,
      fullAnalytics: true,
      allTemplates: true,
      aiCoachPro: true,
      coachingSessions: true,
      teamSpaces: true,
      apiAccess: true,
      deepAnalysis: true,
    }
  }
};

export function getCurrentPlan() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored || 'pro'; // Default to pro for existing users as requested
}

export function setPlan(planId) {
  localStorage.setItem(STORAGE_KEY, planId);
}

export function hasFeature(featureName) {
  const planId = getCurrentPlan();
  const planData = PLANS[planId];
  if (!planData) return false;
  return !!planData.features[featureName];
}

export function getMaxHabits() {
  const planId = getCurrentPlan();
  return PLANS[planId]?.maxHabits || 5;
}

export function isPro() {
  const planId = getCurrentPlan();
  return planId === 'pro' || planId === 'elite';
}

export function isElite() {
  return getCurrentPlan() === 'elite';
}

export function getPlanBadge() {
  const planId = getCurrentPlan();
  return PLANS[planId]?.badge || '🆓';
}