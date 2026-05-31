import { motion, AnimatePresence } from 'framer-motion';

const UpdatePrompt = ({ waitingWorker, onUpdate }) => {
  if (!waitingWorker) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 1000,
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '18px' }}>🆕</span>
        <div style={{ flex: 1 }}>
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--text)',
            }}
          >
            New version available!
          </p>
        </div>
        <button
          onClick={onUpdate}
          style={{
            padding: '6px 12px',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Update Now
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpdatePrompt;
