import { motion } from 'framer-motion';
import { getHabitProgression, getCurrentLevel } from '../../utils/progressionUtils';

const ProgressionBadge = ({ habit, onClick, style }) => {
  const progression = getHabitProgression(habit.name);
  if (!progression) return null;
  
  const current = getCurrentLevel(habit, progression);
  if (!current) return null;

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        backgroundColor: '#534AB730',
        borderRadius: '12px',
        fontSize: '10px',
        fontWeight: '500',
        color: '#534AB7',
        cursor: 'pointer',
        ...style
      }}
    >
      Lv{current.level}
    </motion.span>
  );
};

export default ProgressionBadge;