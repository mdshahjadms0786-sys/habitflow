import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HelpButton = () => {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);
  
  const quickTips = [
    'Press ? for help',
    'Press A to add habit',
    'Press D for dashboard',
    'Press F for focus mode'
  ];
  
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'calc(80px + env(safe-area-inset-bottom) + 16px)',
        right: '24px',
        zIndex: 100
      }}
    >
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              maxWidth: '200px'
            }}
          >
            <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
              Quick Tips
            </h4>
            <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
              {quickTips.map((tip, idx) => (
                <li
                  key={idx}
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    padding: '4px 0'
                  }}
                >
                  {tip}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/help')}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: 'var(--primary)',
          color: '#fff',
          fontSize: '20px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}
      >
        ?
      </motion.button>
    </div>
  );
};

export default HelpButton;