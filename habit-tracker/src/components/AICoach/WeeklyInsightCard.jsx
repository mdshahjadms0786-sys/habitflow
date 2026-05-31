import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getCompletion } from '../../utils/ollamaService';
import { analyzeWeeklyHabits } from '../../utils/aiCoachUtils';

const STORAGE_KEY = 'ht_ai_insight';

const WeeklyInsightCard = ({ habits, moodLog }) => {
  const [insight, setInsight] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [lastGenerated, setLastGenerated] = useState(null);
  const fetchedRef = useRef(false);
  const habitsRef = useRef(habits);
  const moodLogRef = useRef(moodLog);

  habitsRef.current = habits;
  moodLogRef.current = moodLog;

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { insight: savedInsight, timestamp } = JSON.parse(saved);
        const savedDate = new Date(timestamp);
        const now = new Date();
        const daysDiff = (now - savedDate) / (1000 * 60 * 60 * 24);
        if (daysDiff < 7 && savedInsight) {
          setInsight(savedInsight);
          setLastGenerated(timestamp);
          setIsLoading(false);
          return;
        }
      } catch {}
    }

    const doFetch = async () => {
      setIsLoading(true);
      try {
        const prompt = analyzeWeeklyHabits(habitsRef.current, moodLogRef.current);
        const response = await getCompletion(prompt);
        if (response) {
          const timestamp = new Date().toISOString();
          setInsight(response);
          setLastGenerated(timestamp);
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ insight: response, timestamp }));
        } else {
          setInsight('Could not generate insight. Try again later.');
        }
      } catch {
        setInsight('Error generating insight.');
      } finally {
        setIsLoading(false);
      }
    };

    doFetch();
  }, []);

  const handleRegenerate = async () => {
    setIsLoading(true);
    try {
      const prompt = analyzeWeeklyHabits(habitsRef.current, moodLogRef.current);
      const response = await getCompletion(prompt);
      if (response) {
        const timestamp = new Date().toISOString();
        setInsight(response);
        setLastGenerated(timestamp);
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ insight: response, timestamp }));
      } else {
        setInsight('Could not generate insight. Try again later.');
      }
    } catch {
      setInsight('Error generating insight.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '24px' }}>🧠</span>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
            AI Weekly Insight
          </h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ height: '14px', backgroundColor: 'var(--bg)', borderRadius: '4px', width: '90%', opacity: 0.5 }} />
          <div style={{ height: '14px', backgroundColor: 'var(--bg)', borderRadius: '4px', width: '75%', opacity: 0.5 }} />
          <div style={{ height: '14px', backgroundColor: 'var(--bg)', borderRadius: '4px', width: '60%', opacity: 0.5 }} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid var(--border)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <span style={{ fontSize: '24px' }}>🧠</span>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
          AI Weekly Insight
        </h3>
      </div>

      <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: 'var(--text)', lineHeight: 1.5 }}>
        {insight}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          {lastGenerated && `Gemini AI • ${formatDate(lastGenerated)}`}
        </span>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRegenerate}
          disabled={isLoading}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg)',
            color: 'var(--text)',
            fontSize: '12px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          Regenerate 🔄
        </motion.button>
      </div>
    </motion.div>
  );
};

export default WeeklyInsightCard;