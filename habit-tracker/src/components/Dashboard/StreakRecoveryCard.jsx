import { motion } from 'framer-motion';
import { useState } from 'react';
import { getTokens, useGraceToken, useFreezeToken, useRecoveryToken } from '../../utils/recoveryUtils';
import toast from 'react-hot-toast';

const StreakRecoveryCard = ({ habits, onTokenUsed }) => {
  const [tokens, setTokens] = useState(getTokens());
  
  const handleUseGrace = (habitId) => {
    const success = useGraceToken(habitId);
    if (success) {
      setTokens(getTokens());
      toast.success('🕐 Grace period used! Habit marked as complete.');
      onTokenUsed?.();
    } else {
      toast.error('No grace tokens remaining!');
    }
  };
  
  const handleUseFreeze = () => {
    const success = useFreezeToken();
    if (success) {
      setTokens(getTokens());
      toast.success('❄️ Streak freeze activated! All streaks protected for today.');
      onTokenUsed?.();
    } else {
      toast.error('No freeze tokens remaining!');
    }
  };
  
  const handleUseRecovery = (habitId, missedDate) => {
    const success = useRecoveryToken(habitId, missedDate);
    if (success) {
      setTokens(getTokens());
      toast.success('💫 Streak recovered!');
      onTokenUsed?.();
    } else {
      toast.error('Recovery not available or no tokens!');
    }
  };
  
  const atRiskHabits = habits?.filter(h => h.currentStreak > 0 && h.currentStreak < 7) || [];
  const brokenHabits = habits?.filter(h => {
    const lastKey = Object.keys(h.completionLog || {}).sort().pop();
    if (!lastKey) return false;
    const lastDate = new Date(lastKey);
    const today = new Date();
    const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
    return diffDays <= 2 && diffDays > 0;
  }) || [];
  
  const hasActiveStreaks = habits?.some(h => h.currentStreak > 0);
  const hasRecentBroken = brokenHabits.length > 0;
  
  if (!hasActiveStreaks && !hasRecentBroken) {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid #f59e0b40'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <span style={{ fontSize: '28px' }}>🛡️</span>
        <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Streak Protection</h3>
      </div>
      
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <div
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg)',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '4px' }}>🕐</div>
          <div style={{ fontSize: '18px', fontWeight: '700' }}>{tokens.grace}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Grace Tokens</div>
        </div>
        <div
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg)',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '4px' }}>❄️</div>
          <div style={{ fontSize: '18px', fontWeight: '700' }}>{tokens.freeze}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Freeze Tokens</div>
        </div>
        <div
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: 'var(--bg)',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '4px' }}>💫</div>
          <div style={{ fontSize: '18px', fontWeight: '700' }}>{tokens.recovery}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Recovery Tokens</div>
        </div>
      </div>
      
      {atRiskHabits.length > 0 && tokens.freeze > 0 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUseFreeze}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: '#3b82f6',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px',
            marginBottom: '12px'
          }}
        >
          ❄️ Use Freeze Token — Protect All Streaks
        </motion.button>
      )}
      
      {atRiskHabits.slice(0, 2).map(habit => (
        tokens.grace > 0 && (
          <div
            key={habit.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px',
              backgroundColor: 'var(--bg)',
              borderRadius: '10px',
              marginBottom: '8px'
            }}
          >
            <div>
              <span style={{ fontSize: '16px', marginRight: '8px' }}>{habit.icon}</span>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>{habit.name}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                🔥 {habit.currentStreak} day streak
              </span>
            </div>
            {tokens.grace > 0 && (
              <button
                onClick={() => handleUseGrace(habit.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid #f59e0b',
                  backgroundColor: 'transparent',
                  color: '#f59e0b',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                🕐 Use Grace
              </button>
            )}
          </div>
        )
      ))}
      
      {brokenHabits.length > 0 && tokens.recovery > 0 && (
        <div style={{ marginTop: '12px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Recently broken streaks:
          </p>
          {brokenHabits.slice(0, 2).map(habit => {
            const lastKey = Object.keys(habit.completionLog || {}).sort().pop();
            return (
              <div
                key={habit.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px',
                  backgroundColor: 'var(--bg)',
                  borderRadius: '10px',
                  marginBottom: '8px'
                }}
              >
                <div>
                  <span style={{ fontSize: '16px', marginRight: '8px' }}>{habit.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{habit.name}</span>
                </div>
                <button
                  onClick={() => handleUseRecovery(habit.id, lastKey)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #8b5cf6',
                    backgroundColor: 'transparent',
                    color: '#8b5cf6',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  💫 Recover (50 pts)
                </button>
              </div>
            );
          })}
        </div>
      )}
      
      {tokens.grace === 0 && tokens.freeze === 0 && tokens.recovery === 0 && (
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>
          💡 Complete weekly challenges to earn more tokens!
        </p>
      )}
    </motion.div>
  );
};

export default StreakRecoveryCard;