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

  if (!score || score.overall === 0) return (
    <div style={{ padding: '24px', paddingBottom: '80px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700 }}>
        Life Score 🎯
      </motion.h1>
      <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>Your overall wellness across 4 dimensions</p>
      <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '40px', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎯</div>
        <h3 style={{ margin: '0 0 8px 0' }}>No Data Yet</h3>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Complete some habits to see your Life Score!</p>
      </div>
    </div>
  );

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