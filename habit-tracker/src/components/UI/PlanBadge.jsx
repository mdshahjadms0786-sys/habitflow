import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCurrentPlan, PLANS } from '../../utils/planUtils';

const PLAN_COLORS = {
  free: { bg: '#6b7280', text: '#fff' },
  pro: { bg: '#8b5cf6', text: '#fff' },
  elite: { bg: '#f59e0b', text: '#fff' }
};

const PlanBadge = ({ size = 'default', clickable = true }) => {
  const navigate = useNavigate();
  const planKey = getCurrentPlan();
  const planData = PLANS[planKey];
  const colors = PLAN_COLORS[planKey] || PLAN_COLORS.free;
  
  const sizeStyles = size === 'small' 
    ? { padding: '4px 8px', fontSize: '11px' }
    : { padding: '6px 14px', fontSize: '13px' };
  
  return (
    <motion.span
      whileHover={clickable ? { scale: 1.05 } : {}}
      whileTap={clickable ? { scale: 0.95 } : {}}
      onClick={clickable ? () => navigate('/upgrade') : undefined}
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
      {planData?.name || 'FREE'}
    </motion.span>
  );
};

export default PlanBadge;