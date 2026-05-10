import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateNewspaper, generateNewspaperText } from '../../utils/newspaperUtils';

const NewspaperCard = ({ habits, moodLog, points, streak, compact = false, onReadFull }) => {
  const [newspaper, setNewspaper] = useState(null);

  useEffect(() => {
    setNewspaper(generateNewspaper(habits, moodLog, points, streak));
  }, [habits, moodLog, points, streak]);

  if (!newspaper) return null;

  const handleShare = () => {
    const text = generateNewspaperText(newspaper);
    navigator.clipboard.writeText(text);
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        onClick={onReadFull}
        style={{
          padding: '16px',
          backgroundColor: 'var(--surface)',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          cursor: 'pointer'
        }}
      >
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
          📰 THE DAILY HABIT TIMES
        </div>
        <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text)', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>
          {newspaper.headlines[0]}
        </div>
        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <span>✅ {newspaper.stats.habitsToday}/{newspaper.stats.totalHabits}</span>
          <span>🔥 {newspaper.stats.streak}</span>
          <span style={{ color: 'var(--primary)' }}>
            Read full edition →
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: '#faf8f5',
        color: '#1a1a1a',
        borderRadius: '4px',
        padding: '24px',
        fontFamily: 'Georgia, "Times New Roman", serif',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        margin: '0 auto'
      }}
    >
      <div style={{ textAlign: 'center', borderBottom: '3px solid #1a1a1a', paddingBottom: '16px', marginBottom: '20px' }}>
        <div style={{ fontSize: '10px', letterSpacing: '4px', marginBottom: '4px' }}>THE DAILY HABIT TIMES</div>
        <div style={{ fontSize: '24px', fontWeight: '700' }}>{newspaper.date}</div>
        <div style={{ fontSize: '12px', marginTop: '4px' }}>
          {newspaper.edition} • Edition #{newspaper.editionNumber}
        </div>
      </div>

      <div style={{ fontSize: '22px', fontWeight: '700', textAlign: 'center', marginBottom: '24px', lineHeight: '1.3' }}>
        {newspaper.headlines[0]}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '12px', backgroundColor: '#fff', border: '1px solid #ddd' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', marginBottom: '8px', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>
            MAIN STORY
          </div>
          <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
            {newspaper.articles[0]?.content}
          </div>
        </div>

        <div style={{ padding: '12px', backgroundColor: '#fff', border: '1px solid #ddd' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', marginBottom: '8px', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>
            ACHIEVEMENTS
          </div>
          <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
            {newspaper.articles[1]?.content}
          </div>
          <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#f0f0f0', fontSize: '11px', textAlign: 'center' }}>
            {newspaper.stats.points} pts | Level {newspaper.stats.level}
          </div>
        </div>

        <div style={{ padding: '12px', backgroundColor: '#fff', border: '1px solid #ddd' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', marginBottom: '8px', borderBottom: '1px solid #ddd', paddingBottom: '4px' }}>
            MOOD & TIPS
          </div>
          <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
            {newspaper.articles[2]?.content}
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', fontStyle: 'italic', color: '#666' }}>
            "{newspaper.articles[3]?.content}"
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #ddd', paddingTop: '16px', fontSize: '11px', color: '#666' }}>
        <div style={{ fontStyle: 'italic', maxWidth: '60%' }}>
          "{newspaper.quote}"
        </div>
        <div>
          {newspaper.weatherNote} | {newspaper.stats.habitsToday}/{newspaper.stats.totalHabits} habits
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'center' }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
          style={{
            padding: '8px 16px',
            fontSize: '12px',
            backgroundColor: 'transparent',
            border: '1px solid #1a1a1a',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          📋 Copy
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReadFull}
          style={{
            padding: '8px 16px',
            fontSize: '12px',
            backgroundColor: '#1a1a1a',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          Read Full →
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NewspaperCard;