import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePlanContext } from '../../context/PlanContext';

const LockedFeature = ({
  featureName,
  requiredPlan = 'pro',
  children,
  showLock = true,
  compact = false,
  customMessage = null,
}) => {
  const navigate = useNavigate();
  const { hasFeature, upgradeMessage, isPro, isElite, isFree } = usePlanContext();

  const unlocked = hasFeature(featureName);

  if (unlocked) {
    return <>{children}</>;
  }

  if (!showLock) {
    return null;
  }

  const planEmoji = requiredPlan === 'elite' ? '👑' : '💎';
  const planName = requiredPlan === 'elite' ? 'Elite' : 'Pro';
  const planColor = requiredPlan === 'elite' ? '#BA7517' : '#534AB7';

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => navigate('/upgrade')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px',
          background: 'var(--surface)',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        whileHover={{ scale: 1.02, borderColor: planColor }}
        whileTap={{ scale: 0.98 }}
      >
        <div style={{
          fontSize: '32px',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `${planColor}20`,
          borderRadius: '12px',
        }}>
          {planEmoji}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '13px',
            color: planColor,
            fontWeight: 600,
            marginBottom: '2px'
          }}>
            {planName} Feature
          </div>
          <div style={{
            fontSize: '14px',
            color: 'var(--text)',
            fontWeight: 500
          }}>
            {customMessage || upgradeMessage || `Unlock with ${planName}`}
          </div>
        </div>
        <div style={{
          color: planColor,
          fontSize: '20px'
        }}>
          →
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      borderRadius: '16px',
      overflow: 'hidden'
    }}>
      <div style={{ filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.5 }}>
        {children}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(0,0,0,0.85), rgba(0,0,0,0.7))',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '16px',
          backdropFilter: 'blur(4px)',
          zIndex: 10,
          padding: '24px',
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          style={{
            fontSize: '56px',
            marginBottom: '16px',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
          }}
        >
          {planEmoji}
        </motion.div>

        <h3 style={{
          color: 'white',
          marginBottom: '8px',
          fontSize: '1.4rem',
          fontWeight: 700,
          textAlign: 'center',
        }}>
          {planName} Feature Locked
        </h3>

        <p style={{
          color: 'rgba(255,255,255,0.8)',
          fontSize: '14px',
          marginBottom: '20px',
          textAlign: 'center',
          padding: '0 24px',
          maxWidth: '320px',
          lineHeight: 1.5,
        }}>
          {customMessage || upgradeMessage || `Upgrade to ${planName} to unlock this feature and take your habits to the next level!`}
        </p>

        {isFree && (
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: '16px',
          }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/upgrade')}
              style={{
                background: planColor,
                color: 'white',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '15px',
                boxShadow: `0 4px 20px ${planColor}40`,
              }}
            >
              Upgrade Now 🚀
            </motion.button>
          </div>
        )}

        {isPro && requiredPlan === 'elite' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/upgrade')}
            style={{
              background: 'linear-gradient(135deg, #BA7517, #f59e0b)',
              color: 'white',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '15px',
              boxShadow: '0 4px 20px rgba(186, 117, 23, 0.4)',
            }}
          >
            Go Elite 👑
          </motion.button>
        )}

        <div style={{
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '12px',
        }}>
          <span>Press</span>
          <kbd style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11px',
          }}>Esc</kbd>
          <span>to close</span>
        </div>
      </motion.div>
    </div>
  );
};

export default LockedFeature;