import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { calculateHabitDNA } from '../../utils/habitDnaUtils';

const HabitDNACard = ({ habits = [] }) => {
  const [dna, setDna] = useState(null);

  useEffect(() => {
    if (habits.length > 0) {
      const completionLog = {};
      habits.forEach(h => { if (h.completionLog) Object.assign(completionLog, h.completionLog); });
      setDna(calculateHabitDNA(habits, completionLog));
    }
  }, [habits]);

  if (!dna) {
    return (
      <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)' }}>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>Unlocks after 7 days of data 🌱</p>
      </div>
    );
  }

  const copyDNA = () => {
    navigator.clipboard.writeText(dna.shareText);
    import('react-hot-toast').then(m => m.default.success('DNA copied! 🧬'));
  };

  const traits = [dna.timing, dna.consistency, dna.focus, dna.intensity];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: 'var(--surface)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>Your Habit DNA 🧬</h3>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={copyDNA}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>📋</motion.button>
      </div>
      {traits.map((trait, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <span style={{ fontSize: '18px' }}>{trait.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text)', textTransform: 'capitalize' }}>{trait.label}</span>
              <span style={{ fontSize: '11px', color: '#8B5CF6' }}>{trait.score}%</span>
            </div>
            <div style={{ background: 'var(--border)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${trait.score}%` }} transition={{ duration: 0.5, delay: idx * 0.1 }}
                style={{ height: '100%', background: '#8B5CF6', borderRadius: '4px' }} />
            </div>
          </div>
        </div>
      ))}
      <div style={{ marginTop: '12px', padding: '8px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
        <code style={{ fontSize: '11px', color: '#8B5CF6', letterSpacing: '2px' }}>{dna.overallDnaCode}</code>
      </div>
    </motion.div>
  );
};

export default HabitDNACard;