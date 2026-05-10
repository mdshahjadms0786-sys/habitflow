import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BurnoutAlert from '../components/Dashboard/BurnoutAlert';
import { calculateBurnoutRisk } from '../utils/burnoutUtils';
import { useHabits } from '../hooks/useHabits';
import { useMoodContext } from '../context/MoodContext';

const BurnoutPage = () => {
  const { habits } = useHabits();
  const { moodLog } = useMoodContext();
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    setAnalysis(calculateBurnoutRisk(habits, moodLog));
  }, [habits, moodLog]);

  if (!analysis) return null;

  return (
    <div className="page-container" style={{ padding: '24px', paddingBottom: '80px' }}>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px' }}
      >
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--text)' }}>
          Wellbeing Check 🌿
        </h1>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Burnout assessment and recovery plan
        </p>
      </motion.header>

      <BurnoutAlert habits={habits} moodLog={moodLog} style={{ marginBottom: '24px' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: '24px',
          backgroundColor: 'var(--surface)',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          marginBottom: '24px'
        }}
      >
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Overall Risk: {analysis.riskScore}% ({analysis.riskLevel})</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <div style={{ height: '12px', backgroundColor: 'var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${analysis.riskScore}%` }}
              style={{
                height: '100%',
                backgroundColor: analysis.riskLevel === 'critical' ? '#dc2626' : analysis.riskLevel === 'high' ? '#f97316' : analysis.riskLevel === 'medium' ? '#f59e0b' : '#22c55e',
                borderRadius: '6px'
              }}
            />
          </div>
        </div>

        {analysis.signals.length > 0 && (
          <div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Detected Signals</h3>
            {analysis.signals.map((signal, i) => (
              <div key={i} style={{ padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '8px', marginBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '500' }}>{signal.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{signal.description}</div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          padding: '24px',
          backgroundColor: 'var(--surface)',
          borderRadius: '16px',
          border: '1px solid var(--border)'
        }}
      >
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>Recovery Plan</h2>
        {analysis.recoveryPlan.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.01 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              backgroundColor: '#dcfce7',
              borderRadius: '8px',
              marginBottom: '8px',
              border: '1px solid #22c55e'
            }}
          >
            <span style={{ fontSize: '16px' }}>✓</span>
            <span style={{ fontSize: '14px' }}>{item}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default BurnoutPage;