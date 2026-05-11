import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { loadProfile } from '../../utils/profileUtils';
import PlanBadge from '../UI/PlanBadge';
import { usePlanContext } from '../../context/PlanContext';
import { useHabits } from '../../hooks/useHabits';

const bottomItems = [
  { path: '/profile', label: 'Profile', icon: '👤' },
  { path: '/help', label: 'Help', icon: '❓' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: '', avatarEmoji: '👤' });
  const { habits } = useHabits();
  const { isPro: isUserPro, isElite: isUserElite, limits, hasFeature } = usePlanContext();

  useEffect(() => {
    const loaded = loadProfile();
    setProfile(loaded);
  }, []);

  const getNavItems = () => {
    const activeHabitsCount = habits.filter(h => h.isActive !== false).length;
    const maxHabits = limits.maxHabits;

    const allHabitsLabel = !isUserPro
      ? `All Habits (${activeHabitsCount}/${maxHabits})`
      : 'All Habits';

    if (!isUserPro) {
      return [
        { path: '/', label: 'Dashboard', icon: '📊' },
        { path: '/habits', label: allHabitsLabel, icon: '✅' },
        { path: '/stats', label: 'Analytics', icon: '📈' },
        { path: '/achievements', label: 'Achievements', icon: '🏅' },
        { path: '/settings', label: 'Settings', icon: '⚙️' },
      ];
    }

    if (isUserElite) {
      return [
        { path: '/', label: 'Dashboard', icon: '📊' },
        { path: '/elite', label: '👑 Elite Hub', icon: '👑', feature: null, elite: true },
        { path: '/habits', label: 'All Habits', icon: '✅' },
        { path: '/ai-architect', label: 'AI Architect', icon: '🏗️', feature: 'aiHabitArchitect' },
        { path: '/life-os', label: 'Life OS', icon: '🖥️', feature: 'lifeOSDashboard' },
        { path: '/predictive', label: 'Predictive AI', icon: '🔮', feature: 'predictiveAI' },
        { path: '/intervention', label: 'Interventions', icon: '🚨', feature: 'smartIntervention' },
        { path: '/habit-stacks', label: 'Habit Stacks', icon: '🔗', feature: 'habitStacks' },
        { path: '/ai-coach', label: 'AI Coach', icon: '🤖', feature: 'aiCoach' },
        { path: '/ai-coaching', label: 'AI Life Coach', icon: '👑', feature: 'aiCoachPro' },
        { path: '/focus', label: 'Focus Mode', icon: '⏱️', feature: 'focusMode' },
        { path: '/mood', label: 'Mood', icon: '😊', feature: 'moodTracking' },
        { path: '/journal', label: 'Journal', icon: '📖', feature: 'journal' },
        { path: '/life-score', label: 'Life Score', icon: '🎯', feature: 'lifeScore' },
        { path: '/life-areas', label: 'Life Areas', icon: '🗺️', feature: 'lifeAreas' },
        { path: '/goals', label: 'Goals', icon: '🎯', feature: 'goals' },
        { path: '/vision-board', label: 'Vision Board', icon: '🖼️', feature: 'visionBoard' },
        { path: '/stats', label: 'Analytics', icon: '📈' },
        { path: '/calendar', label: 'Calendar', icon: '📅' },
        { path: '/focus-history', label: 'Focus Stats', icon: '📊', feature: 'focusHistory' },
        { path: '/breathing', label: 'Breathe', icon: '💨', feature: 'breathingExercises' },
        { path: '/schedule', label: 'Schedule', icon: '📅', feature: 'schedule' },
        { path: '/experiments', label: 'Experiments', icon: '🔬', feature: 'experiments' },
        { path: '/newspaper', label: 'Daily News', icon: '📰', feature: 'newspaper' },
        { path: '/timeline', label: 'Journey', icon: '🕰️', feature: 'timeline' },
        { path: '/bets', label: 'Bets', icon: '💰', feature: 'betting' },
        { path: '/leagues', label: 'Leagues', icon: '🏅', feature: 'leagues' },
        { path: '/achievements', label: 'Achievements', icon: '🏅' },
        { path: '/certifications', label: 'Certifications', icon: '🏆', feature: 'certifications' },
        { path: '/challenge', label: 'Challenge', icon: '🏆' },
        { path: '/burnout', label: 'Wellbeing', icon: '🌿', feature: 'burnoutTracker' },
        { path: '/behavior-report', label: 'Behavior Report', icon: '🧬', feature: 'monthlyBehaviorReport' },
        { path: '/habit-roi', label: 'Habit ROI', icon: '💰', feature: 'habitROIDashboard' },
        { path: '/habit-twin', label: 'Habit Twin', icon: '👥', feature: 'habitTwin' },
        { path: '/weekly-email', label: 'Weekly Email', icon: '📧', feature: 'weeklyEmail' },
        { path: '/dna-evolution', label: 'DNA Evolution', icon: '🧬', feature: 'dnaEvolution' },
        { path: '/white-glove', label: 'White Glove', icon: '🎯', feature: 'whiteGloveOnboarding' },
        { path: '/widgets', label: 'Share', icon: '🖼️', feature: 'widgets' },
        { path: '/weekly-report', label: 'Weekly Report', icon: '📊' },
      ];
    }

    const proItems = [
      { path: '/', label: 'Dashboard', icon: '📊' },
      { path: '/habits', label: 'All Habits', icon: '✅' },
      { path: '/habit-stacks', label: 'Habit Stacks', icon: '🔗', feature: 'habitStacks' },
      { path: '/ai-coach', label: 'AI Coach', icon: '🤖', feature: 'aiCoach' },
      ...(isUserElite ? [{ path: '/ai-coaching', label: 'AI Life Coach', icon: '👑', feature: 'aiCoachPro' }] : []),
      { path: '/focus', label: 'Focus Mode', icon: '⏱️', feature: 'focusMode' },
      { path: '/mood', label: 'Mood', icon: '😊', feature: 'moodTracking' },
      { path: '/journal', label: 'Journal', icon: '📖', feature: 'journal' },
      { path: '/life-score', label: 'Life Score', icon: '🎯', feature: 'lifeScore' },
      { path: '/life-areas', label: 'Life Areas', icon: '🗺️', feature: 'lifeAreas' },
      { path: '/goals', label: 'Goals', icon: '🎯', feature: 'goals' },
      { path: '/vision-board', label: 'Vision Board', icon: '🖼️', feature: 'visionBoard' },
      { path: '/stats', label: 'Analytics', icon: '📈' },
      { path: '/calendar', label: 'Calendar', icon: '📅' },
      { path: '/focus-history', label: 'Focus Stats', icon: '📊', feature: 'focusHistory' },
      { path: '/breathing', label: 'Breathe', icon: '💨', feature: 'breathingExercises' },
      { path: '/schedule', label: 'Schedule', icon: '📅', feature: 'schedule' },
      { path: '/experiments', label: 'Experiments', icon: '🔬', feature: 'experiments' },
      { path: '/newspaper', label: 'Daily News', icon: '📰', feature: 'newspaper' },
      { path: '/timeline', label: 'Journey', icon: '🕰️', feature: 'timeline' },
      { path: '/bets', label: 'Bets', icon: '💰', feature: 'betting' },
      { path: '/leagues', label: 'Leagues', icon: '🏅', feature: 'leagues' },
      { path: '/achievements', label: 'Achievements', icon: '🏅' },
      { path: '/certifications', label: 'Certifications', icon: '🏆', feature: 'certifications' },
      { path: '/challenge', label: 'Challenge', icon: '🏆' },
      { path: '/burnout', label: 'Wellbeing', icon: '🌿', feature: 'burnoutTracker' },
      { path: '/widgets', label: 'Share', icon: '🖼️', feature: 'widgets' },
      { path: '/weekly-report', label: 'Weekly Report', icon: '📊' },
    ];

    return proItems;
  };

  const navItems = getNavItems();

  return (
    <aside
      className="desktop-sidebar"
      style={{
        width: 'var(--sidebar-width)',
        backgroundColor: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px',
          padding: '0 8px',
        }}
      >
        <span style={{ fontSize: '32px' }}>🎯</span>
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '700',
              color: 'var(--text)',
            }}
          >
            Habit Tracker
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: '12px',
              color: 'var(--text-secondary)',
            }}
          >
            Build better habits
          </p>
        </div>
      </div>

      <NavLink
        to="/profile"
        style={{ textDecoration: 'none', marginBottom: '16px' }}
      >
        {({ isActive }) => (
          <motion.div
            whileHover={{ scale: 1.02 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: isActive ? 'var(--primary-light)' : 'var(--bg)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}
            >
              {profile.avatarEmoji || '👤'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {profile.name || 'Your Profile'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                View profile
              </div>
            </div>
          </motion.div>
        )}
      </NavLink>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={{ textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                whileHover={{ x: 4 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: isActive ? '600' : '500',
                  }}
                >
                  {item.label}
                </span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      {!isUserPro && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/upgrade')}
          style={{
            marginTop: '16px',
            marginBottom: '16px',
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #534AB7, #8b5cf6)',
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(83, 74, 183, 0.3)'
          }}
        >
          Upgrade to Pro 🚀
        </motion.button>
      )}

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: 'auto' }}>
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={{ textDecoration: 'none' }}
          >
            {({ isActive }) => (
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                whileHover={{ x: 4 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: isActive ? '600' : '500',
                  }}
                >
                  {item.label}
                </span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>

      <div
        onClick={() => navigate('/upgrade')}
        style={{
          marginTop: '16px',
          padding: '16px',
          backgroundColor: 'var(--bg)',
          borderRadius: '12px',
          textAlign: 'center',
          cursor: 'pointer'
        }}
      >
        <PlanBadge size="small" />
        <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
          v2.0.0 • Built with React
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;