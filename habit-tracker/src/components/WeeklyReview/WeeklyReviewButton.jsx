import { useState } from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../../hooks/useHabits';
import { useMoodContext } from '../../context/MoodContext';
import WeeklyReviewModal from './WeeklyReviewModal';
import { generateWeeklyReport } from '../../utils/weeklyReviewUtils';

const WeeklyReviewButton = () => {
  const [showModal, setShowModal] = useState(false);
  const { habits } = useHabits();
  const { moodLog } = useMoodContext();

  const report = generateWeeklyReport(habits, moodLog || {});

  if (!report) {
    return (
      <div
        style={{
          padding: '16px',
          backgroundColor: 'var(--bg)',
          borderRadius: '8px',
          fontSize: '13px',
          color: 'var(--text-secondary)',
          textAlign: 'center',
        }}
      >
        No habit data for weekly review yet.
      </div>
    );
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowModal(true)}
        style={{
          width: '100%',
          padding: '14px 20px',
          backgroundColor: 'var(--primary)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '10px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        📋 View Weekly Review
      </motion.button>

      {showModal && (
        <WeeklyReviewModal
          report={report}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default WeeklyReviewButton;
