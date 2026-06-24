import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  getReferralCode,
  getReferralStats,
  saveReferralStats,
  applyReferralCode,
  generateShareableLink,
} from '../../utils/referralUtils';
import { addPoints } from '../../utils/pointsUtils';
import { usePlanContext } from '../../context/PlanContext';
import toast from 'react-hot-toast';

const ReferralSection = ({ compact = false }) => {
  const [codeInput, setCodeInput] = useState('');
  const [applying, setApplying] = useState(false);
  const { currentPlan } = usePlanContext();

  const referralCode = getReferralCode();
  const stats = getReferralStats();
  const shareData = generateShareableLink();

  const referralReward = currentPlan === 'elite' ? 150 : currentPlan === 'pro' ? 100 : 50;

  const handleApplyCode = () => {
    if (!codeInput || codeInput.length < 4) {
      toast.error('Enter a valid referral code');
      return;
    }

    if (localStorage.getItem('ht_referral_used')) {
      toast.error('You have already used a referral code');
      return;
    }

    const result = applyReferralCode(codeInput);
    if (result.success) {
      addPoints(result.bonus, 'Referral Bonus');
      toast.success(`🎉 You got ${result.bonus} free points!`);
      setCodeInput('');
      setApplying(false);
    } else {
      toast.error(result.reason);
    }
  };

  const handleShare = () => {
    const text = `Join HabitFlow with my code: ${referralCode} and get ${referralReward} free points! 🔥`;
    if (navigator.share) {
      navigator.share({
        title: 'Daily Habit Tracker',
        text,
        url: shareData.link,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      toast.success(`Referral code copied: ${referralCode}`);
    }
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🎁</span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>Refer & Earn</p>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
              Code: {referralCode} • +{referralReward} pts
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#fff',
              backgroundColor: '#8b5cf6',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Share
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid var(--border)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <span style={{ fontSize: '28px' }}>🎁</span>
        <div>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
            Refer Friends & Earn
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>
            Get {referralReward} points per friend
          </p>
        </div>
      </div>

      <div style={{
        backgroundColor: 'var(--bg)',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        textAlign: 'center',
      }}>
        <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>Your Code</p>
        <p style={{
          margin: '4px 0 0 0',
          fontSize: '24px',
          fontWeight: '700',
          color: '#8b5cf6',
          letterSpacing: '2px',
        }}>
          {referralCode}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '12px', fontSize: '11px' }}>
        <span style={{ color: '#888780' }}>🆓 Free: 50pts</span>
        <span style={{ color: '#534AB7' }}>💎 Pro: 100pts</span>
        <span style={{ color: '#BA7517' }}>👑 Elite: 150pts</span>
      </div>

      <motion.button
        whileHover={{ scale: applying ? 1 : 1.02 }}
        whileTap={{ scale: applying ? 1 : 0.98 }}
        onClick={handleShare}
        disabled={applying}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '13px',
          fontWeight: '600',
          color: '#fff',
          backgroundColor: '#8b5cf6',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginBottom: '12px',
        }}
      >
        📤 Share Code
      </motion.button>

      {!localStorage.getItem('ht_referral_used') ? (
        !applying ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setApplying(true)}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--text)',
              backgroundColor: 'var(--bg)',
              border: '1px dashed var(--border)',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Have a code? Apply here
          </motion.button>
        ) : (
          <div>
            <input
              type="text"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
              placeholder="Enter friend's code"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '13px',
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApplyCode}
                style={{
                  flex: 1,
                  padding: '10px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#fff',
                  backgroundColor: '#22c55e',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Apply Code
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setApplying(false);
                  setCodeInput('');
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--text)',
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </motion.button>
            </div>
          </div>
        )
      ) : (
        <p style={{ margin: 0, fontSize: '11px', color: '#22c55e', textAlign: 'center' }}>
          ✓ Referral code applied!
        </p>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#8b5cf6' }}>
            {stats.sent || 0}
          </p>
          <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-secondary)' }}>Sent</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#22c55e' }}>
            {stats.completed || 0}
          </p>
          <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-secondary)' }}>Joined</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#f59e0b' }}>
            +{(stats.completed || 0) * referralReward}
          </p>
          <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-secondary)' }}>Pts Earned</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ReferralSection;