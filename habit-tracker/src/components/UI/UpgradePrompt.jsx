import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlanContext } from '../../context/PlanContext';

const UpgradePrompt = ({
  feature,
  message,
  type = 'banner',
  position = 'bottom',
  showDismiss = true,
}) => {
  const navigate = useNavigate();
  const { hasFeature, isFree, isPro, upgrade } = usePlanContext();
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (hasFeature(feature)) {
      setVisible(false);
    }
  }, [feature, hasFeature]);

  useEffect(() => {
    const dismissedKey = `ht_upgrade_dismissed_${feature}`;
    if (localStorage.getItem(dismissedKey)) {
      setDismissed(true);
    }
  }, [feature]);

  const handleDismiss = () => {
    const dismissedKey = `ht_upgrade_dismissed_${feature}`;
    localStorage.setItem(dismissedKey, 'true');
    setDismissed(true);
    setVisible(false);
  };

  const handleUpgrade = (planId) => {
    upgrade(planId);
    setVisible(false);
  };

  if (!visible || dismissed || hasFeature(feature)) {
    return null;
  }

  const planName = feature.includes('Elite') || feature.includes('elite') ? 'Elite' : 'Pro';
  const planColor = planName === 'Elite' ? '#BA7517' : '#534AB7';

  if (type === 'inline') {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        style={{
          background: `linear-gradient(135deg, ${planColor}15, ${planColor}05)`,
          border: `1px solid ${planColor}30`,
          borderRadius: '12px',
          padding: '16px',
          marginTop: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '28px' }}>
            {planName === 'Elite' ? '👑' : '💎'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>
              {planName} Feature
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {message || `Upgrade to ${planName} to unlock this feature`}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/upgrade')}
            style={{
              background: planColor,
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '13px',
            }}
          >
            Upgrade
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (type === 'banner') {
    return (
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: position === 'top' ? 'fixed' : 'relative',
              top: position === 'top' ? '0' : 'auto',
              left: 0,
              right: 0,
              zIndex: 1000,
              background: `linear-gradient(135deg, ${planColor}, ${planColor}dd)`,
              color: 'white',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <span style={{ fontSize: '20px' }}>
                {planName === 'Elite' ? '👑' : '💎'}
              </span>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>
                {message || `Unlock ${feature} with ${planName}!`}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/upgrade')}
                style={{
                  background: 'white',
                  color: planColor,
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '13px',
                }}
              >
                Upgrade Now
              </motion.button>
              {showDismiss && (
                <button
                  onClick={handleDismiss}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    padding: '8px',
                    fontSize: '18px',
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return null;
};

export default UpgradePrompt;