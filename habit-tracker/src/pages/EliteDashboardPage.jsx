import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePlanContext } from '../context/PlanContext';
import { ELITE_FEATURES } from '../utils/planUtils';

function EliteDashboardPage() {
  const navigate = useNavigate();
  const planCtx = usePlanContext();
  const hasFeature = planCtx.hasFeature;
  const isEliteUser = planCtx.isElite;

  const features = Object.entries(ELITE_FEATURES).map(([key, value]) => ({
    key,
    ...value,
    unlocked: hasFeature(key),
  }));

  const unlockedCount = features.filter(f => f.unlocked).length;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{
          background: 'linear-gradient(135deg, #BA7517, #f59e0b)',
          padding: '48px',
          borderRadius: '24px',
          color: 'white',
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>👑</div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>
            Elite Command Center
          </h1>
          <p style={{ opacity: 0.9, fontSize: '18px' }}>
            Your exclusive AI-powered habit mastery tools
          </p>
          <div style={{
            marginTop: '24px',
            display: 'inline-flex',
            gap: '24px',
            padding: '16px 32px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '12px'
          }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 700 }}>{unlockedCount}</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Features Active</div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.3)' }} />
            <div>
              <div style={{ fontSize: '32px', fontWeight: 700 }}>{features.length}</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Total Elite Features</div>
            </div>
          </div>
        </div>

        <h2 style={{ marginBottom: '24px' }}>🚀 Elite Exclusive Features</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {features.map((feature, idx) => (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => feature.unlocked && navigate(feature.page)}
              style={{
                background: 'var(--surface)',
                padding: '24px',
                borderRadius: '16px',
                border: feature.unlocked ? '2px solid #BA7517' : '1px solid var(--border)',
                cursor: feature.unlocked ? 'pointer' : 'not-allowed',
                opacity: feature.unlocked ? 1 : 0.5,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {!feature.unlocked && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  fontSize: '20px'
                }}>🔒</div>
              )}
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>{feature.icon}</div>
              <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>{feature.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
                {feature.description}
              </p>
              {feature.unlocked ? (
                <button
                  style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #BA7517, #f59e0b)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Open →
                </button>
              ) : (
                <span style={{
                  padding: '8px 16px',
                  background: 'var(--border)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: 'var(--text-secondary)'
                }}>
                  Upgrade to Elite
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {!isEliteUser && (
          <div style={{
            marginTop: '48px',
            padding: '32px',
            background: 'rgba(186, 117, 23, 0.1)',
            borderRadius: '16px',
            border: '1px solid #BA7517',
            textAlign: 'center'
          }}>
            <h2 style={{ marginBottom: '16px' }}>Unlock All Elite Features</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Get access to all 10 exclusive AI-powered features plus 45+ premium habit packs
            </p>
            <button
              onClick={() => navigate('/upgrade')}
              style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #BA7517, #f59e0b)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontWeight: 700,
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              Upgrade to Elite - ₹499/month
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default EliteDashboardPage;