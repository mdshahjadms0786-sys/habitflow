import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../hooks/useHabits';
import { loadProfile } from '../utils/profileUtils';
import { getCurrentPlan, PLANS } from '../utils/planUtils';
import { checkCertifications, loadCertifications } from '../utils/certificationUtils';
import { getTotalPoints } from '../utils/pointsUtils';
import EditProfileModal from '../components/Profile/EditProfileModal';
import PlanBadge from '../components/UI/PlanBadge';

const GOALS_MAP = {
  fitness: { name: 'Get Fit & Healthy', icon: '💪', color: '#10b981' },
  learning: { name: 'Learn & Grow', icon: '📚', color: '#3b82f6' },
  productivity: { name: 'Be More Productive', icon: '💼', color: '#8b5cf6' },
  wellbeing: { name: 'Improve Wellbeing', icon: '😊', color: '#f59e0b' },
  finances: { name: 'Build Better Finances', icon: '💰', color: '#22c55e' },
  habits: { name: 'Build Good Habits', icon: '🌟', color: '#ec4899' }
};

const ProfilePage = () => {
  const { habits } = useHabits();
  const [profile, setProfile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [stats, setStats] = useState({
    totalHabits: 0,
    totalCompletions: 0,
    bestStreak: 0,
    totalPoints: 0
  });
  const [certifications, setCertifications] = useState([]);
  
  useEffect(() => {
    const loadedProfile = loadProfile();
    setProfile(loadedProfile);
    
    const earnedCerts = checkCertifications(habits);
    setCertifications(loadCertifications());
    
    let totalCompletions = 0;
    let bestStreak = 0;
    let categoryCount = {};
    
    habits.forEach(habit => {
      totalCompletions += Object.keys(habit.completionLog || {}).length;
      bestStreak = Math.max(bestStreak, habit.currentStreak || 0, habit.longestStreak || 0);
      categoryCount[habit.category] = (categoryCount[habit.category] || 0) + 1;
    });
    
    setStats({
      totalHabits: habits.length,
      totalCompletions,
      bestStreak,
      totalPoints: getTotalPoints()
    });
  }, [habits]);
  
  const getRecentActivity = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      let completions = 0;
      habits.forEach(habit => {
        if (habit.completionLog?.[dateStr]?.completed) {
          completions++;
        }
      });
      
      days.push({
        date: dateStr,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completions,
        mood: completions > 0 ? '😊' : '😐'
      });
    }
    return days;
  };
  
  if (!profile) return null;
  
  const formatJoinDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px'
            }}
          >
            {profile.avatarEmoji}
          </div>
          
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
              {profile.name || 'Your Name'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              @{profile.username || 'username'}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '4px' }}>
              Member since {formatJoinDate(profile.joinDate)}
            </p>
          </div>
          
          <PlanBadge />
        </div>
        
        {profile.bio && (
          <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
            {profile.bio}
          </p>
        )}
        
        {profile.goals && profile.goals.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {profile.goals.map(goalId => {
              const goal = GOALS_MAP[goalId];
              if (!goal) return null;
              return (
                <span
                  key={goalId}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    backgroundColor: `${goal.color}20`,
                    color: goal.color,
                    fontSize: '13px'
                  }}
                >
                  {goal.icon} {goal.name}
                </span>
              );
            })}
          </div>
        )}
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowEditModal(true)}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            backgroundColor: 'transparent',
            color: 'var(--text)',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Edit Profile
        </motion.button>
      </div>
      
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        {[
          { label: 'Total Habits', value: stats.totalHabits, icon: '✅' },
          { label: 'Completions', value: stats.totalCompletions, icon: '🎯' },
          { label: 'Best Streak', value: `${stats.bestStreak} days`, icon: '🔥' },
          { label: 'Total Points', value: stats.totalPoints.toLocaleString(), icon: '⭐' }
        ].map((stat, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
            <div style={{ fontSize: '20px', fontWeight: '700' }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{stat.label}</div>
          </div>
        ))}
      </div>
      
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '24px'
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
          Achievement Showcase 🏅
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {certifications.length > 0 ? (
            certifications.slice(0, 6).map((cert, idx) => (
              <div
                key={idx}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  backgroundColor: `${cert.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  cursor: 'pointer'
                }}
                title={cert.name}
              >
                {cert.badge}
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Complete habits to earn badges!
            </p>
          )}
        </div>
      </div>
      
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '24px'
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
          Recent Activity (7 days) 📅
        </h2>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
          {getRecentActivity().map((day, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '12px 8px',
                borderRadius: '12px',
                backgroundColor: day.completions > 0 ? 'var(--primary-light)' : 'var(--bg)'
              }}
            >
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {day.dayName}
              </div>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>{day.mood}</div>
              <div style={{ fontSize: '12px', fontWeight: '600' }}>
                {day.completions} {day.completions === 1 ? 'habit' : 'habits'}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </div>
  );
};

export default ProfilePage;