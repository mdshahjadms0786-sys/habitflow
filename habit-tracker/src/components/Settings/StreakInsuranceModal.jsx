import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStreakInsurance, INSURANCE_CONFIG } from '../../utils/streakInsuranceUtils';
import { loadPoints, getCurrentLevel } from '../../utils/pointsUtils';
import toast from 'react-hot-toast';

const StreakInsuranceModal = ({ isOpen, onClose }) => {
  const [purchasing, setPurchasing] = useState(false);
  const currentPoints = loadPoints();
  const currentLevel = getCurrentLevel();
  const { insurance, canBuy, remainingProtection, buyStreakInsurance } = useStreakInsurance(currentPoints);

  const handleBuy = () => {
    setPurchasing(true);
    const result = buyStreakInsurance();
    
    if (result.success) {
      toast.success(`🛡️ Streak Insurance activated! ${result.remaining} protection remaining!`);
    } else {
      toast.error(result.reason);
    }
    setPurchasing(false);
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
      onClick={onClose}
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
          <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text)' }}>🛡️ Streak Insurance</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '64px' }}>🛡️</span>
          
          <p style={{ margin: '16px 0 8px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Protect your streak from one miss!
          </p>
          
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
            If you miss a day, your streak won't break - it will be protected!
          </p>
        </div>

        <div style={{ 
          backgroundColor: 'var(--bg)', 
          borderRadius: '12px', 
          padding: '16px', 
          marginBottom: '20px',
          border: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Current Protection</span>
            <span style={{ fontSize: '14px', color: 'var(--text)', fontWeight: '600' }}>
              {insurance.totalProtected} / {INSURANCE_CONFIG.maxProtection}
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {[...Array(INSURANCE_CONFIG.maxProtection)].map((_, i) => (
              <span 
                key={i} 
                style={{ 
                  fontSize: '24px',
                  opacity: i < insurance.totalProtected ? 1 : 0.3,
                }}
              >
                🛡️
              </span>
            ))}
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'var(--primary)', 
          borderRadius: '12px', 
          padding: '16px', 
          marginBottom: '20px',
          textAlign: 'center',
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#ffffff', opacity: 0.9 }}>
            Cost: <strong>{INSURANCE_CONFIG.cost} points</strong>
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#ffffff', opacity: 0.8 }}>
            Current Level: {currentLevel.icon} {currentLevel.name} ({currentPoints} pts)
          </p>
        </div>

        <motion.button
          whileHover={{ scale: canBuy ? 1.02 : 1 }}
          whileTap={{ scale: canBuy ? 0.98 : 1 }}
          onClick={handleBuy}
          disabled={!canBuy || purchasing}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#ffffff',
            backgroundColor: canBuy ? '#22c55e' : 'var(--border)',
            border: 'none',
            borderRadius: '8px',
            cursor: canBuy ? 'pointer' : 'not-allowed',
          }}
        >
          {!canBuy 
            ? (currentPoints < INSURANCE_CONFIG.cost ? 'Not enough points' : 'Max protection reached')
            : `Buy Protection (${INSURANCE_CONFIG.cost} pts)`
          }
        </motion.button>

        {remainingProtection === 0 && (
          <p style={{ margin: '12px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
            💡 Tip: Complete more habits to earn points!
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default StreakInsuranceModal;