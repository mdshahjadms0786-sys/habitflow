import { useState } from 'react';
import { motion } from 'framer-motion';
import ShareWidget from '../components/Widgets/ShareWidget';

const WidgetsPage = () => {
  const [selectedType, setSelectedType] = useState('streak');

  const widgetTypes = [
    { id: 'streak', name: 'Streak Card', emoji: '🔥', preview: '🔥30' },
    { id: 'achievement', name: 'Achievement', emoji: '🏆', preview: '🏆Level 5' },
    { id: 'weekly', name: 'Weekly Report', emoji: '📊', preview: '📊75%' },
    { id: 'motivational', name: 'Motivational', emoji: '💪', preview: '💪Quote' }
  ];

  return (
    <div className="page-container" style={{ padding: '24px', paddingBottom: '80px' }}>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px' }}
      >
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--text)' }}>
          Share Your Progress 🖼️
        </h1>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Generate beautiful share cards
        </p>
      </motion.header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {widgetTypes.map(w => (
          <motion.div
            key={w.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedType(w.id)}
            style={{
              padding: '16px',
              backgroundColor: selectedType === w.id ? 'var(--primary)' : 'var(--surface)',
              color: selectedType === w.id ? '#fff' : 'var(--text)',
              border: `1px solid ${selectedType === w.id ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>{w.emoji}</div>
            <div style={{ fontSize: '12px', fontWeight: '500' }}>{w.name}</div>
          </motion.div>
        ))}
      </div>

      <ShareWidget type={selectedType} />
    </div>
  );
};

export default WidgetsPage;