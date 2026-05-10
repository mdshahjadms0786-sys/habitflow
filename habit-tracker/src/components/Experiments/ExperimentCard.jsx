import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getExperimentProgress, saveExperimentNote } from '../../utils/experimentUtils';
import { getTodayISO } from '../../utils/dateUtils';
import toast from 'react-hot-toast';

const ExperimentCard = ({ experiment, onUpdate, onAbandon, style }) => {
  const progress = useMemo(() => getExperimentProgress(experiment), [experiment]);
  const [todayNote, setTodayNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveNote = () => {
    const today = getTodayISO();
    const updated = saveExperimentNote([experiment], experiment.id, today, todayNote);
    onUpdate(updated);
    setIsEditing(false);
    toast.success('Note saved!');
  };

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <div style={{ fontSize: '48px' }}>🧪</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: 'var(--text)' }}>
            {experiment.title}
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
            {experiment.habitName}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="var(--border)"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#534AB7"
              strokeWidth="8"
              strokeDasharray={`${(progress.percentage / 100) * 339.3} 339.3`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text)' }}>
              {progress.percentage}%
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>complete</span>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
        Day {progress.daysCompleted} of {experiment.duration}
      </div>

      {experiment.hypothesis && (
        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '8px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Hypothesis</div>
          <div style={{ fontSize: '14px', color: 'var(--text)' }}>{experiment.hypothesis}</div>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px', color: 'var(--text)' }}>
          Today's Note
        </div>
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <textarea
              value={todayNote}
              onChange={(e) => setTodayNote(e.target.value)}
              placeholder="How do you feel today?"
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '12px',
                fontSize: '14px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg)',
                color: 'var(--text)',
                resize: 'vertical'
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsEditing(false)}
                style={{
                  flex: 1,
                  padding: '8px',
                  fontSize: '13px',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveNote}
                style={{
                  flex: 1,
                  padding: '8px',
                  fontSize: '13px',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Save
              </motion.button>
            </div>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setIsEditing(true)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              backgroundColor: 'var(--bg)',
              color: 'var(--text-secondary)',
              border: '1px dashed var(--border)',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            + Add today's reflection
          </motion.button>
        )}
      </div>

      {onAbandon && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (window.confirm('Abandon this experiment? This cannot be undone.')) {
              onAbandon();
            }
          }}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '13px',
            backgroundColor: 'transparent',
            color: '#dc2626',
            border: '1px solid #dc2626',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Abandon Experiment
        </motion.button>
      )}
    </motion.div>
  );
};

export default ExperimentCard;