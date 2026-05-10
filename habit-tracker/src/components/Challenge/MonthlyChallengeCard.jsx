import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getCurrentChallenge, calculateChallengeProgress, isChallengeCompleted, getDaysLeftInMonth } from '../../utils/challengeUtils';

const MonthlyChallengeCard = ({ habits, compact = false }) => {
  const navigate = useNavigate();
  const challenge = getCurrentChallenge();
  
  if (!challenge) {
    return null;
  }
  
  const progress = calculateChallengeProgress(challenge, habits);
  const completed = isChallengeCompleted(challenge);
  const daysLeft = getDaysLeftInMonth();
  
  const getProgressColor = () => {
    if (progress.percentage >= 75) return '#22c55e';
    if (progress.percentage >= 50) return '#EAB308';
    return '#EF4444';
  };
  
  if (completed) {
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          borderRadius: '12px',
          padding: '16px',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/challenge')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: compact ? '32px' : '40px' }}>{challenge.badge}</span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: compact ? '14px' : '16px', fontWeight: 600, color: 'white' }}>
              🎉 Challenge Complete!
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>
              You earned {challenge.badge} + {challenge.reward} pts!
            </p>
          </div>
        </div>
      </motion.div>
    );
  }
  
  if (compact) {
    return (
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: '12px',
          padding: '12px',
          border: '1px solid var(--border)',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/challenge')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{ fontSize: '24px' }}>{challenge.badge}</span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
              {challenge.name}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
              {daysLeft} days left
            </p>
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, color: getProgressColor() }}>
            {progress.percentage}%
          </span>
        </div>
        <div style={{ background: 'var(--border)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress.percentage}%` }}
            style={{ height: '100%', background: getProgressColor(), borderRadius: '4px' }}
          />
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'var(--surface)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid var(--border)',
        cursor: 'pointer',
      }}
      onClick={() => navigate('/challenge')}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <span style={{ fontSize: '48px' }}>{challenge.badge}</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            This Month
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '18px', fontWeight: 600, color: 'var(--text)' }}>
            {challenge.name}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
            {challenge.description}
          </p>
        </div>
      </div>
      
      {/* Circular Progress */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
          <svg style={{ transform: 'rotate(-90deg)', width: '120px', height: '120px' }}>
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="var(--border)"
              strokeWidth="10"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke={getProgressColor()}
              strokeWidth="10"
              strokeDasharray={`${progress.percentage * 3.27} 327`}
              strokeLinecap="round"
              initial={{ strokeDasharray: '0 327' }}
              animate={{ strokeDasharray: `${progress.percentage * 3.27} 327` }}
              transition={{ duration: 1 }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}>
            <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)' }}>
              {progress.current}/{progress.target}
            </span>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>
              {progress.percentage}%
            </p>
          </div>
        </div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
          {daysLeft} days left in {challenge.monthName}
        </p>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
          Reward: {challenge.badge} + {challenge.reward} pts
        </p>
      </div>
    </motion.div>
  );
};

export default MonthlyChallengeCard;