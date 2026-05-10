import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../hooks/useHabits';
import { useMoodContext } from '../context/MoodContext';
import { calculateLifeScore } from '../utils/lifeScoreUtils';
import LifeScoreCard from '../components/Dashboard/LifeScoreCard';

const LifeScorePage = () => {
  const { habits } = useHabits();
  const { moodLog } = useMoodContext();
  const [score, setScore] = useState(null);

  useEffect(() => {
    if (habits.length > 0) setScore(calculateLifeScore(habits, moodLog));
  }, [habits, moodLog]);

  if (!score) return <div style={{ padding: '24px' }}>Loading...</div>;

  return (
    <div style={{ padding: '24px', paddingBottom: '80px', maxWidth: '600px', margin: '0 auto' }}>
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700 }}>
        Life Score 🎯
      </motion.h1>
      <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Your overall wellness across 4 dimensions</p>
      
      <LifeScoreCard habits={habits} moodLog={moodLog} compact={false} />
    </div>
  );
};

export default LifeScorePage;