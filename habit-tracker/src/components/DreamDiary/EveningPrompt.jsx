import { useState } from 'react';
import { motion } from 'framer-motion';
import { saveDiaryEntry } from '../../utils/dreamDiaryUtils';
import toast from 'react-hot-toast';

const EveningPrompt = ({ onComplete, compact = false }) => {
  const [wentWell, setWentWell] = useState('');
  const [couldBeBetter, setCouldBeBetter] = useState('');
  const [tomorrowWill, setTomorrowWill] = useState('');

  const handleSubmit = () => {
    const entry = {
      date: new Date().toISOString().split('T')[0],
      type: 'evening',
      reflection: wentWell,
      tomorrowIntent: tomorrowWill,
      createdAt: new Date().toISOString()
    };
    saveDiaryEntry(entry);
    if (onComplete) onComplete();
    toast.success('Good night! Sweet dreams 🌙');
  };

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        onClick={handleSubmit}
        style={{
          padding: '12px 16px',
          backgroundColor: '#e0e7ff',
          borderRadius: '12px',
          cursor: 'pointer',
          border: '1px solid #4f46e5'
        }}
      >
        <div style={{ fontSize: '12px', fontWeight: '600', color: '#3730a3' }}>🌙 Good evening! Reflect on today</div>
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
        🌙 Good evening! How was your day?
      </h3>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--text-secondary)' }}>
          What went well today?
        </label>
        <textarea
          value={wentWell}
          onChange={(e) => setWentWell(e.target.value)}
          placeholder="Completed my morning workout"
          style={{
            width: '100%',
            minHeight: '60px',
            padding: '12px',
            fontSize: '14px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg)',
            color: 'var(--text)',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--text-secondary)' }}>
          What could be better?
        </label>
        <textarea
          value={couldBeBetter}
          onChange={(e) => setCouldBeBetter(e.target.value)}
          placeholder="Sleep earlier"
          style={{
            width: '100%',
            minHeight: '60px',
            padding: '12px',
            fontSize: '14px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg)',
            color: 'var(--text)',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', color: 'var(--text-secondary)' }}>
          Tomorrow I will...
        </label>
        <input
          type="text"
          value={tomorrowWill}
          onChange={(e) => setTomorrowWill(e.target.value)}
          placeholder="Focus on deep work"
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
          backgroundColor: '#4f46e5',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        End My Day 🌙
      </motion.button>
    </motion.div>
  );
};

export default EveningPrompt;