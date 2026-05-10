import { motion, AnimatePresence } from 'framer-motion';
import { getHabitProgression, getCurrentLevel, getNextLevel } from '../../utils/progressionUtils';

const ProgressionModal = ({ habit, isOpen, onClose, style }) => {
  const progression = getHabitProgression(habit?.name);
  const current = getCurrentLevel(habit, progression);
  const next = getNextLevel(habit, progression);

  if (!isOpen || !progression) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          onClick={(e) => e.stopPropagation()}
          style={{ backgroundColor: 'var(--surface)', borderRadius: '16px', padding: '24px', width: '90%', maxWidth: '400px', ...style }}
        >
          <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>{habit?.name} Progress</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {progression.map((level, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: current?.level === level.level ? '#534AB7' : current?.level > level.level ? '#dcfce7' : 'var(--bg)',
                  border: current?.level === level.level ? '2px solid #534AB7' : '1px solid var(--border)',
                  borderRadius: '8px',
                  opacity: current?.level >= level.level ? 1 : 0.5
                }}
              >
                <span style={{ fontSize: '20px' }}>{current?.level > level.level ? '✓' : level.level}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: current?.level === level.level ? '#fff' : 'var(--text)' }}>{level.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{level.target}</div>
                </div>
              </div>
            ))}
          </div>
          
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClose} style={{ marginTop: '16px', width: '100%', padding: '12px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Close
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProgressionModal;