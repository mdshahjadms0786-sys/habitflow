import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getThisWeekSession, getWeekCoachingStats } from '../../utils/aiCoachingUtils';

const WeeklyCoachingCard = ({ habits, compact = false, onStartSession }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  
  const thisWeekSession = getThisWeekSession();
  const stats = getWeekCoachingStats(habits);
  const isCompleted = !!thisWeekSession;
  
  if (compact) {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '24px' }}>🤖</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>Weekly Coaching</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {isCompleted ? '✅ Completed' : `${stats.percentage}% this week`}
            </div>
          </div>
          {isCompleted ? (
            <span style={{ fontSize: '12px', color: '#22c55e' }}>✓</span>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStartSession || (() => navigate('/ai-coaching'))}
              style={{
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Start
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid var(--border)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>
            Weekly Coaching Session 🤖
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div style={{
          padding: '8px 16px',
          borderRadius: '20px',
          backgroundColor: isCompleted ? 'rgba(34, 197, 94, 0.1)' : 'rgba(99, 102, 241, 0.1)',
          color: isCompleted ? '#22c55e' : 'var(--primary)',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          {isCompleted ? '✅ Completed' : 'Ready for review'}
        </div>
      </div>
      
      {!isCompleted ? (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: 'var(--bg)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>{stats.percentage}%</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Completion</div>
            </div>
            <div style={{ backgroundColor: 'var(--bg)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>🔥</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Streak</div>
            </div>
            <div style={{ backgroundColor: 'var(--bg)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>💡</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Ready</div>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartSession || (() => navigate('/ai-coaching'))}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
          >
            Start Session →
          </motion.button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '12px' }}>
            <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
              {thisWeekSession?.aiResponse?.substring(0, 150)}...
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} style={{ fontSize: '16px', color: star <= (thisWeekSession?.userRating || 0) ? '#FFD700' : 'var(--border)' }}>
                  ★
                </span>
              ))}
            </div>
            <button
              onClick={() => navigate('/ai-coaching')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              View Full Session →
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WeeklyCoachingCard;