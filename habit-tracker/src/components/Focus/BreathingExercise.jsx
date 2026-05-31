import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TECHNIQUE_MAP = {
  '478': { in: 4, hold: 7, out: 8, rounds: 4 },
  'box': { in: 4, hold: 4, out: 4, hold2: 4, rounds: 4 },
  'quick': { in: 3, hold: 3, out: 6, rounds: 3 }
};

const BreathingExercise = ({ technique = '478', onComplete }) => {
  const t = TECHNIQUE_MAP[technique] || TECHNIQUE_MAP['478'];
  const [phase, setPhase] = useState(0);
  const [sec, setSec] = useState(t.in);
  const [round, setRound] = useState(1);
  const [active, setActive] = useState(false);
  
  useEffect(() => {
    if (!active) return;
    if (sec > 0) { const tm = setTimeout(() => setSec(s => s - 1), 1000); return () => clearTimeout(tm); }
    if (phase === 0) setSec(t.hold || t.out);
    else if (phase === 1 && t.hold) setSec(t.out);
    else { if (round < t.rounds) { setRound(r => r + 1); setSec(t.in); setPhase(0); } else { setActive(false); onComplete?.(); } return; }
    setPhase(p => (p + 1) % 3);
  }, [active, sec, phase, t, round]);
  
  const scale = phase === 0 ? 1 + (t.in - sec) / t.in * 0.5 : phase === 1 ? 1.5 : 1 + sec / t.out * 0.5;
  const p = ['Inhale...', t.hold ? 'Hold...' : 'Exhale...', 'Exhale...'][phase];
  
  return (
    <div style={{ textAlign: 'center', padding: '24px' }}>
      <motion.div animate={{ scale }} transition={{ duration: 1 }} style={{ width: '140px', height: '140px', background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '20px', color: 'white' }}>{p}</span>
      </motion.div>
      <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px' }}>{sec}</p>
      <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>Round {round} of {t.rounds}</p>
      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActive(!active)}
        style={{ padding: '12px 32px', background: active ? '#EF4444' : '#8B5CF6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}>
        {active ? 'Stop' : 'Start'}
      </motion.button>
    </div>
  );
};

export default BreathingExercise;