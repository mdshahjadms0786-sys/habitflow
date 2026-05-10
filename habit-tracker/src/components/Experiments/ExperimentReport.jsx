import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { generateExperimentReport, getExperimentProgress } from '../../utils/experimentUtils';

const ExperimentReport = ({ experiment, habits, onRate, onStartNew, onShare, style }) => {
  const progress = useMemo(() => getExperimentProgress(experiment), [experiment]);
  const report = useMemo(() => generateExperimentReport(experiment, habits), [experiment, habits]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '24px',
        backgroundColor: 'var(--surface)',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        ...style
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--text)' }}>
          Experiment Complete!
        </h2>
        <p style={{ margin: '8px 0 0 0', fontSize: '16px', color: 'var(--text-secondary)' }}>
          {experiment.title}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '24px'
        }}
      >
        <div style={{ padding: '16px', backgroundColor: 'var(--bg)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text)' }}>{report.duration}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Days</div>
        </div>
        <div style={{ padding: '16px', backgroundColor: 'var(--bg)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#22c55e' }}>{report.completionRate}%</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Completion</div>
        </div>
      </div>

      {experiment.hypothesis && (
        <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: '#EEEDFE', borderRadius: '12px', borderLeft: '3px solid #534AB7' }}>
          <div style={{ fontSize: '12px', color: '#534AB7', marginBottom: '4px' }}>Hypothesis</div>
          <div style={{ fontSize: '14px', color: 'var(--text)' }}>{experiment.hypothesis}</div>
        </div>
      )}

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
          Did it work?
        </h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          {[
            { emoji: '👍', label: 'Positive', value: 'positive' },
            { emoji: '😐', label: 'Neutral', value: 'neutral' },
            { emoji: '👎', label: 'Negative', value: 'negative' }
          ].map(opt => (
            <motion.button
              key={opt.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onRate && onRate(opt.value)}
              style={{
                flex: 1,
                padding: '16px',
                fontSize: '24px',
                backgroundColor: experiment.result === opt.value ? 'var(--primary)' : 'var(--bg)',
                color: experiment.result === opt.value ? '#fff' : 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
            >
              {opt.emoji}
            </motion.button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        {onStartNew && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartNew}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '14px',
              fontWeight: '600',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Start another
          </motion.button>
        )}
        {onShare && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onShare}
            style={{
              padding: '12px',
              fontSize: '14px',
              backgroundColor: 'var(--bg)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            📤 Share
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default ExperimentReport;