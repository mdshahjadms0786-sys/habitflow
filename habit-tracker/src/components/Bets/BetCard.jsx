import { motion } from 'framer-motion';
import { calculateBetProgress } from '../../utils/bettingUtils';

const BetCard = ({ bet, completionLog, onAbort, style }) => {
  const { daysCompleted, totalDays, currentRate, projected } = calculateBetProgress(bet, completionLog);
  
  const statusColor = projected === 'on track' ? '#22c55e' : projected === 'at risk' ? '#f59e0b' : '#dc2626';
  const statusIcon = projected === 'on track' ? '🟢' : projected === 'at risk' ? '🟡' : '🔴';
  const statusText = projected === 'on track' ? 'On Track' : projected === 'at risk' ? 'At Risk' : 'Failing';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '16px',
        backgroundColor: 'var(--surface)',
        borderRadius: '12px',
        border: `1px solid var(--border)`,
        ...style
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <span style={{ fontSize: '28px' }}>{bet.habitIcon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>{bet.habitName}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Day {daysCompleted} of {totalDays}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: statusColor }}>{statusIcon}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{statusText}</div>
        </div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
          <span style={{ fontWeight: '500' }}>{currentRate}% / {bet.targetCompletionRate}%</span>
        </div>
        <div style={{ height: '6px', backgroundColor: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(currentRate, 100)}%` }}
            style={{
              height: '100%',
              backgroundColor: statusColor,
              borderRadius: '3px'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '12px' }}>
        <div>
          <span style={{ color: 'var(--text-secondary)' }}>At stake: </span>
          <span style={{ fontWeight: '600', color: '#dc2626' }}>{bet.betAmount} pts</span>
        </div>
        <div>
          <span style={{ color: 'var(--text-secondary)' }}>Reward: </span>
          <span style={{ fontWeight: '600', color: '#22c55e' }}>+{bet.reward} pts</span>
        </div>
      </div>

      {onAbort && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAbort}
          style={{
            width: '100%',
            padding: '8px',
            fontSize: '12px',
            backgroundColor: 'transparent',
            color: '#dc2626',
            border: '1px solid #dc2626',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Abort Bet
        </motion.button>
      )}
    </motion.div>
  );
};

export default BetCard;