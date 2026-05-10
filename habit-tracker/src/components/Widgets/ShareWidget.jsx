import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../../hooks/useHabits';
import { getTotalPoints, getLevel } from '../../utils/pointsUtils';
import { generateWidgetData, copyWidget } from '../../utils/widgetUtils';
import toast from 'react-hot-toast';

const ShareWidget = ({ type, onClose, style }) => {
  const { habits } = useHabits();
  const navigate = useNavigate();
  const points = getTotalPoints();
  const level = getLevel(points);
  const bestStreak = Math.max(...habits.map(h => h.currentStreak || 0), 0);
  const completionRate = Math.round((habits.filter(h => h.completionLog?.[new Date().toISOString().split('T')[0]]).length / Math.max(habits.length, 1)) * 100);

  const handleCopy = async () => {
    const text = getShareText();
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getShareText = () => {
    switch (type) {
      case 'streak':
        return `🔥 ${bestStreak} Day Streak on ${habits.find(h => h.currentStreak === bestStreak)?.name || 'my habit'}!`;
      case 'achievement':
        return `🏆 Level ${level} reached with ${points} total points!`;
      case 'weekly':
        return `📊 ${completionRate}% completion this week!`;
      default:
        return `Making progress every day! 💪`;
    }
  };

  const designs = {
    streak: (
      <div style={{ background: 'linear-gradient(135deg, #534AB7 0%, #8B5CF6 100%)', padding: '40px', borderRadius: '16px', color: '#fff', textAlign: 'center', height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>🔥</div>
        <div style={{ fontSize: '48px', fontWeight: '700' }}>{bestStreak}</div>
        <div style={{ fontSize: '16px', opacity: 0.8 }}>Day Streak</div>
        <div style={{ fontSize: '14px', opacity: 0.6, marginTop: 'auto' }}>HabitFlow</div>
      </div>
    ),
    achievement: (
      <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', padding: '40px', borderRadius: '16px', color: '#fff', textAlign: 'center', height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>🏆</div>
        <div style={{ fontSize: '24px', fontWeight: '700' }}>Level {level}</div>
        <div style={{ fontSize: '14px', opacity: 0.8 }}>{points} Total Points</div>
        <div style={{ fontSize: '14px', opacity: 0.6, marginTop: 'auto' }}>HabitFlow</div>
      </div>
    ),
    weekly: (
      <div style={{ background: '#1a1a1a', padding: '40px', borderRadius: '16px', color: '#fff', textAlign: 'center', height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '16px' }}>📊 This Week</div>
        <div style={{ fontSize: '48px', fontWeight: '700', color: '#22c55e' }}>{completionRate}%</div>
        <div style={{ fontSize: '14px', opacity: 0.8 }}>completion rate</div>
        <div style={{ fontSize: '14px', opacity: 0.6, marginTop: 'auto' }}>HabitFlow</div>
      </div>
    ),
    motivational: (
      <div style={{ background: 'linear-gradient(135deg, #14b8a6 0%, #22c55e 100%)', padding: '40px', borderRadius: '16px', color: '#fff', textAlign: 'center', height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '18px', fontStyle: 'italic', marginBottom: '16px', maxWidth: '200px' }}>"Every day is a new opportunity to grow."</div>
        <div style={{ fontSize: '14px', opacity: 0.8 }}>Level {level} • {points} pts</div>
        <div style={{ fontSize: '14px', opacity: 0.6, marginTop: 'auto' }}>HabitFlow</div>
      </div>
    )
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        padding: '24px',
        backgroundColor: 'var(--surface)',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        ...style
      }}
    >
      <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Share Your Progress 🖼️</h2>
      
      <div style={{ marginBottom: '20px' }}>
        {designs[type] || designs.motivational}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCopy}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '14px',
          fontWeight: '600',
          backgroundColor: 'var(--primary)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        📋 Copy to Clipboard
      </motion.button>
    </motion.div>
  );
};

export default ShareWidget;