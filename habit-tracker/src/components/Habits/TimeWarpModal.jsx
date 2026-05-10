import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../../hooks/useHabits';
import { useHabitContext } from '../../context/HabitContext';
import { getTimeWarpPenalty, getTimeWarpHistory } from '../../utils/timeWarpUtils';
import { deductPoints, loadPoints } from '../../utils/pointsUtils';
import { formatISODate, getLastNDays } from '../../utils/dateUtils';
import toast from 'react-hot-toast';

const TimeWarpModal = ({ isOpen, onClose, habits, onTimeWarpComplete }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedHabitId, setSelectedHabitId] = useState('');
  const [step, setStep] = useState(1);

  const last7Days = useMemo(() => getLastNDays(7), []);

  const selectedHabit = habits.find(h => h.id === selectedHabitId);
  const penalty = selectedDate ? getTimeWarpPenalty(selectedDate) : null;
  const currentPoints = loadPoints();

  const handleTimeWarp = () => {
    if (!selectedHabitId || !selectedDate) return;

    const dateStr = formatISODate(new Date(selectedDate));
    
    if (selectedHabit.completionLog?.[dateStr]) {
      toast.error('Already completed for this date!');
      return;
    }

    const pointsEarned = Math.floor(10 * (penalty?.pointsMultiplier || 0.5));
    const newPoints = deductPoints(0);

    onTimeWarpComplete(selectedHabitId, dateStr, pointsEarned);
    toast.success(`⏰ Completed! +${pointsEarned} points (50% penalty applied)`);
    handleClose();
  };

  const handleClose = () => {
    setSelectedDate('');
    setSelectedHabitId('');
    setStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text)' }}>⏰ Time Warp</h2>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        {step === 1 && (
          <>
            <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
              Complete past habits within 7 days! ⚠️ 50% points penalty applies
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text)' }}>
                Select Date:
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--text)',
                }}
              >
                <option value="">Choose a date</option>
                {last7Days.map((date, i) => {
                  const dateStr = formatISODate(date);
                  const isToday = i === 0;
                  return (
                    <option key={i} value={dateStr}>
                      {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      {isToday ? ' (Today)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {selectedDate && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text)' }}>
                  Select Habit:
                </label>
                <select
                  value={selectedHabitId}
                  onChange={(e) => setSelectedHabitId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--text)',
                  }}
                >
                  <option value="">Choose a habit</option>
                  {habits.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.icon} {h.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedHabit && penalty && (
              <div style={{ backgroundColor: 'var(--bg)', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  📊 Penalty Breakdown:
                </p>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text)' }}>
                  • Date: {penalty.label} → {Math.round(penalty.pointsMultiplier * 100)}% points<br/>
                  • You will earn: <strong>5 points</strong> (instead of 10)
                </p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep(2)}
              disabled={!selectedHabitId || !selectedDate}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#ffffff',
                backgroundColor: selectedHabitId && selectedDate ? 'var(--primary)' : 'var(--border)',
                border: 'none',
                borderRadius: '8px',
                cursor: selectedHabitId && selectedDate ? 'pointer' : 'not-allowed',
              }}
            >
              Confirm Time Warp
            </motion.button>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '48px' }}>⏰</span>
              <p style={{ margin: '16px 0 0 0', fontSize: '16px', color: 'var(--text)' }}>
                Confirm Time Warp?
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                {selectedHabit?.icon} {selectedHabit?.name}<br/>
                {selectedDate && new Date(selectedDate).toLocaleDateString()}
              </p>
              <p style={{ margin: '12px 0 0 0', fontSize: '14px', color: '#f97316' }}>
                ⚠️ 50% points penalty will apply
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  padding: '14px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--text)',
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTimeWarp}
                style={{
                  flex: 1,
                  padding: '14px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#ffffff',
                  backgroundColor: 'var(--primary)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Complete
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TimeWarpModal;