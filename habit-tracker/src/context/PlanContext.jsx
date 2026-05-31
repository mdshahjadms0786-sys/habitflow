import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuthContext } from './AuthContext';
import { getUserProfile, updateUserProfile } from '../services/supabaseService';
import {
  getCurrentPlan,
  setPlan,
  hasFeature,
  canUseFeature,
  isPro,
  isElite,
  isFree,
  getPlanBadge,
  getPlanColor,
  getPlanGradient,
  getPlanName,
  getPlanTagline,
  PLANS,
  isTrialActive,
  getTrialDaysRemaining,
  startTrial,
  cancelTrial,
  getUpgradeMessage,
  getMaxHabits,
  getMaxCompletedPerDay,
  getMaxTemplatePacks,
  getMaxHabitsPerStack,
  getHistoryDays,
  getMaxJournalEntries,
  getMaxFocusSessions,
  getMaxStreakFreeze,
  getMaxBadges,
  getMaxChatMessages,
  getCurrentUsage,
  incrementUsage,
  ELITE_FEATURES,
  ELITE_HABIT_PACKS,
} from '../utils/planUtils';

const PlanContext = createContext(null);

export const usePlanContext = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlanContext must be used within a PlanProvider');
  }
  return context;
};

export const PlanProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [currentPlan, setCurrentPlan] = useState(getCurrentPlan());
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState(null);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(getTrialDaysRemaining());

  // Sync plan from Supabase when user logs in
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const profile = await getUserProfile(user.id);
        if (profile) {
          if (profile.plan) {
            // If cloud has a plan, use it and update local storage
            setCurrentPlan(profile.plan);
            setPlan(profile.plan);
          }
          if (profile.onboarding_complete) {
            // Restore onboarding status if they log into a new device
            localStorage.setItem('ht_onboarding_complete', 'true');
          }
        } else if (user) {
          // If no profile exists, create one with the current local plan
          await updateUserProfile(user.id, { plan: currentPlan });
        }
      }
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    const handlePlanChange = (event) => {
      setCurrentPlan(event.detail);
    };

    window.addEventListener('planChanged', handlePlanChange);
    return () => window.removeEventListener('planChanged', handlePlanChange);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrialDaysRemaining(getTrialDaysRemaining());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const upgrade = useCallback(async (planId) => {
    setPlan(planId);
    setCurrentPlan(planId);
    if (user) {
      await updateUserProfile(user.id, { plan: planId });
    }
  }, [user]);

  const requestUpgrade = useCallback((featureName = null) => {
    if (featureName) {
      setUpgradeFeature(featureName);
    }
    setShowUpgradeModal(true);
  }, []);

  const dismissUpgrade = useCallback(() => {
    setShowUpgradeModal(false);
    setUpgradeFeature(null);
  }, []);

  const checkFeature = useCallback((featureName) => {
    if (hasFeature(featureName)) return true;

    if (!canUseFeature(featureName)) {
      requestUpgrade(featureName);
      return false;
    }

    return true;
  }, [requestUpgrade]);

  const getUsagePercent = useCallback((limitName) => {
    const limit = PLANS[currentPlan]?.[limitName];
    const usage = getCurrentUsage(limitName);

    if (!limit || limit >= 99999) return 0;
    return Math.min(100, (usage / limit) * 100);
  }, [currentPlan]);

  const isNearLimit = useCallback((limitName, threshold = 80) => {
    return getUsagePercent(limitName) >= threshold;
  }, [getUsagePercent]);

  const getEliteFeatures = useCallback(() => {
    return Object.entries(ELITE_FEATURES).map(([key, value]) => ({
      ...value,
      key,
      unlocked: hasFeature(key),
    }));
  }, []);

  const getUnlockedEliteFeatures = useCallback(() => {
    return Object.entries(ELITE_FEATURES)
      .filter(([key]) => hasFeature(key))
      .map(([key, value]) => ({ ...value, key }));
  }, []);

  const value = {
    currentPlan,
    planData: PLANS[currentPlan],
    isPro: isPro(),
    isElite: isElite(),
    isFree: isFree(),
    isTrialActive: isTrialActive(),
    trialDaysRemaining,
    badge: getPlanBadge(),
    color: getPlanColor(),
    gradient: getPlanGradient(),
    name: getPlanName(),
    tagline: getPlanTagline(),

    hasFeature,
    canUseFeature,
    checkFeature,
    upgrade,
    requestUpgrade,
    dismissUpgrade,
    showUpgradeModal,
    upgradeFeature,

    limits: {
      maxHabits: getMaxHabits(),
      maxCompletedPerDay: getMaxCompletedPerDay(),
      maxTemplatePacks: getMaxTemplatePacks(),
      maxHabitsPerStack: getMaxHabitsPerStack(),
      historyDays: getHistoryDays(),
      maxJournalEntries: getMaxJournalEntries(),
      maxFocusSessions: getMaxFocusSessions(),
      maxStreakFreeze: getMaxStreakFreeze(),
      maxBadges: getMaxBadges(),
      maxChatMessages: getMaxChatMessages(),
    },

    usage: {
      getCurrentUsage,
      incrementUsage,
      getUsagePercent,
      isNearLimit,
    },

    upgradeMessage: upgradeFeature ? getUpgradeMessage(upgradeFeature) : null,

    PLANS,
    ELITE_FEATURES,
    ELITE_HABIT_PACKS,

    eliteFeatures: getEliteFeatures(),
    unlockedEliteFeatures: getUnlockedEliteFeatures(),

    getAvailableTemplatePacks: () => {
      if (currentPlan === 'elite') return ELITE_HABIT_PACKS;
      return [];
    },
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
};

export default PlanContext;