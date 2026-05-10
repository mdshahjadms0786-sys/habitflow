import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DURATION_OPTIONS, createExperiment } from '../../utils/experimentUtils';
import toast from 'react-hot-toast';

const StartExperimentModal = ({ isOpen, onClose, habit, onSave }) => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(30);
  const [hypothesis, setHypothesis] = useState('');
  const [beforeState, setBeforeState] = useState('');

  useEffect(() => {
    if (habit) {
      setTitle(`${duration} Days ${habit.name}`);
    }
  }, [habit, duration]);

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const experiment = createExperiment({
      title: title.trim(),
      habitId: habit.id,
      habitName: habit.name,
      duration,
      hypothesis: hypothesis.trim(),
      beforeState: beforeState.trim()
    });

    onSave(experiment);
    onClose();
    toast.success('Experiment started! 🔬');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '16px',
            padding: '24px',
            width: '100%',
            maxWidth: '450px'
          }}
        >
          <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: 'var(--text)', textAlign: 'center' }}>
            🔬 Start New Experiment
          </h2>

          <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '20px' }}>🧪</div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text)' }}>
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`${duration} Days ${habit?.name || 'Habit'}`}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg)',
                color: 'var(--text)'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text)' }}>
              Duration
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {DURATION_OPTIONS.map(opt => (
                <motion.button
                  key={opt.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDuration(opt.value)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    backgroundColor: duration === opt.value ? '#534AB7' : 'var(--bg)',
                    color: duration === opt.value ? '#fff' : 'var(--text)',
                    border: `1px solid ${duration === opt.value ? '#534AB7' : 'var(--border)'}`,
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  {opt.label}
                </motion.button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text)' }}>
              Hypothesis: "I think this will..."
            </label>
            <textarea
              value={hypothesis}
              onChange={(e) => setHypothesis(e.target.value)}
              placeholder="...improve my energy levels"
              style={{
                width: '100%',
                minHeight: '60px',
                padding: '12px',
                fontSize: '14px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg)',
                color: 'var(--text)',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text)' }}>
              Before State: "Currently I feel..."
            </label>
            <textarea
              value={beforeState}
              onChange={(e) => setBeforeState(e.target.value)}
              placeholder="...tired in the mornings"
              style={{
                width: '100%',
                minHeight: '60px',
                padding: '12px',
                fontSize: '14px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg)',
                color: 'var(--text)',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                fontSize: '14px',
                backgroundColor: 'var(--bg)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              style={{
                flex: 1,
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: '#534AB7',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Start 🔬
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StartExperimentModal;