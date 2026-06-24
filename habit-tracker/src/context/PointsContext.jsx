import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import logger from '../utils/logger';
import * as pointsUtils from '../utils/pointsUtils';
import toast from 'react-hot-toast';
import { useAuthContext } from './AuthContext';
import { getUserProfile, updateUserProfile } from '../services/supabaseService';

const PointsContext = createContext(null);

export const PointsProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentLevel, setCurrentLevel] = useState({ level: 1, name: 'Seed', icon: '🌱' });
  const [nextLevel, setNextLevel] = useState(null);
  const [progress, setProgress] = useState(0);
  const [pointsToNext, setPointsToNext] = useState(0);
  const [earnedToday, setEarnedToday] = useState(0);
  const [history, setHistory] = useState([]);
  const [referralCode, setReferralCode] = useState('');
  const [referralStats, setReferralStats] = useState({ sent: 0, completed: 0 });

  const refreshPoints = useCallback(() => {
    try {
      const pts = pointsUtils.loadPoints();
      const level = pointsUtils.getCurrentLevel();
      const next = pointsUtils.getNextLevel();
      setTotalPoints(pts);
      setCurrentLevel(level);
      setNextLevel(next);
      setProgress(pointsUtils.getProgressToNextLevel());
      setPointsToNext(pointsUtils.getPointsToNextLevel());
      setEarnedToday(pointsUtils.getPointsEarnedToday());
      setHistory(pointsUtils.getPointsHistory().slice(0, 50));
      setReferralStats(pointsUtils.getReferralStats());
    } catch (e) {
      logger.error('refreshPoints error:', e);
    }
  }, []);

  useEffect(() => {
    refreshPoints();
    const handleUpdate = () => refreshPoints();
    window.addEventListener('pointsUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('pointsUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [refreshPoints]);

  useEffect(() => {
    if (user) {
      const fetchSupabase = async () => {
        const { data: profile, error } = await getUserProfile(user.id);
        if (error) {
          logger.error('Failed to fetch user profile for points sync:', error);
          return;
        }
        if (profile) {
          if (profile.total_points > pointsUtils.loadPoints()) {
            localStorage.setItem('ht_points', profile.total_points);
            if (profile.points_history) {
              localStorage.setItem('ht_points_history', JSON.stringify(profile.points_history));
            }
            refreshPoints();
          }
          if (profile.referral_code) {
            localStorage.setItem('ht_referral_code', profile.referral_code);
            setReferralCode(profile.referral_code);
          }
        }
      };
      fetchSupabase();
    }
  }, [user, refreshPoints]);

  // Sync to Supabase when points change
  useEffect(() => {
    if (user && totalPoints > 0) {
      updateUserProfile(user.id, {
        total_points: totalPoints,
        current_level: currentLevel.level,
        points_history: history
      }).then(({ error }) => {
        if (error) logger.error('Failed to sync points to Supabase:', error);
      }).catch(e => logger.error('Sync failed:', e));
    }
  }, [totalPoints, currentLevel, history, user]);

  useEffect(() => {
    setReferralCode(pointsUtils.getReferralCode());
  }, []);

  const awardPoints = useCallback((reason, options = {}) => {
    const pts = pointsUtils.addPoints(reason, options);
    if (pts > 0) refreshPoints();
    return pts;
  }, [refreshPoints]);

  const spendPoints = useCallback((amount) => {
    const remaining = pointsUtils.deductPoints(amount);
    refreshPoints();
    return remaining;
  }, [refreshPoints]);

  const sendReferral = useCallback(() => {
    const pts = pointsUtils.addReferral('sent');
    refreshPoints();
    return pts;
  }, [refreshPoints]);

  const redeemReferral = useCallback(() => {
    const pts = pointsUtils.addReferral('completed');
    refreshPoints();
    return pts;
  }, [refreshPoints]);

  const value = {
    totalPoints,
    currentLevel,
    nextLevel,
    progress,
    pointsToNext,
    earnedToday,
    history,
    referralCode,
    referralStats,
    awardPoints,
    spendPoints,
    sendReferral,
    redeemReferral,
    refreshPoints,
    LEVELS: pointsUtils.LEVELS,
    POINTS_CONFIG: pointsUtils.POINTS_CONFIG,
    PLAN_MULTIPLIERS: pointsUtils.PLAN_MULTIPLIERS,
  };

  return (
    <PointsContext.Provider value={value}>
      {children}
    </PointsContext.Provider>
  );
};

export const usePointsContext = () => {
  const ctx = useContext(PointsContext);
  if (!ctx) throw new Error('usePointsContext must be used within PointsProvider');
  return ctx;
};

export default PointsContext;
