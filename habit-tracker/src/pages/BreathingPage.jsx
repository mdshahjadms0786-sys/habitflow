import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BreathingExercise from '../components/Focus/BreathingExercise';

const TECHNIQUES = [
  {
    id: '478',
    name: '4-7-8 Breathing',
    description: 'Reduces anxiety & helps sleep',
    icon: '😌',
    phases: [
      { label: 'Inhale', duration: 4, color: '#534AB7' },
      { label: 'Hold', duration: 7, color: '#BA7517' },
      { label: 'Exhale', duration: 8, color: '#1D9E75' }
    ],
    rounds: 4,
    benefit: 'Best for: Sleep, Anxiety relief'
  },
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Improves focus, stress relief',
    icon: '🎯',
    phases: [
      { label: 'Inhale', duration: 4, color: '#534AB7' },
      { label: 'Hold', duration: 4, color: '#BA7517' },
      { label: 'Exhale', duration: 4, color: '#1D9E75' },
      { label: 'Hold', duration: 4, color: '#E24B4A' }
    ],
    rounds: 4,
    benefit: 'Best for: Focus, Stress relief'
  },
  {
    id: 'quick',
    name: 'Quick Calm',
    description: 'Instant calm in 2 minutes',
    icon: '⚡',
    phases: [
      { label: 'Inhale', duration: 3, color: '#534AB7' },
      { label: 'Hold', duration: 3, color: '#BA7517' },
      { label: 'Exhale', duration: 6, color: '#1D9E75' }
    ],
    rounds: 3,
    benefit: 'Best for: Quick stress relief'
  }
];

const BreathingPage = () => {
  const [selected, setSelected] = useState(TECHNIQUES[0]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <div style={{ padding: '24px', paddingBottom: '80px', maxWidth: '600px', margin: '0 auto' }}>
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700 }}>
        Breathing Coach 💨
      </motion.h1>
      <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--color-text-secondary)' }}>Choose a technique and follow the circle</p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '24px'
      }}>
        {TECHNIQUES.map(t => (
          <div
            key={t.id}
            onClick={() => setSelected(t)}
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: selected.id === t.id 
                ? '2px solid #534AB7' 
                : '1px solid var(--color-border-tertiary)',
              background: selected.id === t.id 
                ? '#EEEDFE' 
                : 'var(--color-background-primary)',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{t.icon}</div>
            <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '4px' }}>
              {t.name}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              {t.description}
            </div>
            <div style={{ 
              fontSize: '11px', 
              color: '#534AB7',
              marginTop: '6px',
              fontWeight: 500
            }}>
              {t.benefit}
            </div>
          </div>
        ))}
      </div>
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={selected.id}
        style={{ background: 'var(--color-background-secondary)', borderRadius: '16px', border: '1px solid var(--color-border-tertiary)' }}>
        <BreathingExercise technique={selected.id} onComplete={() => import('react-hot-toast').then(m => m.default.success('Great job! You are calmer now 😌'))} />
      </motion.div>
    </div>
  );
};

export default BreathingPage;