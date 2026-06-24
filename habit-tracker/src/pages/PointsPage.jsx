import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePointsContext } from '../context/PointsContext';
import { usePlanContext } from '../context/PlanContext';
import toast from 'react-hot-toast';

const TAB_ALL = 'all';
const TAB_HOW = 'how';
const TAB_REFERRAL = 'referral';
const TAB_HISTORY = 'history';

const HOW_TO_EARN = [
  { icon: '✅', label: 'Complete a habit', pts: 10, bonus: '×multiplier', plan: 'all' },
  { icon: '🌅', label: 'Daily login bonus', pts: 5, bonus: '+daily', plan: 'all' },
  { icon: '🌱', label: 'Create a habit', pts: 5, bonus: '', plan: 'all' },
  { icon: '🎯', label: 'Perfect Day (all done)', pts: 30, bonus: 'once/day', plan: 'all' },
  { icon: '🔥', label: '7-Day Streak', pts: 50, bonus: 'once', plan: 'all' },
  { icon: '🔥', label: '30-Day Streak', pts: 200, bonus: 'once', plan: 'all' },
  { icon: '🔥', label: '100-Day Streak', pts: 500, bonus: 'once', plan: 'all' },
  { icon: '📝', label: 'Journal entry', pts: 8, bonus: '', plan: 'pro' },
  { icon: '😊', label: 'Mood check-in', pts: 5, bonus: '', plan: 'pro' },
  { icon: '🧘', label: 'Focus session done', pts: 15, bonus: '', plan: 'pro' },
  { icon: '🏆', label: 'Challenge completed', pts: 100, bonus: '', plan: 'pro' },
  { icon: '🎓', label: 'Certification earned', pts: 75, bonus: '', plan: 'pro' },
  { icon: '🎯', label: 'Goal completed', pts: 50, bonus: '', plan: 'pro' },
  { icon: '📅', label: 'Perfect Week (7/7 days)', pts: 75, bonus: 'weekly', plan: 'all' },
  { icon: '👥', label: 'Referral sent', pts: 10, bonus: '', plan: 'all' },
  { icon: '🎉', label: 'Referral joined', pts: 100, bonus: '', plan: 'all' },
  { icon: '🤖', label: 'AI Architect plan created', pts: 30, bonus: 'Elite only', plan: 'elite' },
  { icon: '🎓', label: 'Coaching session done', pts: 40, bonus: 'Elite only', plan: 'elite' },
];

const PointsPage = () => {
  const navigate = useNavigate();
  const {
    totalPoints, currentLevel, nextLevel, progress, pointsToNext,
    earnedToday, history, referralCode, referralStats,
    sendReferral, redeemReferral, LEVELS, PLAN_MULTIPLIERS,
  } = usePointsContext();
  const { currentPlan, planData } = usePlanContext();
  const [tab, setTab] = useState(TAB_ALL);

  const planColor = currentPlan === 'elite' ? '#BA7517' : currentPlan === 'pro' ? '#534AB7' : '#22c55e';
  const multiplier = PLAN_MULTIPLIERS[currentPlan] || 1;
  const referralReward = currentPlan === 'elite' ? 150 : currentPlan === 'pro' ? 100 : 50;

  const copyReferral = () => {
    const text = `Join HabitFlow with my code: ${referralCode} and get ${referralReward} free points! 🔥`;
    navigator.clipboard.writeText(text);
    toast.success('Referral link copied! 📋');
    sendReferral();
  };

  const tabs = [
    { id: TAB_ALL, label: '🏅 Overview' },
    { id: TAB_HOW, label: '💡 How to Earn' },
    { id: TAB_REFERRAL, label: '👥 Referrals' },
    { id: TAB_HISTORY, label: '📜 History' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto', paddingBottom: '100px' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>⚡ Your Points</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Earn points for every action. Level up. Unlock rewards.
        </p>
      </motion.div>

      {/* Points Hero Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: `linear-gradient(135deg, ${planColor}22, ${planColor}44)`,
          border: `2px solid ${planColor}`,
          borderRadius: '24px',
          padding: '32px',
          marginBottom: '24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '24px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', fontWeight: 900, color: planColor }}>{totalPoints.toLocaleString()}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Total Points</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px' }}>{currentLevel.icon}</div>
          <div style={{ fontWeight: 700, fontSize: '16px' }}>{currentLevel.name}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Level {currentLevel.level}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#22c55e' }}>+{earnedToday}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Earned Today</div>
          <div style={{ marginTop: '4px', fontSize: '11px', color: planColor, fontWeight: 600 }}>
            {multiplier}× {currentPlan.toUpperCase()} Multiplier
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      {nextLevel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 600, fontSize: '14px' }}>
              {currentLevel.icon} {currentLevel.name} → {nextLevel.icon} {nextLevel.name}
            </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              {pointsToNext} pts to go
            </span>
          </div>
          <div style={{ background: 'var(--border)', borderRadius: '99px', height: '10px', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{
                height: '100%',
                borderRadius: '99px',
                background: `linear-gradient(90deg, ${planColor}, ${planColor}99)`,
              }}
            />
          </div>
          <div style={{ textAlign: 'right', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {progress}%
          </div>
        </motion.div>
      )}

      {/* Plan Multipliers Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
        }}
      >
        <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: 700 }}>🚀 Plan Multipliers</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { plan: 'free', label: '🆓 Free', mult: '1.0×', color: '#888780' },
            { plan: 'pro', label: '💎 Pro', mult: '1.25×', color: '#534AB7' },
            { plan: 'elite', label: '👑 Elite', mult: '1.75×', color: '#BA7517' },
          ].map(p => (
            <div
              key={p.plan}
              style={{
                textAlign: 'center',
                padding: '16px 8px',
                borderRadius: '12px',
                border: `2px solid ${currentPlan === p.plan ? p.color : 'var(--border)'}`,
                background: currentPlan === p.plan ? `${p.color}15` : 'transparent',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '22px', color: p.color }}>{p.mult}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '4px' }}>{p.label}</div>
              {currentPlan === p.plan && (
                <div style={{ fontSize: '10px', color: p.color, marginTop: '4px' }}>✓ Your Plan</div>
              )}
            </div>
          ))}
        </div>
        {currentPlan !== 'elite' && (
          <button
            onClick={() => navigate('/upgrade')}
            style={{
              marginTop: '16px',
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #BA7517, #f59e0b)',
              color: 'white',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Upgrade to Elite for 1.75× Points →
          </button>
        )}
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: tab === t.id ? `2px solid ${planColor}` : '1px solid var(--border)',
              background: tab === t.id ? `${planColor}15` : 'var(--surface)',
              color: tab === t.id ? planColor : 'var(--text-secondary)',
              fontWeight: tab === t.id ? 700 : 400,
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB: OVERVIEW - All Levels */}
      {tab === TAB_ALL && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h3 style={{ marginBottom: '12px', fontWeight: 700 }}>All Levels</h3>
          {LEVELS.map(lvl => {
            const isCurrentLevel = lvl.level === currentLevel.level;
            const isUnlocked = totalPoints >= lvl.minPoints;
            return (
              <motion.div
                key={lvl.level}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: lvl.level * 0.04 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  background: isCurrentLevel ? `${lvl.color}20` : 'var(--surface)',
                  border: isCurrentLevel ? `2px solid ${lvl.color}` : '1px solid var(--border)',
                  opacity: isUnlocked ? 1 : 0.45,
                }}
              >
                <span style={{ fontSize: '28px' }}>{lvl.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: lvl.color }}>Level {lvl.level} — {lvl.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {lvl.minPoints.toLocaleString()} pts required
                  </div>
                </div>
                {isCurrentLevel && (
                  <span style={{ fontSize: '12px', background: lvl.color, color: 'white', padding: '3px 10px', borderRadius: '99px', fontWeight: 600 }}>
                    Current
                  </span>
                )}
                {isUnlocked && !isCurrentLevel && <span style={{ color: '#22c55e', fontSize: '18px' }}>✓</span>}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* TAB: HOW TO EARN */}
      {tab === TAB_HOW && (
        <div>
          <h3 style={{ marginBottom: '16px', fontWeight: 700 }}>💡 All Ways to Earn Points</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {HOW_TO_EARN.map((item, idx) => {
              const locked = item.plan === 'elite' && currentPlan !== 'elite'
                || item.plan === 'pro' && currentPlan === 'free';
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    opacity: locked ? 0.5 : 1,
                  }}
                >
                  <span style={{ fontSize: '22px' }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.label}</div>
                    {item.bonus && (
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.bonus}</div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: planColor, fontSize: '16px' }}>+{item.pts}</div>
                    {item.plan !== 'all' && (
                      <div style={{ fontSize: '10px', color: item.plan === 'elite' ? '#BA7517' : '#534AB7' }}>
                        {item.plan === 'elite' ? '👑 Elite' : '💎 Pro'}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: REFERRALS */}
      {tab === TAB_REFERRAL && (
        <div>
          <h3 style={{ marginBottom: '16px', fontWeight: 700 }}>👥 Referral Program</h3>
          <div style={{
            background: 'linear-gradient(135deg, #534AB722, #8b5cf622)',
            border: '2px solid #534AB7',
            borderRadius: '20px',
            padding: '28px',
            marginBottom: '20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎁</div>
            <h4 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>Earn {referralReward} pts per referral!</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '12px' }}>
              Share your code. When someone joins, you both earn points!
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '20px', fontSize: '12px' }}>
              <span style={{ color: '#888780' }}>🆓 Free: 50 pts</span>
              <span style={{ color: '#534AB7' }}>💎 Pro: 100 pts</span>
              <span style={{ color: '#BA7517' }}>👑 Elite: 150 pts</span>
            </div>
            <div style={{
              background: 'var(--surface)',
              borderRadius: '12px',
              padding: '16px',
              fontFamily: 'monospace',
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '3px',
              marginBottom: '16px',
              color: '#534AB7',
              border: '1px solid var(--border)',
            }}>
              {referralCode}
            </div>
            <button
              onClick={copyReferral}
              style={{
                background: '#534AB7',
                color: 'white',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '15px',
              }}
            >
              📋 Copy & Share (+10 pts)
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#534AB7' }}>{referralStats.sent || 0}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Referrals Sent</div>
              <div style={{ fontSize: '12px', color: '#534AB7', marginTop: '4px' }}>+{(referralStats.sent || 0) * 10} pts earned (bonus)</div>
            </div>
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#22c55e' }}>{referralStats.completed || 0}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Referrals Joined</div>
              <div style={{ fontSize: '12px', color: '#22c55e', marginTop: '4px' }}>+{(referralStats.completed || 0) * referralReward} pts earned</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: HISTORY */}
      {tab === TAB_HISTORY && (
        <div>
          <h3 style={{ marginBottom: '16px', fontWeight: 700 }}>📜 Points History</h3>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              No history yet. Start completing habits to earn points!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {history.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', textTransform: 'capitalize' }}>
                      {String(item.reason).replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {new Date(item.timestamp).toLocaleString()}
                      {item.multiplier > 1 && ` · ${item.multiplier}× boost`}
                    </div>
                  </div>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '16px',
                    color: item.points >= 0 ? '#22c55e' : '#ef4444',
                  }}>
                    {item.points >= 0 ? '+' : ''}{item.points}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PointsPage;
