import { useState } from 'react';
import { motion } from 'framer-motion';
import { saveDiaryEntry } from '../../utils/dreamDiaryUtils';
import toast from 'react-hot-toast';

const MorningPrompt = ({ onComplete, compact = false }) => {
  const [energy, setEnergy] = useState(3);
  const [intention, setIntention] = useState('');
  const [gratitude, setGratitude] = useState('');

  const energyEmojis = ['😫', '😕', '😐', '🙂', '😊'];

  const handleSubmit = () => {
    const entry = {
      date: new Date().toISOString().split('T')[0],
      type: 'morning',
      energyLevel: energy,
      tomorrowIntent: intention,
      gratitude,
      createdAt: new Date().toISOString()
    };
    saveDiaryEntry(entry);
    if (onComplete) onComplete();
    toast.success('Good morning! Have a great day ☀️');
  };

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        onClick={handleSubmit}
        style={{
          padding: '12px 16px',
          backgroundColor: '#fef3c7',
          borderRadius: '12px',
          cursor: 'pointer',
          border: '1px solid #f59e0b'
        }}
      >
        <div style={{ fontSize: '12px', fontWeight: '600', color: '#92400e' }}>☀️ Good morning! Log your energy</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '20px',
        backgroundColor: 'var(--surface)',
        borderRadius: '16px',
        border: '1px solid var(--border)'
      }}
    >
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
        ☀️ Good morning! How are you feeling?
      </h3>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', marginBottom: '8px', color: 'var(--text-secondary)' }}>Energy Level</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {energyEmojis.map((emoji, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setEnergy(i + 1)}
              style={{
                flex: 1,
                padding: '12px',
                fontSize: '24px',
                backgroundColor: energy === i + 1 ? '#fef3c7' : 'var(--bg)',
                border: energy === i + 1 ? '2px solid #f59e0b' : '1px solid var(--border)',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              {emoji}
            </motion.button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--text-secondary)' }}>
          Today I intend to...
        </label>
        <input
          type="text"
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          placeholder="Complete my morning workout"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '14px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg)',
            color: 'var(--text)'
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--text-secondary)' }}>
          I'm grateful for...
        </label>
        <input
          type="text"
          value={gratitude}
          onChange={(e) => setGratitude(e.target.value)}
          placeholder="My health and family"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '14px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg)',
            color: 'var(--text)'
          }}
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '14px',
          fontWeight: '600',
          backgroundColor: '#f59e0b',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Start My Day ☀️
      </motion.button>
    </motion.div>
  );
};

export default MorningPrompt;