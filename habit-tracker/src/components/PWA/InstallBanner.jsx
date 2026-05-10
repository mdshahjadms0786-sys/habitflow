import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '../../hooks/usePWA';

const InstallBanner = ({ isInstallable, onInstall, onDismiss }) => {
  if (!isInstallable) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          position: 'fixed',
          bottom: '70px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          width: 'calc(100% - 32px)',
          maxWidth: '400px',
          background: 'linear-gradient(135deg, #534AB7 0%, #6B5DD3 100%)',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 8px 32px rgba(83, 74, 183, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            flexShrink: 0,
          }}
        >
          🎯
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              margin: 0,
              fontSize: '15px',
              fontWeight: '600',
              color: '#ffffff',
            }}
          >
            Install HabitFlow
          </h3>
          <p
            style={{
              margin: '2px 0 0 0',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.85)',
            }}
          >
            Get the full app experience — works offline!
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onInstall}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ffffff',
              color: '#534AB7',
              border: 'none',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Install
          </button>
          <button
            onClick={onDismiss}
            style={{
              width: '28px',
              height: '28px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstallBanner;
