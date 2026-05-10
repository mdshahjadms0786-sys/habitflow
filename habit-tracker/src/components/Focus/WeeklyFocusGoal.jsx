import { useState } from 'react';
import { motion } from 'framer-motion';
import { getWeeklyFocusGoalProgress, getFocusGoal, setFocusGoal, formatMinutes } from '../../utils/focusHistoryUtils';

const WeeklyFocusGoal = ({ sessions }) => {
  const [showInput, setShowInput] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  
  const goal = getFocusGoal();
  const { current, goal: goalVal, percentage } = getWeeklyFocusGoalProgress(sessions, goal);
  
  const getColor = () => {
    if (percentage >= 75) return '#22c55e';
    if (percentage >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const handleSaveGoal = () => {
    const parsed = parseInt(newGoal);
    if (parsed && parsed > 0) {
      setFocusGoal(parsed);
      setShowInput(false);
      setNewGoal('');
    }
  };

  if (showInput) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid var(--border)'
        }}
      >
        <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
          Weekly Focus Goal 🎯
        </h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="number"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Minutes"
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg)',
              color: 'var(--text)',
              fontSize: '14px'
            }}
          />
          <button
            onClick={handleSaveGoal}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Save
          </button>
        </div>
        <button
          onClick={() => setShowInput(false)}
          style={{
            marginTop: '8px',
            background: 'none',
            border: 'none',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid var(--border)'
      }}
    >
      <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
        Weekly Focus Goal 🎯
      </h3>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
          <svg style={{ transform: 'rotate(-90deg)', width: '120px', height: '120px' }}>
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="var(--bg-secondary)"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={getColor()}
              strokeWidth="10"
              strokeDasharray={`${percentage * 3.14} 314`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.3s ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text)' }}>
              {percentage}%
            </span>
          </div>
        </div>
      </div>
      
      <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
        {formatMinutes(current)} of {formatMinutes(goal)} goal
      </p>
      
      <button
        onClick={() => setShowInput(true)}
        style={{
          width: '100%',
          padding: '8px',
          background: 'none',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          cursor: 'pointer'
        }}
      >
        Change Goal
      </button>
    </motion.div>
  );
};

export default WeeklyFocusGoal;