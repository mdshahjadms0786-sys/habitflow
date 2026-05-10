import { useState, useEffect } from 'react';

const TECHNIQUES = {
  '4-7-8': { name: '4-7-8 Relaxing', inhale: 4, hold: 7, exhale: 8, rounds: 4, benefits: 'Reduces anxiety, helps sleep' },
  'box': { name: 'Box Breathing', inhale: 4, hold: 4, exhale: 4, holdAfter: 4, rounds: 4, benefits: 'Improves focus, stress relief' },
  'quick': { name: 'Quick Calm', inhale: 3, hold: 3, exhale: 6, rounds: 3, benefits: 'Fast stress relief' }
};

export const TECHNIQUE_LIST = Object.entries(TECHNIQUES).map(([id, t]) => ({ id, ...t }));

export const useBreathing = (techniqueId = '4-7-8') => {
  const technique = TECHNIQUES[techniqueId] || TECHNIQUES['4-7-8'];
  const [phase, setPhase] = useState('inhale');
  const [round, setRound] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [count, setCount] = useState(technique.inhale);
  
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setCount(c => c > 0 ? c - 1 : {
        inhale: technique.exhale,
        hold: technique.inhale,
        exhale: technique.exhale,
        holdAfter: technique.exhale
      }[phase] || 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, phase]);
  
  const toggle = () => setIsActive(!isActive);
  return { technique, phase, round, count, isActive, toggle };
};