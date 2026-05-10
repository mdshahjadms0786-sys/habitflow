import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FocusModeButton = ({ habitId, habitName, habitIcon, habitCategory, disabled = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (disabled) return;
    navigate(`/focus?habitId=${habitId}`);
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={handleClick}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '14px 20px',
        fontSize: '15px',
        fontWeight: '600',
        color: '#ffffff',
        background: disabled 
          ? 'rgba(139, 92, 246, 0.3)' 
          : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        border: 'none',
        borderRadius: '12px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        boxShadow: disabled ? 'none' : '0 4px 12px rgba(139, 92, 246, 0.4)',
      }}
    >
      <span style={{ fontSize: '18px' }}>🎯</span>
      <span>Focus Mode</span>
    </motion.button>
  );
};

export default FocusModeButton;