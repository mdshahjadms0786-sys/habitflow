import { useState } from 'react';
import { motion } from 'framer-motion';
import { setDailyGoal, setWeeklyGoal, getDailyGoal, getWeeklyGoal, clearGoals } from '../../utils/goalUtils';

const GoalSetter = () => {
  const [dailyTarget, setDailyTarget] = useState(5);
  const [weeklyTarget, setWeeklyTarget] = useState(30);
  
  const dailyGoal = getDailyGoal();
  const weeklyGoal = getWeeklyGoal();

  const handleSetDaily = () => {
    setDailyGoal(dailyTarget);
    toast.success(`Daily goal set: ${dailyTarget} habits`);
  };

  const handleSetWeekly = () => {
    setWeeklyGoal(weeklyTarget);
    toast.success(`Weekly goal set: ${weeklyTarget} habits`);
  };

  const handleClear = () => {
    clearGoals();
    toast.success('Goals cleared!');
  };

  return (
    <div>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
        Set Goals 🎯
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ backgroundColor: 'var(--bg)', borderRadius: '8px', padding: '16px' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
            Daily Goal
          </p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="number"
              min="1"
              max="20"
              value={dailyTarget}
              onChange={(e) => setDailyTarget(parseInt(e.target.value) || 1)}
              style={{
                width: '60px',
                padding: '8px',
                fontSize: '14px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                color: 'var(--text)',
                textAlign: 'center',
              }}
            />
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>habits/day</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSetDaily}
              style={{
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Set
            </motion.button>
          </div>
          {dailyGoal && (
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#22c55e' }}>
              ✓ Active: {dailyGoal.targetHabits} habits/day
            </p>
          )}
        </div>

        <div style={{ backgroundColor: 'var(--bg)', borderRadius: '8px', padding: '16px' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
            Weekly Goal
          </p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="number"
              min="7"
              max="100"
              value={weeklyTarget}
              onChange={(e) => setWeeklyTarget(parseInt(e.target.value) || 7)}
              style={{
                width: '60px',
                padding: '8px',
                fontSize: '14px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                color: 'var(--text)',
                textAlign: 'center',
              }}
            />
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>habits/week</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSetWeekly}
              style={{
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Set
            </motion.button>
          </div>
          {weeklyGoal && (
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#22c55e' }}>
              ✓ Active: {weeklyGoal.targetHabits} habits/week
            </p>
          )}
        </div>

        {(dailyGoal || weeklyGoal) && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClear}
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              backgroundColor: 'transparent',
              color: '#ef4444',
              border: '1px solid #ef4444',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Clear Goals
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default GoalSetter;