import { motion } from 'framer-motion';
import { useTimerContext } from '../../context/TimerContext';
import toast from 'react-hot-toast';

const StartTimerButton = ({ habitId, habitName, habitIcon }) => {
  const { activeHabitId, startTimer } = useTimerContext();

  const isActive = activeHabitId === habitId;
  const isAnotherRunning = activeHabitId !== null && activeHabitId !== habitId;

  const handleStart = () => {
    if (isAnotherRunning) {
      toast.error('Another timer is already running!');
      return;
    }
    startTimer(habitId, habitName, habitIcon);
    toast.success(`⏱ Focus session started: ${habitName}`);
  };

  if (isActive) return null;

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleStart}
      disabled={isAnotherRunning}
      title={isAnotherRunning ? 'Timer active for another habit' : 'Start 25min focus session'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '8px 16px',
        backgroundColor: isAnotherRunning ? 'var(--border)' : 'var(--primary)',
        color: isAnotherRunning ? 'var(--text-secondary)' : '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: isAnotherRunning ? 'not-allowed' : 'pointer',
        opacity: isAnotherRunning ? 0.6 : 1,
        width: '100%',
      }}
    >
      ⏱ {isAnotherRunning ? 'Timer Active' : 'Focus'}
    </motion.button>
  );
};

export default StartTimerButton;
