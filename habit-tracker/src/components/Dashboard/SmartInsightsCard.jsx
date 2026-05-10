import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateInsights } from '../../utils/insightUtils';

const SmartInsightsCard = ({ habits, moodLog }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    if (habits && habits.length > 0) {
      setInsights(generateInsights(habits, moodLog));
    }
  }, [habits, moodLog]);

  useEffect(() => {
    if (insights.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % insights.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [insights.length]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  if (!habits || habits.length === 0) {
    return (
      <div style={{
        background: 'var(--surface)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid var(--border)',
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
          Your Insights 💡
        </h3>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
          Keep going! Insights unlock after 3 days 🌱
        </p>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div style={{
        background: 'var(--surface)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid var(--border)',
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
          Your Insights 💡
        </h3>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
          Start completing habits to see insights! 🌱
        </p>
      </div>
    );
  }

  const currentInsight = insights[currentIndex];

  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid var(--border)',
      overflow: 'hidden',
    }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
        Your Insights 💡
      </h3>
      
      <div style={{ position: 'relative', minHeight: '70px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: currentInsight.color + '20',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              flexShrink: 0,
            }}>
              {currentInsight.icon}
            </div>
            
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: currentInsight.color }}>
                {currentInsight.title}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {currentInsight.message}
              </p>
            </div>
            
            <div style={{
              width: '3px',
              height: '40px',
              background: currentInsight.color,
              borderRadius: '2px',
              flexShrink: 0,
            }} />
          </motion.div>
        </AnimatePresence>
      </div>
      
      {insights.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
          {insights.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: idx === currentIndex ? currentInsight.color : 'var(--border)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.2s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartInsightsCard;