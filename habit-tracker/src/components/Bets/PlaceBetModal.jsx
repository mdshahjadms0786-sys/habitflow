import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateMultiplier, canPlaceBet, createBet, saveBet } from '../../utils/bettingUtils';
import { getTotalPoints } from '../../utils/pointsUtils';
import toast from 'react-hot-toast';

const PlaceBetModal = ({ isOpen, onClose, habit, onSave }) => {
  const [betAmount, setBetAmount] = useState(100);
  const [duration, setDuration] = useState(7);
  const [targetRate, setTargetRate] = useState(70);

  const points = getTotalPoints();
  const maxBet = Math.floor(points / 2);
  
  useEffect(() => {
    if (habit) {
      setBetAmount(Math.min(100, maxBet));
    }
  }, [habit, isOpen]);

  const multiplier = calculateMultiplier(targetRate, duration);
  const potentialReward = Math.round(betAmount * multiplier);
  const canBet = canPlaceBet(betAmount) && betAmount <= maxBet;

  const handlePlaceBet = () => {
    if (!canBet || !habit) return;
    
    if (!window.confirm(`Place ${betAmount} pts bet on ${habit.name}?\n\nWin: +${potentialReward} pts\nLose: -${betAmount} pts`)) {
      return;
    }

    const bet = createBet(habit, betAmount, duration, targetRate);
    saveBet(bet);
    onSave(bet);
    onClose();
    toast.success(`Bet placed! ${potentialReward} pts at stake 🔮`);
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
            maxWidth: '400px'
          }}
        >
          <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: 'var(--text)', textAlign: 'center' }}>
            💰 Place a Bet
          </h2>

          {habit && (
            <div style={{ textAlign: 'center', marginBottom: '20px', padding: '12px', backgroundColor: 'var(--bg)', borderRadius: '8px' }}>
              <span style={{ fontSize: '24px' }}>{habit.icon}</span>
              <div style={{ fontSize: '14px', fontWeight: '500', marginTop: '4px' }}>{habit.name}</div>
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text)' }}>
              Bet Amount: {betAmount} pts
            </label>
            <input
              type="range"
              min={50}
              max={maxBet}
              step={50}
              value={betAmount}
              onChange={(e) => setBetAmount(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Your points: {points} | Max bet: {maxBet}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text)' }}>
              Duration
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[7, 14, 30].map(d => (
                <motion.button
                  key={d}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDuration(d)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    fontSize: '13px',
                    backgroundColor: duration === d ? 'var(--primary)' : 'var(--bg)',
                    color: duration === d ? '#fff' : 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {d} days
                </motion.button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text)' }}>
              Target Completion Rate
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[50, 70, 90, 100].map(r => (
                <motion.button
                  key={r}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTargetRate(r)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    fontSize: '13px',
                    backgroundColor: targetRate === r ? 'var(--primary)' : 'var(--bg)',
                    color: targetRate === r ? '#fff' : 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {r}%
                </motion.button>
              ))}
            </div>
          </div>

          <div style={{ padding: '16px', backgroundColor: 'var(--bg)', borderRadius: '8px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
              <span>Multiplier:</span>
              <span style={{ fontWeight: '600', color: '#22c55e' }}>{multiplier}x</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
              <span>Potential reward:</span>
              <span style={{ fontWeight: '600', color: '#22c55e' }}>+{potentialReward} pts</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span>If you fail:</span>
              <span style={{ fontWeight: '600', color: '#dc2626' }}>-{betAmount} pts</span>
            </div>
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
              onClick={handlePlaceBet}
              disabled={!canBet}
              style={{
                flex: 1,
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: canBet ? '#22c55e' : 'var(--border)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: canBet ? 'pointer' : 'not-allowed'
              }}
            >
              Place Bet 💰
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PlaceBetModal;