import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PAUSE_REASONS, getPauseCost } from '../../utils/pauseUtils';
import toast from 'react-hot-toast';

const PauseModal = ({ habit, isOpen, onClose, onPause }) => {
  const [selectedReason, setSelectedReason] = useState(null);
  const [resumeDate, setResumeDate] = useState(null);
  const [customDays, setCustomDays] = useState(7);

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const max = new Date();
    max.setDate(max.getDate() + 30);
    return max.toISOString().split('T')[0];
  };

  const handleQuickDuration = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    setResumeDate(date.toISOString().split('T')[0]);
    setCustomDays(days);
  };

  const calculateTotalDays = () => {
    if (!resumeDate) return customDays;
    const start = new Date();
    const end = new Date(resumeDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const totalDays = calculateTotalDays();
  const cost = getPauseCost(totalDays);
  const canPause = selectedReason && totalDays > 0;

  const handlePause = () => {
    if (!canPause) return;
    
    if (cost.totalCost > 0) {
      // Could add point deduction logic here
    }
    
    onPause({
      habitId: habit.id,
      pausedUntil: resumeDate || new Date(Date.now() + totalDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      pauseReason: selectedReason,
      pausedAt: new Date().toISOString()
    });
    
    toast.success(`Habit paused until ${resumeDate || 'then'} 🏖️`);
    handleClose();
  };

  const handleClose = () => {
    setSelectedReason(null);
    setResumeDate(null);
    setCustomDays(7);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '20px',
            padding: '24px',
            width: '100%',
            maxWidth: '420px',
            maxHeight: '85vh',
            overflow: 'auto',
          }}
        >
          <h2 style={{ margin: '0 0 20px 0', color: 'white', fontSize: '18px' }}>
            Pause "{habit?.name}" 🏖️
          </h2>

          {/* Reason Selector */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ margin: '0 0 10px 0', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Select a reason:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {PAUSE_REASONS.map((reason) => (
                <motion.button
                  key={reason.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedReason(reason.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px',
                    background: selectedReason === reason.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)',
                    border: selectedReason === reason.id ? '2px solid #6366F1' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '13px',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{reason.icon}</span>
                  <span>{reason.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ margin: '0 0 10px 0', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>Resume on:</p>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickDuration(3)}
                style={{
                  padding: '8px 12px',
                  background: customDays === 3 ? '#6366F1' : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                3 days
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickDuration(7)}
                style={{
                  padding: '8px 12px',
                  background: customDays === 7 ? '#6366F1' : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                1 week
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickDuration(14)}
                style={{
                  padding: '8px 12px',
                  background: customDays === 14 ? '#6366F1' : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                2 weeks
              </motion.button>
              <input
                type="date"
                min={getMinDate()}
                max={getMaxDate()}
                value={resumeDate || ''}
                onChange={(e) => {
                  setResumeDate(e.target.value);
                  if (e.target.value) {
                    const days = Math.ceil((new Date(e.target.value) - new Date()) / (1000 * 60 * 60 * 24)) + 1;
                    setCustomDays(days);
                  }
                }}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '12px',
                }}
              />
            </div>
          </div>

          {/* Cost Preview */}
          <div style={{ 
            marginBottom: '16px', 
            padding: '12px', 
            borderRadius: '10px',
            background: cost.totalCost === 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
            border: `1px solid ${cost.totalCost === 0 ? '#22c55e' : '#EAB308'}`
          }}>
            {cost.totalCost === 0 ? (
              <p style={{ margin: 0, color: '#22c55e', fontSize: '13px' }}>✅ Free — streak protected!</p>
            ) : (
              <p style={{ margin: 0, color: '#EAB308', fontSize: '13px' }}>
                ⚠️ Extra days cost 50 pts/day. Total: {cost.totalCost} pts
              </p>
            )}
          </div>

          {/* Info Box */}
          <div style={{ 
            marginBottom: '20px', 
            padding: '12px', 
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <p style={{ margin: '0 0 8px 0', color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 600 }}>During pause:</p>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
              <p style={{ margin: '0 0 4px 0' }}>✅ Streak will be protected</p>
              <p style={{ margin: '0 0 4px 0' }}>✅ Habit hidden from daily view</p>
              <p style={{ margin: '0 0 4px 0', color: '#EF4444' }}>❌ No points earned</p>
              <p style={{ margin: 0, color: '#EF4444' }}>❌ No completions tracked</p>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleClose}
              style={{
                flex: 1,
                padding: '12px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: canPause ? 1.02 : 1 }}
              whileTap={{ scale: canPause ? 0.98 : 1 }}
              onClick={handlePause}
              disabled={!canPause}
              style={{
                flex: 1,
                padding: '12px',
                background: canPause ? '#6366F1' : 'rgba(99, 102, 241, 0.5)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: canPause ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              Pause Habit 🏖️
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PauseModal;