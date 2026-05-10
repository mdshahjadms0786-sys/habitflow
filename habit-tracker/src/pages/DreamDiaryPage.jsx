import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MorningPrompt from '../components/DreamDiary/MorningPrompt';
import EveningPrompt from '../components/DreamDiary/EveningPrompt';
import { loadDiaryEntries, getPatterns, getTodayEntries } from '../utils/dreamDiaryUtils';

const DreamDiaryPage = () => {
  const [entries, setEntries] = useState([]);
  const [showMorning, setShowMorning] = useState(false);
  const [showEvening, setShowEvening] = useState(false);

  useEffect(() => {
    setEntries(loadDiaryEntries());
    
    const todayEntries = getTodayEntries();
    if (!todayEntries.morning) setShowMorning(true);
    if (!todayEntries.evening) setShowEvening(true);
  }, []);

  const patterns = getPatterns(entries);

  return (
    <div className="page-container" style={{ padding: '24px', paddingBottom: '80px' }}>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px' }}
      >
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--text)' }}>
          Dream Diary 💭
        </h1>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Reflect on your days and discover patterns
        </p>
      </motion.header>

      {showMorning && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '24px' }}>
          <MorningPrompt onComplete={() => setShowMorning(false)} />
        </motion.div>
      )}

      {showEvening && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '24px' }}>
          <EveningPrompt onComplete={() => setShowEvening(false)} />
        </motion.div>
      )}

      {patterns && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '20px',
            backgroundColor: 'var(--surface)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            marginBottom: '24px'
          }}
        >
          <h2 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>Energy Patterns</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>{patterns.highEnergyDays}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>High Energy Days</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>{patterns.lowEnergyDays}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Low Energy Days</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700' }}>{patterns.averageEnergy}/5</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Average Energy</div>
            </div>
          </div>
        </motion.div>
      )}

      {entries.length > 0 && (
        <div>
          <h2 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>Past Entries</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {entries.slice(0, 10).map((entry, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.01 }}
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'var(--surface)',
                  borderRadius: '8px',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{entry.date} • {entry.type}</div>
                <div style={{ fontSize: '14px', marginTop: '4px' }}>
                  {entry.type === 'morning' ? entry.tomorrowIntent || entry.gratitude : entry.tomorrowIntent || entry.reflection}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DreamDiaryPage;