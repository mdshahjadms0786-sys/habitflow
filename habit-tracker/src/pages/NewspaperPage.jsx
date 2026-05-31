import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NewspaperCard from '../components/Newspaper/NewspaperCard';
import { generateNewspaper } from '../utils/newspaperUtils';
import { useHabits } from '../hooks/useHabits';
import { useMoodContext } from '../context/MoodContext';
import { getTotalPoints } from '../utils/pointsUtils';

const STORAGE_KEY = 'ht_newspapers';

const NewspaperPage = () => {
  const { habits } = useHabits();
  const { moodLog } = useMoodContext();
  const navigate = useNavigate();
  const [currentNewspaper, setCurrentNewspaper] = useState(null);
  const [pastNewspapers, setPastNewspapers] = useState([]);

  useEffect(() => {
    const points = getTotalPoints();
    const totalStreak = Math.max(...habits.map(h => h.currentStreak || 0), 0);
    setCurrentNewspaper(generateNewspaper(habits, moodLog, points, totalStreak));
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setPastNewspapers(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load past newspapers', e);
    }
  }, [habits, moodLog]);

  const saveToday = () => {
    if (currentNewspaper) {
      const updated = [{ date: currentNewspaper.date, headline: currentNewspaper.headlines[0], ...currentNewspaper }];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 7)));
      } catch (e) {
        console.error('Failed to save newspaper', e);
      }
    }
  };

  const compactNewspapers = pastNewspapers.slice(0, 7);

  return (
    <div className="page-container" style={{ padding: '24px', paddingBottom: '80px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <NewspaperCard 
          habits={habits} 
          moodLog={moodLog} 
          points={getTotalPoints()} 
          streak={Math.max(...habits.map(h => h.currentStreak || 0), 0)}
          onReadFull={() => {}}
        />
      </motion.div>

      {compactNewspapers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginTop: '32px' }}
        >
          <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: 'var(--text)' }}>
            Previous Editions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {compactNewspapers.map((paper, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.01 }}
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'var(--surface)',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{paper.date}</div>
                <div style={{ fontSize: '14px', color: 'var(--text)', fontWeight: '500' }}>{paper.headline}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default NewspaperPage;