import { motion, AnimatePresence } from 'framer-motion';

const OfflineBanner = ({ isOffline }) => {
  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            backgroundColor: '#f59e0b',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '14px' }}>📡</span>
          <span
            style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#ffffff',
            }}
          >
            You are offline — changes will be saved locally
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineBanner;
