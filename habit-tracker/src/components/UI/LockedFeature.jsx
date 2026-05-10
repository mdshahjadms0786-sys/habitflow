import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { hasFeature } from '../../utils/planUtils';

const LockedFeature = ({ featureName, requiredPlan = 'pro', children, showLock = true }) => {
  const navigate = useNavigate();
  const unlocked = hasFeature(featureName);
  
  if (unlocked) {
    return <>{children}</>;
  }
  
  if (!showLock) {
    return null;
  }
  
  return (
    <div style={{
      position: 'relative',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      {/* Blurred preview of content */}
      <div style={{ filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none' }}>
        {children}
      </div>
      
      {/* Lock overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px',
        backdropFilter: 'blur(2px)',
        zIndex: 10
      }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>
          {requiredPlan === 'elite' ? '👑' : '💎'}
        </div>
        <h3 style={{ color: 'white', marginBottom: '8px', fontSize: '1.2rem', fontWeight: 600 }}>
          {requiredPlan === 'elite' ? 'Elite' : 'Pro'} Feature
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', marginBottom: '16px', textAlign: 'center', padding: '0 16px', maxWidth: '300px' }}>
          Upgrade to {requiredPlan === 'elite' ? 'Elite' : 'Pro'} to unlock this feature
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/upgrade')}
          style={{
            background: requiredPlan === 'elite' ? '#BA7517' : '#534AB7',
            color: 'white',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 500,
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
          }}
        >
          Upgrade Now →
        </motion.button>
      </div>
    </div>
  );
};

export default LockedFeature;