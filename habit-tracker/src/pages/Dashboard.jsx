import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useHabits } from '../hooks/useHabits';
import { useHabitContext, CAN_COMPLETE_HOURS, isExpired } from '../context/HabitContext';
import { useMoodContext } from '../context/MoodContext';
import StatsBar from '../components/Dashboard/StatsBar';
import WeatherCard from '../components/Dashboard/WeatherCard';
import MotivationBanner from '../components/Dashboard/MotivationBanner';
import WeeklyHeatmap from '../components/Dashboard/WeeklyHeatmap';
import StreakDisplay from '../components/Dashboard/StreakDisplay';
import LeaderboardModal from '../components/Social/LeaderboardModal';
import ReferralSection from '../components/Social/ReferralSection';
import HabitModal from '../components/Habits/HabitModal';
import TimeWarpModal from '../components/Habits/TimeWarpModal';
import MoodCheckin from '../components/Mood/MoodCheckin';
import MoodHabitAI from '../components/Mood/MoodHabitAI';
import ConfettiEffect from '../components/UI/ConfettiEffect';
import EmptyState from '../components/UI/EmptyState';
import AchievementPopup from '../components/Badges/AchievementPopup';
import WeeklyReviewModal from '../components/WeeklyReview/WeeklyReviewModal';
import WeeklyInsightCard from '../components/AICoach/WeeklyInsightCard';
import DailyQuestsPanel from '../components/Quests/DailyQuestsPanel';
import EmergencyModeToggle from '../components/Dashboard/EmergencyModeToggle';
import EmergencyBanner from '../components/Dashboard/EmergencyBanner';
import StreakRecoveryCard from '../components/Dashboard/StreakRecoveryCard';
import MissedHabitCard from '../components/Dashboard/MissedHabitCard';
import { loadPoints, deductPoints, addPoints } from '../utils/pointsUtils';
import { getYesterdayISO, getTodayISO, formatDate, formatISODate, getStartOfWeek } from '../utils/dateUtils';
import { getTotalBadgesEarned, getEarnedBadges, getNextBadge } from '../utils/badgeUtils';
import { getWeekCompletions, categorizeTodayHabits } from '../utils/streakUtils';
import { getTimeRemainingToday, checkAndAutoExpire } from '../utils/midnightUtils';
import { getHabitDeadline, getTimeRemaining } from '../utils/countdownUtils';
import { getPersonalizedGreeting, getMotivationalSubtext, getWeekCompletionRate, getDaysTracked } from '../utils/greetingUtils';
import { checkOllamaStatus } from '../utils/ollamaService';
import { isEmergencyModeActive, saveEmergencyMode, checkAndResetExpiredEmergencyMode, getTop3Habits } from '../utils/emergencyUtils';
import { getFocusSessions, getFocusStreak } from '../utils/focusHistoryUtils';
import { generateWeeklyReport, isReviewDay, hasReviewBeenShown, markReviewShown } from '../utils/weeklyReviewUtils';
import toast from 'react-hot-toast';
import { loadProfile } from '../utils/profileUtils';
import { getCurrentPlan, isPro, isElite, getMaxHabits } from '../utils/planUtils';

const categoryColors = {
  Health: '#14b8a6',
  Work: '#3b82f6',
  Personal: '#8b5cf6',
  Fitness: '#f97316',
  Learning: '#f59e0b',
};

const Dashboard = () => {
  const {
    habits,
    completedTodayCount,
    totalTodayCount,
    completionPercentage,
    bestStreak,
    toggleHabit,
    addHabit,
    editHabit: updateHabit,
    deleteHabit: removeHabit,
  } = useHabits();
  const { newlyUnlockedBadge, clearBadgePopup } = useHabitContext();
  const { moodLog } = useMoodContext();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showWeeklyReview, setShowWeeklyReview] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(null);
  const [ollamaRunning, setOllamaRunning] = useState(false);
  const [showTimeWarp, setShowTimeWarp] = useState(false);
  const [timeWarpHabitId, setTimeWarpHabitId] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [missedExpanded, setMissedExpanded] = useState(false);
  const [pendingExpanded, setPendingExpanded] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [visionData, setVisionData] = useState(null);
  const [scheduleData, setScheduleData] = useState(null);
  const [experimentData, setExperimentData] = useState(null);
  const [journalEntries, setJournalEntries] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0, percentage: 0, isUrgent: false });
  const [greeting, setGreeting] = useState({ greeting: '', subtext: '', emoji: '', mood: '' });
  const [showUrgencyBanner, setShowUrgencyBanner] = useState(false);

  // First: derive data from habits (must be before any useEffect that uses these)
  const safeHabits = (habits || []).filter(h => h != null);
  const displayedHabits = emergencyActive ? getTop3Habits(safeHabits) : safeHabits;
  const { completed: completedHabits, pending: pendingHabits, missed: missedHabits } = categorizeTodayHabits(displayedHabits);

  // Then: run useEffects that use derived data
  useEffect(() => {
    const updateTimeRemaining = () => {
      setTimeRemaining(getTimeRemainingToday());
    };
    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const profile = loadProfile();
    const userName = profile?.name || 'Champion';
    
    const todayStats = {
      streak: bestStreak,
      points: loadPoints(),
      daysTracked: safeHabits[0]?.createdAt ? getDaysTracked(safeHabits[0].createdAt) : 0,
      pendingCount: pendingHabits.length,
      completedCount: completedHabits.length,
      totalCount: totalTodayCount,
      allCompletedToday: completedTodayCount === totalTodayCount && totalTodayCount > 0,
      weeklyCompletionRate: getWeekCompletionRate(safeHabits),
      habits: safeHabits,
    };
    
    const greetingData = getPersonalizedGreeting(userName, safeHabits, todayStats);
    setGreeting(greetingData);
  }, [bestStreak, pendingHabits.length, completedHabits.length, totalTodayCount, safeHabits]);

  useEffect(() => {
    if (timeRemaining.isUrgent && pendingHabits.length > 0 && timeRemaining.hours < 1) {
      setShowUrgencyBanner(true);
    }
  }, [timeRemaining, pendingHabits.length]);

  useEffect(() => {
    checkOllama();
    const expired = checkAndResetExpiredEmergencyMode();
    setEmergencyActive(isEmergencyModeActive() || expired);
  }, []);

  const checkOllama = async () => {
    const status = await checkOllamaStatus();
    setOllamaRunning(status.isRunning);
  };

  const { toggleHabit: contextToggleHabit } = useHabitContext();

  useEffect(() => {
    const checkAndExpireHabits = () => {
      const today = getTodayISO();
      safeHabits.forEach(habit => {
        if (habit.createdAt) {
          const created = new Date(habit.createdAt);
          const now = new Date();
          const hoursSinceCreation = (now - created) / (1000 * 60 * 60);
          const isForToday = created.toISOString().split('T')[0] === today;
          const wasNotCompleted = !habit.completionLog?.[today];
          if (isForToday && wasNotCompleted && hoursSinceCreation > CAN_COMPLETE_HOURS && hoursSinceCreation < CAN_COMPLETE_HOURS + 1) {
            contextToggleHabit(habit.id, today, true);
          }
        }
      });
    };
    checkAndExpireHabits();
  }, []);

  useEffect(() => {
    if (isReviewDay() && safeHabits.length > 0) {
      const weekStart = formatISODate(getStartOfWeek(new Date()));
      if (!hasReviewBeenShown(weekStart)) {
        const report = generateWeeklyReport(safeHabits, moodLog || {});
        if (report) {
          setWeeklyReport(report);
          setShowWeeklyReview(true);
          markReviewShown(weekStart);
        }
      }
    }
  }, []);

  const handleToggleHabit = (habitId, isUndo = false, showTimeWarp = false) => {
    const habit = habits.find((h) => h.id === habitId);
    const wasCompleted = habit?.completionLog?.[getTodayISO()];
    
    if (!wasCompleted && !isUndo) {
      if (isExpired(habit)) {
        if (showTimeWarp) {
          setShowTimeWarp(true);
          setTimeWarpHabitId(habitId);
          return;
        }
        toast.error('⏰ This habit has expired! You can use Time Warp to backdate it.');
        return;
      }
    }

    toggleHabit(habitId, undefined, isUndo);

    if (!wasCompleted && !isExpired(habit)) {
      const newCompletedCount = completedTodayCount + 1;
      if (newCompletedCount === totalTodayCount && totalTodayCount > 0) {
        setShowConfetti(true);
        toast.success('🎉 All done today!');
      }

      const habitAfterToggle = habits.find((h) => h.id === habitId);
      const newStreak = (habitAfterToggle?.currentStreak || 0) + 1;
      if (newStreak > (habitAfterToggle?.longestStreak || 0)) {
        toast.success('🔥 New streak record!');
      }
    }
  };

  const handleAddHabit = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleDeleteHabit = (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      removeHabit(habitId);
      toast.success('🗑️ Habit deleted!');
    }
  };

  const handleSaveHabit = (habitData) => {
    if (editingHabit) {
      updateHabit(habitData);
      toast.success('✏️ Habit updated!');
    } else {
      const newHabit = {
        ...habitData,
        id: uuidv4(),
        createdAt: getTodayISO(),
        completionLog: {},
        currentStreak: 0,
        longestStreak: 0,
        isActive: true,
      };
      addHabit(newHabit);
      toast.success('✅ Habit added!');
    }
    setIsModalOpen(false);
    setEditingHabit(null);
  };

  const focusSessions = getFocusSessions();
  const focusStreak = getFocusStreak(focusSessions);

  // Calculate quick stats for right column
  const habitsWithReminders = safeHabits.filter((h) => h.reminderTime);
  const onFireHabit = safeHabits.reduce((best, h) => ((h?.currentStreak || 0) > (best?.currentStreak || 0) ? h : best), null);
  const needsAttentionHabit = safeHabits.reduce((worst, h) => {
    const worstWeek = getWeekCompletions(worst?.completionLog || {});
    const hWeek = getWeekCompletions(h?.completionLog || {});
    const worstCount = Object.values(worstWeek).filter(Boolean).length;
    const hCount = Object.values(hWeek).filter(Boolean).length;
    return hCount < worstCount ? h : worst;
  }, safeHabits[0] || null);

  const planId = getCurrentPlan();
  const maxHabits = getMaxHabits();
  const isFree = !isPro();
  const habitsUsed = safeHabits.length;

  return (
    <div className="page-container page-enter" style={{ padding: '24px', paddingBottom: '80px' }}>
      <ConfettiEffect trigger={showConfetti} />

      {emergencyActive && (
        <EmergencyBanner 
          onDeactivate={() => {
            saveEmergencyMode(false);
            setEmergencyActive(false);
            window.location.reload();
          }} 
        />
      )}

      {newlyUnlockedBadge && (
        <AchievementPopup
          badge={newlyUnlockedBadge.badge}
          habitName={newlyUnlockedBadge.habitName}
          onClose={() => {
            clearBadgePopup();
            toast.success(`${newlyUnlockedBadge.badge.emoji} ${newlyUnlockedBadge.badge.name} unlocked for ${newlyUnlockedBadge.habitName}!`);
          }}
        />
      )}

      {showWeeklyReview && weeklyReport && (
        <WeeklyReviewModal
          report={weeklyReport}
          onClose={() => setShowWeeklyReview(false)}
        />
      )}

      {isFree && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/upgrade')}
          style={{
            background: 'linear-gradient(135deg, #534AB7, #8b5cf6)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '12px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(83, 74, 183, 0.2)'
          }}
        >
          <div>
            <span style={{ fontWeight: 600, marginRight: '8px' }}>🚀 You're using the Free plan</span>
            <span style={{ opacity: 0.9 }}>— {habitsUsed}/{maxHabits} habits used</span>
          </div>
          <span style={{ fontWeight: 600 }}>Upgrade to Pro for unlimited habits + AI features →</span>
        </motion.div>
      )}

      <div
        className="dashboard-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* LEFT COLUMN */}
        <div style={{ maxWidth: '680px' }}>
<motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '24px' }}
          >
            {showUrgencyBanner && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'linear-gradient(135deg, #E24B4A, #D85A30)',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  marginBottom: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>⚡ Less than 1 hour left! {pendingHabits.length} habits pending</span>
                <button 
                  onClick={() => setShowUrgencyBanner(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  ✕
                </button>
              </motion.div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {formatDate(new Date())}
                </p>
                <h1
                  style={{
                    margin: '4px 0 0 0',
                    fontSize: '26px',
                    fontWeight: '700',
                    color: 'var(--text)',
                  }}
                >
                  {greeting.greeting || `Good day! Let's make today count!`}
                </h1>
                <p
                  style={{
                    margin: '8px 0 0 0',
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {greeting.subtext || "Let's make today count! 💫"}
                </p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <EmergencyModeToggle 
                  onToggle={(active) => {
                    setEmergencyActive(active);
                    window.location.reload();
                  }} 
                />
                {pendingHabits.length > 0 && (
                  <span style={{
                    fontSize: '12px',
                    padding: '3px 10px',
                    borderRadius: '99px',
                    background: timeRemaining.isUrgent ? '#FCEBEB' : '#E1F5EE',
                    color: timeRemaining.isUrgent ? '#E24B4A' : '#1D9E75',
                    fontWeight: 500,
                  }}>
                    ⏰ Resets in {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
              <div style={{ flex: 1 }}>
                <WeatherCard />
              </div>
            </div>
          </motion.header>

          <StreakDisplay />
          
          <StreakRecoveryCard habits={habits} />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/achievements')}
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '32px' }}>🏆</span>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
                  Achievements
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {getTotalBadgesEarned(habits)} badges earned
                </p>
              </div>
            </div>
            <span style={{ fontSize: '20px', color: 'var(--text-secondary)' }}>→</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/leagues')}
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '32px' }}>🏅</span>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
                  View Leaderboard
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
                  See how you rank
                </p>
              </div>
            </div>
            <span style={{ fontSize: '20px', color: 'var(--text-secondary)' }}>→</span>
          </motion.div>

          <StatsBar
            completedToday={completedTodayCount}
            totalToday={totalTodayCount}
            completionPercentage={completionPercentage}
            bestStreak={bestStreak}
          />

          {habits.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                backgroundColor: 'var(--surface)',
                borderRadius: '16px',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌱</div>
              <h2 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '8px', color: 'var(--text)' }}>
                Welcome! Start your habit journey
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Add your first habit to begin tracking your progress
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/habits')}
                style={{
                  background: '#534AB7',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '15px',
                  cursor: 'pointer',
                }}
              >
                Browse Habit Templates →
              </motion.button>
            </motion.div>
          ) : (
            <>
          <div style={{ marginBottom: '24px' }}>
            <MotivationBanner
              stats={{
                completedToday: completedTodayCount,
                totalHabits: totalTodayCount,
                bestStreak,
              }}
            />
          </div>

          {habits.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* COMPLETED Section - Row-wise */}
              {completedHabits.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #22c55e',
                  }}
                >
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#22c55e' }}>
                    ✅ Completed ({completedHabits.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {completedHabits.map(habit => (
                      <div
                        key={habit.id}
                        onClick={() => handleToggleHabit(habit.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          backgroundColor: '#22c55e15',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          border: '1px solid #22c55e30',
                        }}
                      >
                        <span style={{ fontSize: '18px' }}>{habit.icon || '⭐'}</span>
                        <span style={{ flex: 1, fontSize: '13px', color: 'var(--text)', textDecoration: 'line-through' }}>
                          {habit.name}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditHabit(habit); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '2px 6px' }}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteHabit(habit.id); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '2px 6px' }}
                          title="Delete"
                        >
                          🗑️
                        </button>
                        <span style={{ fontSize: '12px', color: '#22c55e' }}>✓</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* PENDING Section - Row-wise */}
              {pendingHabits.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#f97316' }}>
                    ⏳ Pending Today ({pendingHabits.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {pendingHabits.slice(0, pendingExpanded ? pendingHabits.length : 5).map(habit => {
                      const expired = isExpired(habit);
                      const deadline = getHabitDeadline(habit);
                      const timeLeft = getTimeRemaining(deadline);
                      const countdownText = timeLeft.hours > 0 
                        ? `⏰ ${timeLeft.hours}h ${timeLeft.minutes}m`
                        : timeLeft.minutes > 0 
                          ? `⏰ ${timeLeft.minutes}m`
                          : `⏰ ${timeLeft.seconds}s`;
                      const urgencyColor = timeLeft.urgency === 'critical' ? '#ef4444' : timeLeft.urgency === 'warning' ? '#f59e0b' : 'var(--text-secondary)';
                      const urgencyBg = timeLeft.urgency === 'critical' ? '#fef2f2' : timeLeft.urgency === 'warning' ? '#fffbeb' : 'var(--bg)';
                      return (
                        <div
                          key={habit.id}
                          onClick={() => handleToggleHabit(habit.id, false, true)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 12px',
                            backgroundColor: expired ? '#fef2f2' : 'var(--bg)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            border: `1px solid ${expired ? '#fecaca' : 'var(--border)'}`,
                            opacity: expired ? 0.6 : 1,
                          }}
                        >
                          <span style={{ fontSize: '18px' }}>{habit.icon || '⭐'}</span>
                          <span style={{ flex: 1, fontSize: '13px', color: expired ? '#ef4444' : 'var(--text)' }}>
                            {habit.name}
                          </span>
                          {!expired && (
                            <span style={{ fontSize: '10px', color: urgencyColor, backgroundColor: urgencyBg, padding: '2px 6px', borderRadius: '4px', marginRight: '6px' }}>
                              {countdownText}
                            </span>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEditHabit(habit); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '2px 6px' }}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteHabit(habit.id); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '2px 6px' }}
                            title="Delete"
                          >
                            🗑️
                          </button>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            🔥 {habit.currentStreak || 0}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {pendingHabits.length > 5 && (
                    <button
                      onClick={() => setPendingExpanded(!pendingExpanded)}
                      style={{
                        marginTop: '12px',
                        padding: '8px 16px',
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        width: '100%',
                      }}
                    >
                      {pendingExpanded ? 'Show less' : `Show ${pendingHabits.length - 5} more`}
                    </button>
                  )}
                </motion.div>
              )}

              {/* MISSED Section - Collapsible Reddesign */}
              {missedHabits.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    backgroundColor: '#FFF5F5',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #FED7D7',
                  }}
                >
                  <div 
                    onClick={() => setMissedExpanded(!missedExpanded)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: '12px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                        😔 Missed Yesterday ({missedHabits.length})
                      </h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span 
                        onClick={(e) => { e.stopPropagation(); }}
                        title="These habits were not completed yesterday"
                        style={{ fontSize: '12px', cursor: 'help' }}
                      >
                        ℹ️
                      </span>
                      <span style={{ fontSize: '14px', color: 'var(--text-secondary)', transform: missedExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                        ▼
                      </span>
                    </div>
                  </div>
                  
                  {missedExpanded && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                      {missedHabits.map(habit => (
                        <MissedHabitCard 
                          key={habit.id} 
                          habit={habit} 
                          toggleHabit={(id, date) => {
                            const currentPoints = loadPoints();
                            if (currentPoints >= 50) {
                              deductPoints(50);
                              toggleHabit(id, date);
                              toast.success(`Backdated! Streak restored 🔥 (-50 pts)`);
                            } else {
                              toast.error('Not enough points!');
                            }
                          }}
                          onBackdate={() => {
                            const currentPoints = loadPoints();
                            if (currentPoints >= 50) {
                              deductPoints(50);
                              toggleHabit(habit.id, habit.missedDate);
                              toast.success(`Backdated! Streak restored 🔥 (-50 pts)`);
                            } else {
                              toast.error('Not enough points! Need 50pts for backdate');
                            }
                          }}
                          onLogReason={() => {
                            const reason = window.prompt('Select reason:\n\n😴 Forgot\n🏥 Was sick\n🏖️ Was travelling\n💼 Too busy\n⛅ Weather/circumstances\n📝 Other');
                            if (reason) {
                              const reasons = localStorage.getItem('ht_missed_reasons') || '{}';
                              const parsed = JSON.parse(reasons);
                              parsed[habit.id] = { reason, date: getYesterdayISO(), timestamp: Date.now() };
                              localStorage.setItem('ht_missed_reasons', JSON.stringify(parsed));
                              toast.success('Reason logged ✓');
                            }
                          }}
                          onDoToday={() => {
                            const intents = localStorage.getItem('ht_makeup_intents') || '{}';
                            const parsed = JSON.parse(intents);
                            parsed[habit.id] = { date: getTodayISO(), timestamp: Date.now() };
                            localStorage.setItem('ht_makeup_intents', JSON.stringify(parsed));
                            toast.success('Making up today!');
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          ) : (
            <EmptyState
              icon="📝"
              title="No habits yet"
              description="Start by creating your first habit to track your progress!"
              action={handleAddHabit}
              actionLabel="Create Habit"
            />
          )}
            </>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {/* Mood Checkin */}
          <div style={{ marginBottom: '24px' }}>
            <MoodCheckin compact />
          </div>

          {/* AI Mood Insights */}
          <div style={{ marginBottom: '24px' }}>
            <MoodHabitAI />
          </div>

          {/* Referral Section */}
          <div style={{ marginBottom: '24px' }}>
            <ReferralSection />
          </div>

          {/* Circular Progress Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: `conic-gradient(var(--primary) ${totalTodayCount === 0 ? 0 : completionPercentage}%, var(--border) 0%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--surface)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                {totalTodayCount === 0 ? (
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center', padding: '8px' }}>
                    Add habits<br/>to begin
                  </span>
                ) : (
                  <>
                    <span style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text)' }}>
                      {completionPercentage}%
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>complete</span>
                  </>
                )}
              </div>
            </div>
            <p style={{ margin: '16px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
              Today's Progress
            </p>
          </motion.div>

          {/* This Week Heatmap */}
          <div style={{ marginBottom: '24px' }}>
            <WeeklyHeatmap habits={habits} />
          </div>

          {/* Focus Streak Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/focus-history')}
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '24px',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>⏱️</span>
              <div>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: 'var(--text)' }}>
                  Focus Streak
                </p>
                <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-secondary)' }}>
                  Click for stats
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '20px' }}>🔥</span>
              <span style={{ fontSize: '18px', fontWeight: '700', color: '#f97316' }}>
                {focusStreak}
              </span>
            </div>
          </motion.div>

          {/* Daily Quests Panel */}
          <div style={{ marginBottom: '24px' }}>
            <DailyQuestsPanel habits={habits} moodLog={moodLog} />
          </div>

          {/* Today's Reminders */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              border: '1px solid var(--border)',
            }}
          >
            <h3
              style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text)',
              }}
            >
              ⏰ Today's Reminders
            </h3>
            {habitsWithReminders.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {habitsWithReminders.map((habit) => (
                  <div
                    key={habit.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px',
                      backgroundColor: 'var(--bg)',
                      borderRadius: '8px',
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>{habit?.icon || '⭐'}</span>
                    <span style={{ fontSize: '13px', color: 'var(--text)' }}>{habit?.name}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {habit.reminderTime}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                No reminders set
              </p>
            )}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid var(--border)',
            }}
          >
            <h3
              style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text)',
              }}
            >
              📊 Quick Stats
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {onFireHabit && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px',
                    backgroundColor: '#fff7ed',
                    borderRadius: '8px',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>🔥</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>On Fire</span>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: 'var(--text)' }}>
                      {onFireHabit?.icon} {onFireHabit?.name} — {onFireHabit?.currentStreak} days
                    </p>
                  </div>
                </div>
              )}
              {needsAttentionHabit && onFireHabit?.id !== needsAttentionHabit.id && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px',
                    backgroundColor: '#fef2f2',
                    borderRadius: '8px',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>⚠️</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Needs Attention</span>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: 'var(--text)' }}>
                      {needsAttentionHabit?.icon} {needsAttentionHabit?.name}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* AI Insight Card */}
          {ollamaRunning && isPro() && !isElite() && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <WeeklyInsightCard
                habits={safeHabits}
                moodLog={moodLog || {}}
                completionPercentage={completionPercentage}
                bestStreak={bestStreak}
              />
            </motion.div>
          )}

          {/* Elite Life Coach */}
          {isElite() && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              onClick={() => navigate('/ai-coaching')}
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
                border: '1px solid #BA7517',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #BA7517, #f59e0b)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '32px' }}>👑</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>Weekly Coaching Session</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>Elite Life Coach</p>
                </div>
              </div>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                Your behavioral psychologist has analyzed your week. Ready for your deep dive session?
              </p>
              <button style={{ width: '100%', background: '#BA7517', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                Start Session →
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleAddHabit}
        style={{
          position: 'fixed',
          bottom: 'calc(24px + env(safe-area-inset-bottom))',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary)',
          color: '#ffffff',
          border: 'none',
          fontSize: '32px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
          zIndex: 100,
        }}
      >
        +
      </motion.button>

      <HabitModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingHabit(null);
        }}
        habit={editingHabit}
        onSave={handleSaveHabit}
      />

      <TimeWarpModal
        isOpen={showTimeWarp}
        onClose={() => {
          setShowTimeWarp(false);
          setTimeWarpHabitId(null);
        }}
        habits={habits.filter(h => h.id === timeWarpHabitId)}
        onTimeWarpComplete={(habitId, date) => {
          toggleHabit(habitId, date);
          toast.success('⏰ Time Warp complete!');
        }}
      />

      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />
    </div>
  );
};

export default Dashboard;
