import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { loadProfile } from '../../utils/profileUtils';
import PlanBadge from '../UI/PlanBadge';
import { isPro, isElite, getMaxHabits } from '../../utils/planUtils';
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

  useEffect(() => {
    const loaded = loadProfile();
    setProfile(loaded);
  }, []);

  const getNavItems = () => {
    const isUserPro = isPro();
    const isUserElite = isElite();
    const activeHabitsCount = habits.filter(h => h.isActive !== false).length;
    const maxHabits = getMaxHabits();

    const allHabitsLabel = !isUserPro 
      ? `All Habits (${activeHabitsCount}/${maxHabits})` 
      : 'All Habits';

    if (!isUserPro) {
      return [
        { path: '/', label: 'Dashboard', icon: '📊' },
        { path: '/habits', label: allHabitsLabel, icon: '✅' },
        { path: '/stats', label: 'Analytics', icon: '📈' }
      ];
    }

    const proItems = [
      { path: '/', label: 'Dashboard', icon: '📊' },
      { path: '/mood', label: 'Mood', icon: '😊' },
      { path: '/habits', label: 'All Habits', icon: '✅' },
      { path: '/habit-stacks', label: 'Habit Stacks', icon: '🔗' },
      { path: '/ai-coach', label: 'AI Coach', icon: '🤖' },
      ...(isUserElite ? [{ path: '/ai-coaching', label: 'AI Life Coach', icon: '👑' }] : []),
      { path: '/stats', label: 'Analytics', icon: '📈' },
      { path: '/life-score', label: 'Life Score', icon: '🎯' },
      { path: '/life-areas', label: 'Life Areas', icon: '🗺️' },
      { path: '/goals', label: 'Goals', icon: '🎯' },
      { path: '/focus', label: 'Focus Mode', icon: '⏱️' },
      { path: '/focus-history', label: 'Focus Stats', icon: '📊' },
      { path: '/breathing', label: 'Breathe', icon: '💨' },
      { path: '/calendar', label: 'Calendar', icon: '📅' },
      { path: '/journal', label: 'Journal', icon: '📖' },
      { path: '/vision-board', label: 'Vision Board', icon: '🖼️' },
      { path: '/schedule', label: 'Schedule', icon: '📅' },
      { path: '/experiments', label: 'Experiments', icon: '🔬' },
      { path: '/newspaper', label: 'Daily News', icon: '📰' },
      { path: '/dream-diary', label: 'Dream Diary', icon: '💭' },
      { path: '/timeline', label: 'Journey', icon: '🕰️' },
      { path: '/bets', label: 'Bets', icon: '💰' },
      { path: '/leagues', label: 'Leagues', icon: '🏅' },
      { path: '/achievements', label: 'Achievements', icon: '🏅' },
      { path: '/certifications', label: 'Certifications', icon: '🏆' },
      { path: '/challenge', label: 'Challenge', icon: '🏆' },
      { path: '/burnout', label: 'Wellbeing', icon: '🌿' },
      { path: '/widgets', label: 'Share', icon: '🖼️' },
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

      {!isPro() && (
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