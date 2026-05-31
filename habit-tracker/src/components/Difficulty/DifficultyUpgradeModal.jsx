import { motion, AnimatePresence } from 'framer-motion';
import { getDifficultyLevel, getNextDifficulty, dismissUpgradeSuggestion } from '../../utils/difficultyUtils';

const DifficultyUpgradeModal = ({ isOpen, habit, onUpgrade, onKeep }) => {
  if (!isOpen || !habit) return null;
  
  const currentLevel = getDifficultyLevel(habit.difficulty || 'medium');
  const nextDifficulty = getNextDifficulty(habit.difficulty || 'medium');
  const nextLevel = getDifficultyLevel(nextDifficulty);
  
  const handleUpgrade = () => {
    dismissUpgradeSuggestion(habit.id);
    onUpgrade(nextDifficulty);
  };
  
  const handleKeep = () => {
    dismissUpgradeSuggestion(habit.id);
    onKeep();
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '360px',
            width: '100%',
            textAlign: 'center',
            border: '1px solid var(--border)',
          }}
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}
          >
            🚀
          </motion.span>
          
          <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '700', color: 'var(--text)' }}>
            Level Up!
          </h2>
          
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
            You've completed <strong>{habit.name}</strong> 100% this week! Ready for a bigger challenge?
          </p>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '12px',
            marginBottom: '20px',
            padding: '12px',
            backgroundColor: 'var(--bg)',
            borderRadius: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '24px' }}>{currentLevel.emoji}</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: currentLevel.color }}>
                {currentLevel.label}
              </span>
            </div>
            <span style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>→</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '24px' }}>{nextLevel.emoji}</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: nextLevel.color }}>
                {nextLevel.label}
              </span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            <button
              onClick={handleUpgrade}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#fff',
                backgroundColor: nextLevel.color,
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              Upgrade to {nextLevel.label} ⬆️
            </button>
            <button
              onClick={handleKeep}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text)',
                backgroundColor: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              Keep as {currentLevel.label}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DifficultyUpgradeModal;