import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePlanContext } from '../../context/PlanContext';

const PLAN_COLORS = {
  free: { bg: '#6b7280', text: '#fff' },
  pro: { bg: '#8b5cf6', text: '#fff' },
  elite: { bg: '#f59e0b', text: '#fff' }
};

const PlanBadge = ({ size = 'default', clickable = true, showBadge = true }) => {
  const navigate = useNavigate();
  const { currentPlan, planData, badge, isTrialActive, trialDaysRemaining } = usePlanContext();

  const colors = PLAN_COLORS[currentPlan] || PLAN_COLORS.free;

  const sizeStyles = size === 'small'
    ? { padding: '4px 8px', fontSize: '11px' }
    : size === 'large'
    ? { padding: '10px 20px', fontSize: '16px' }
    : { padding: '6px 14px', fontSize: '13px' };

  const handleClick = () => {
    if (clickable) {
      navigate('/upgrade');
    }
  };

  return (
    <motion.div
      whileHover={clickable ? { scale: 1.05 } : {}}
      whileTap={clickable ? { scale: 0.95 } : {}}
      onClick={handleClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        borderRadius: '20px',
        backgroundColor: colors.bg,
        color: colors.text,
        fontWeight: '600',
        cursor: clickable ? 'pointer' : 'default',
        ...sizeStyles
      }}
    >
      {showBadge && <span style={{ fontSize: '0.9em' }}>{badge}</span>}
      <span>{planData?.name || 'FREE'}</span>
      {isTrialActive && (
        <span style={{
          fontSize: '10px',
          background: 'rgba(255,255,255,0.25)',
          padding: '2px 6px',
          borderRadius: '10px',
          marginLeft: '4px',
        }}>
          Trial
        </span>
      )}
    </motion.div>
  );
};

export default PlanBadge;