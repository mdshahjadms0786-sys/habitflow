import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlanContext } from '../context/PlanContext';
import { getPlanComparisonData, PLANS } from '../utils/planUtils';
import toast from 'react-hot-toast';

const FAQS = [
  { q: 'Can I cancel anytime?', a: 'Yes! You can cancel your subscription anytime. No questions asked.' },
  { q: 'Is there a free trial?', a: 'Yes! Pro plan includes a 14-day free trial to test all features.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, UPI, and digital wallets.' },
  { q: 'Can I switch plans later?', a: 'Absolutely! You can upgrade or downgrade your plan at any time.' },
  { q: 'Do you offer refunds?', a: 'Yes, we offer a 30-day money-back guarantee.' },
  { q: 'What happens to my data if I downgrade?', a: 'Your data is never deleted. You can always upgrade again to access all your history.' }
];

const UpgradePage = () => {
  const navigate = useNavigate();
  const {
    currentPlan,
    isFree,
    isPro: isUserPro,
    isElite: isUserElite,
    isTrialActive,
    trialDaysRemaining,
    upgrade,
    planData
  } = usePlanContext();

  const FEATURES = getPlanComparisonData();

  const handleSelectPlan = (planId) => {
    if (planId === currentPlan) return;

    if (planId === 'pro' && isFree) {
      toast.success('🎉 14-day free trial started! Enjoy all Pro features.');
    } else {
      toast.success(`Welcome to ${PLANS[planId].name}! 🎉 All features unlocked!`);
    }

    upgrade(planId);
    navigate('/');
  };

  const handleCancelTrial = () => {
    if (confirm('Are you sure you want to cancel your trial? You will lose access to Pro features.')) {
      toast.success('Trial cancelled. You are now on the Free plan.');
      upgrade('free');
    }
  };

  return (
    <div style={{
      padding: '24px',
      maxWidth: '1200px',
      margin: '0 auto',
      paddingBottom: '100px'
    }}>
      <AnimatePresence>
        {isTrialActive && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              background: 'linear-gradient(135deg, #534AB7, #8b5cf6)',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '16px',
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              boxShadow: '0 4px 20px rgba(83, 74, 183, 0.3)',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>
                🎉 You're on a free trial!
              </div>
              <div style={{ opacity: 0.9, fontSize: '0.95rem' }}>
                {trialDaysRemaining} days remaining. Enjoy all Pro features!
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleCancelTrial}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Cancel Trial
              </button>
              <button
                onClick={() => handleSelectPlan('pro')}
                style={{
                  background: 'white',
                  color: '#534AB7',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Keep Pro →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px' }}>
          Unlock Your Full Potential 🚀
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
          Choose the plan that fits your journey. Upgrade anytime as your habits grow.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '80px',
      }}>
        {/* FREE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            background: 'var(--surface)',
            padding: '32px',
            borderRadius: '24px',
            border: currentPlan === 'free' ? '2px solid #888780' : '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            position: 'relative',
            opacity: currentPlan === 'free' ? 1 : 0.8,
          }}
        >
          {currentPlan === 'free' && (
            <div style={{
              position: 'absolute',
              top: '-14px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#888780',
              color: 'white',
              padding: '4px 16px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}>
              Current Plan
            </div>
          )}

          <div style={{
            display: 'inline-block',
            padding: '6px 12px',
            background: 'rgba(136, 135, 128, 0.1)',
            color: '#888780',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '16px',
            alignSelf: 'flex-start',
          }}>
            🆓 Free Forever
          </div>

          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>
            ₹0<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/month</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
            Perfect for getting started
          </p>

          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 24px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            flex: 1,
          }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
              ✅ Up to 3 habits
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
              ✅ Basic streak tracking
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
              ✅ 7 days history
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
              ✅ 3 template packs
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
              ✅ Dark mode
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', opacity: 0.5 }}>
              ❌ AI features
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', opacity: 0.5 }}>
              ❌ Focus Mode
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', opacity: 0.5 }}>
              ❌ Advanced analytics
            </li>
          </ul>

          <button
            disabled={currentPlan === 'free'}
            onClick={() => handleSelectPlan('free')}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              background: currentPlan === 'free' ? 'var(--border)' : 'transparent',
              border: '2px solid var(--border)',
              color: currentPlan === 'free' ? 'var(--text)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: currentPlan === 'free' ? 'default' : 'pointer',
              opacity: currentPlan === 'free' ? 0.6 : 1,
            }}
          >
            {currentPlan === 'free' ? 'Current Plan' : 'Downgrade to Free'}
          </button>
        </motion.div>

        {/* PRO CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'var(--surface)',
            padding: '40px 32px',
            borderRadius: '24px',
            border: '2px solid #534AB7',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            boxShadow: '0 20px 40px -10px rgba(83, 74, 183, 0.15)',
            transform: currentPlan === 'pro' ? 'none' : 'scale(1.02)',
          }}
        >
          {currentPlan === 'pro' ? (
            <div style={{
              position: 'absolute',
              top: '-16px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#534AB7',
              color: 'white',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}>
              Current Plan
            </div>
          ) : (
            <div style={{
              position: 'absolute',
              top: '-16px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #534AB7, #8b5cf6)',
              color: 'white',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}>
              Most Popular 🔥
            </div>
          )}

          <div style={{
            display: 'inline-block',
            padding: '6px 12px',
            background: 'rgba(83, 74, 183, 0.1)',
            color: '#534AB7',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '16px',
            alignSelf: 'flex-start',
          }}>
            💎 Pro
          </div>

          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>
            ₹199<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/month</span>
          </div>
          {isFree ? (
            <p style={{ color: '#534AB7', fontSize: '0.9rem', fontWeight: 500, marginBottom: '24px' }}>
              14-day free trial
            </p>
          ) : currentPlan === 'pro' && isTrialActive ? (
            <p style={{ color: '#534AB7', fontSize: '0.9rem', fontWeight: 500, marginBottom: '24px' }}>
              Trial active • {trialDaysRemaining} days remaining
            </p>
          ) : null}

          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 24px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            flex: 1,
          }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
              ✅ <strong>Unlimited habits</strong>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
              ✅ All 40+ template packs
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
              ✅ <strong>AI Coach</strong> chat
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
              ✅ Focus Mode + Pomodoro
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
              ✅ Full analytics + DNA
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
              ✅ Journal + Mood tracking
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
              ✅ Vision Board, Goals, Life Areas
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
              ✅ Leagues, Challenges, Betting
            </li>
          </ul>

          <button
            disabled={currentPlan === 'pro'}
            onClick={() => handleSelectPlan('pro')}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              background: currentPlan === 'pro' ? 'var(--border)' : '#534AB7',
              border: 'none',
              color: currentPlan === 'pro' ? 'var(--text-secondary)' : 'white',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: currentPlan === 'pro' ? 'default' : 'pointer',
              boxShadow: currentPlan === 'pro' ? 'none' : '0 4px 14px rgba(83, 74, 183, 0.3)',
            }}
          >
            {currentPlan === 'pro' ? 'Current Plan' : currentPlan === 'elite' ? 'Downgrade to Pro' : 'Start Pro →'}
          </button>
        </motion.div>

        {/* ELITE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'var(--surface)',
            padding: '32px',
            borderRadius: '24px',
            border: currentPlan === 'elite' ? '2px solid #BA7517' : '1px solid #BA7517',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            position: 'relative',
          }}
        >
          {currentPlan === 'elite' && (
            <div style={{
              position: 'absolute',
              top: '-14px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#BA7517',
              color: 'white',
              padding: '4px 16px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}>
              Current Plan
            </div>
          )}

          <div style={{
            display: 'inline-block',
            padding: '6px 12px',
            background: 'rgba(186, 117, 23, 0.1)',
            color: '#BA7517',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '16px',
            alignSelf: 'flex-start',
          }}>
            👑 Elite
          </div>

          <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>
            ₹499<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/month</span>
          </div>
          <p style={{ color: 'var(--text)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '24px' }}>
            For serious habit masters
          </p>

          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 24px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            flex: 1,
          }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
              ✅ <strong>Everything in Pro</strong>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
              ✅ <strong>AI Habit Architect</strong> 🏗️
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
              ✅ <strong>Life OS Dashboard</strong> 🖥️
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
              ✅ <strong>Predictive AI Engine</strong> 🔮
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
              ✅ <strong>Smart Intervention</strong> 🚨
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
              ✅ <strong>Monthly Behavior Report</strong> 🧬
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
              ✅ <strong>Habit ROI Dashboard</strong> 💰
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
              ✅ <strong>Habit Twin Benchmarking</strong> 👥
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
              ✅ <strong>Weekly Executive Email</strong> 📧
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
              ✅ <strong>DNA Evolution Timeline</strong> 🧬
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
              ✅ <strong>White Glove Onboarding</strong> 🎯
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
              ✅ 5 Elite Habit Packs 🔥
            </li>
          </ul>

          <button
            disabled={currentPlan === 'elite'}
            onClick={() => handleSelectPlan('elite')}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              background: currentPlan === 'elite' ? 'var(--border)' : 'linear-gradient(135deg, #BA7517, #f59e0b)',
              border: 'none',
              color: currentPlan === 'elite' ? 'var(--text-secondary)' : 'white',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: currentPlan === 'elite' ? 'default' : 'pointer',
              boxShadow: currentPlan === 'elite' ? 'none' : '0 4px 14px rgba(186, 117, 23, 0.3)',
            }}
          >
            {currentPlan === 'elite' ? 'Current Plan' : 'Go Elite →'}
          </button>
        </motion.div>
      </div>

      {/* FEATURE COMPARISON TABLE */}
      <div style={{
        marginBottom: '80px',
        background: 'var(--surface)',
        padding: '40px',
        borderRadius: '24px',
        border: '1px solid var(--border)',
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '32px',
        }}>
          Compare Plans
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
              <tr>
                <th style={{
                  textAlign: 'left',
                  padding: '16px',
                  borderBottom: '2px solid var(--border)',
                  fontSize: '1rem',
                }}>Feature</th>
                <th style={{
                  textAlign: 'center',
                  padding: '16px',
                  borderBottom: '2px solid #888780',
                  fontSize: '1rem',
                  color: '#888780',
                }}>Free</th>
                <th style={{
                  textAlign: 'center',
                  padding: '16px',
                  borderBottom: '2px solid #534AB7',
                  backgroundColor: 'rgba(83, 74, 183, 0.05)',
                  fontSize: '1rem',
                  color: '#534AB7',
                  borderRadius: '8px 8px 0 0',
                }}>Pro</th>
                <th style={{
                  textAlign: 'center',
                  padding: '16px',
                  borderBottom: '2px solid #BA7517',
                  fontSize: '1rem',
                  color: '#BA7517',
                }}>Elite</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((feature, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 500 }}>{feature.name}</td>
                  <td style={{
                    textAlign: 'center',
                    padding: '14px 16px',
                    color: feature.free === false ? 'var(--text-secondary)' : 'var(--text)',
                    opacity: feature.free === false ? 0.5 : 1,
                  }}>
                    {typeof feature.free === 'boolean' ? (feature.free ? '✅' : '—') : feature.free}
                  </td>
                  <td style={{
                    textAlign: 'center',
                    padding: '14px 16px',
                    backgroundColor: 'rgba(83, 74, 183, 0.02)',
                    color: feature.pro === false ? 'var(--text-secondary)' : 'var(--text)',
                    fontWeight: feature.pro ? 600 : 400,
                  }}>
                    {typeof feature.pro === 'boolean' ? (feature.pro ? '✅' : '—') : feature.pro}
                  </td>
                  <td style={{
                    textAlign: 'center',
                    padding: '14px 16px',
                    color: feature.elite === false ? 'var(--text-secondary)' : 'var(--text)',
                    fontWeight: feature.elite ? 600 : 400,
                  }}>
                    {typeof feature.elite === 'boolean' ? (feature.elite ? '✅' : '—') : feature.elite}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ SECTION */}
      <div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '32px',
        }}>
          Frequently Asked Questions
        </h2>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          {FAQS.map((faq, idx) => (
            <details
              key={idx}
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: '16px',
                padding: '20px 24px',
                cursor: 'pointer',
                border: '1px solid var(--border)',
              }}
            >
              <summary style={{
                fontWeight: 600,
                fontSize: '1.05rem',
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                {faq.q}
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>▼</span>
              </summary>
              <p style={{
                color: 'var(--text-secondary)',
                marginTop: '12px',
                fontSize: '0.95rem',
                lineHeight: 1.6,
              }}>
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;