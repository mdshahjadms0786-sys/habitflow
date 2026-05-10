import { motion } from 'framer-motion';
import { calculateBurnoutRisk } from '../../utils/burnoutUtils';

const BurnoutAlert = ({ habits, moodLog, onViewFull, style }) => {
  const { riskLevel, riskScore, signals, message } = calculateBurnoutRisk(habits, moodLog);

  if (riskLevel === 'low') return null;

  const alertColors = {
    medium: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
    high: { bg: '#fed7aa', border: '#ea580c', text: '#9a3412' },
    critical: { bg: '#fecaca', border: '#dc2626', text: '#991b1b' }
  };

  const colors = alertColors[riskLevel] || alertColors.medium;
  const alertEmoji = riskLevel === 'critical' ? '🆘' : riskLevel === 'high' ? '🚨' : '⚠️';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '16px',
        backgroundColor: colors.bg,
        borderRadius: '12px',
        border: `2px solid ${colors.border}`,
        ...style
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '20px' }}>{alertEmoji}</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: colors.text }}>
              {riskLevel === 'critical' ? 'Critical Burnout Risk' : riskLevel === 'high' ? 'Burnout Risk Detected' : 'Watch Out'}
            </span>
          </div>
          <p style={{ fontSize: '13px', margin: 0, color: colors.text }}>{message}</p>
          
          <div style={{ fontSize: '11px', marginTop: '8px', color: colors.text }}>
            Risk Level: <strong>{riskScore}%</strong>
          </div>
        </div>
        
        {onViewFull && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewFull}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              backgroundColor: colors.text,
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Details
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default BurnoutAlert;