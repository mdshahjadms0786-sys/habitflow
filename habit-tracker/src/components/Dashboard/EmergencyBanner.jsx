import { motion } from 'framer-motion';

const EmergencyBanner = ({ onDeactivate, style }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '12px 16px',
        backgroundColor: '#fef2f2',
        borderBottom: '2px solid #dc2626',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...style
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '20px' }}>🆘</span>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#dc2626' }}>
            Emergency Mode Active
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Showing only your 3 most critical habits • Focus on what matters most today 💪
          </div>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onDeactivate}
        style={{
          padding: '6px 12px',
          fontSize: '12px',
          backgroundColor: 'transparent',
          color: '#dc2626',
          border: '1px solid #dc2626',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        Deactivate
      </motion.button>
    </motion.div>
  );
};

export default EmergencyBanner;