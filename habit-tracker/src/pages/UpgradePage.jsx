import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCurrentPlan, setPlan, PLANS } from '../utils/planUtils';
import toast from 'react-hot-toast';

const FEATURES = [
  { name: 'Track habits', free: 'Up to 5', pro: 'Unlimited', elite: 'Unlimited' },
  { name: 'Streak tracking', free: true, pro: true, elite: true },
  { name: 'History', free: '7 days', pro: '1 Year', elite: 'Unlimited' },
  { name: 'Template Packs', free: '3 Packs', pro: 'All 40 Packs', elite: 'All 40 Packs' },
  { name: 'Basic Analytics', free: true, pro: true, elite: true },
  { name: 'Dark Mode', free: true, pro: true, elite: true },
  { name: 'AI Coach (Chat)', free: false, pro: true, elite: true },
  { name: 'AI Life Coach (Sessions)', free: false, pro: false, elite: true },
  { name: 'Advanced Analytics + DNA', free: false, pro: true, elite: true },
  { name: 'Focus Mode', free: false, pro: true, elite: true },
  { name: 'Journal & Mood Tracking', free: false, pro: true, elite: true },
  { name: 'Vision Board & Goals', free: false, pro: true, elite: true },
  { name: 'Life Areas Dashboard', free: false, pro: true, elite: true },
  { name: 'Habit Stacks', free: false, pro: true, elite: true },
  { name: 'Leagues & Betting', free: false, pro: true, elite: true },
  { name: 'Export Data', free: false, pro: true, elite: true },
  { name: 'Team Spaces', free: false, pro: false, elite: true },
  { name: 'API Access', free: false, pro: false, elite: true },
  { name: 'Deep Behavior Analysis', free: false, pro: false, elite: true },
  { name: 'Priority Support', free: false, pro: false, elite: true }
];

const FAQS = [
  { q: 'Can I cancel anytime?', a: 'Yes! You can cancel your subscription anytime. No questions asked.' },
  { q: 'Is there a free trial?', a: 'Yes! Pro plan includes a 14-day free trial.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, UPI, and digital wallets.' },
  { q: 'Can I switch plans later?', a: 'Absolutely! You can upgrade or downgrade your plan at any time.' },
  { q: 'Do you offer refunds?', a: 'Yes, we offer a 30-day money-back guarantee.' }
];

const UpgradePage = () => {
  const navigate = useNavigate();
  const currentPlanId = getCurrentPlan();
  const currentPlanName = PLANS[currentPlanId]?.name || 'Unknown';
  
  const handleSelectPlan = (planId) => {
    if (planId === currentPlanId) return;
    setPlan(planId);
    toast.success(`Welcome to ${PLANS[planId].name}! 🎉 All features unlocked!`);
    navigate('/');
  };
  
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', paddingBottom: '100px' }}>
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px' }}>
          Unlock Your Full Potential 🚀
        </h1>
        <div style={{ display: 'inline-block', background: 'var(--surface)', padding: '12px 24px', borderRadius: '30px', border: '1px solid var(--border)' }}>
          <span style={{ color: 'var(--text-secondary)', marginRight: '8px' }}>Current Plan:</span>
          <span style={{ fontWeight: 600 }}>{currentPlanName} Plan</span>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center', marginBottom: '80px' }}>
        {/* FREE CARD */}
        <motion.div 
          style={{ background: 'var(--surface)', padding: '40px 32px', borderRadius: '24px', border: currentPlanId === 'free' ? '2px solid #888780' : '1px solid var(--border)', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}
        >
          {currentPlanId === 'free' && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#888780', color: 'white', padding: '4px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>Current Plan</div>}
          <div style={{ display: 'inline-block', padding: '6px 12px', background: 'rgba(136, 135, 128, 0.1)', color: '#888780', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px', alignSelf: 'flex-start' }}>
            Free Forever
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '24px' }}>
            ₹0<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/month</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>✅ Up to 5 habits</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>✅ Basic streak tracking</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>✅ 7 days history</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>✅ 3 template packs</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>✅ Basic analytics</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', opacity: 0.5 }}>❌ AI features</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', opacity: 0.5 }}>❌ Advanced analytics</li>
          </ul>
          <button 
            disabled={currentPlanId === 'free'}
            onClick={() => handleSelectPlan('free')}
            style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'transparent', border: '2px solid var(--border)', color: 'var(--text)', fontWeight: 600, fontSize: '1.1rem', cursor: currentPlanId === 'free' ? 'default' : 'pointer', opacity: currentPlanId === 'free' ? 0.5 : 1 }}
          >
            {currentPlanId === 'free' ? 'Current Plan' : 'Downgrade to Free'}
          </button>
        </motion.div>

        {/* PRO CARD */}
        <motion.div 
          style={{ background: 'var(--surface)', padding: '48px 32px', borderRadius: '24px', border: '2px solid #534AB7', position: 'relative', display: 'flex', flexDirection: 'column', height: '105%', boxShadow: currentPlanId === 'pro' ? '0 0 0 4px rgba(83, 74, 183, 0.2)' : '0 20px 40px -10px rgba(83, 74, 183, 0.2)' }}
        >
          {currentPlanId === 'pro' ? (
            <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: '#534AB7', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
              Current Plan
            </div>
          ) : (
            <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #534AB7, #8b5cf6)', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
              Most Popular 🔥
            </div>
          )}
          
          <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '8px' }}>
            ₹199<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/month</span>
          </div>
          <p style={{ color: '#534AB7', fontSize: '0.9rem', fontWeight: 500, marginBottom: '24px' }}>14-day free trial</p>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>✅ Unlimited habits</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>✅ All 40 template packs</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>✅ Full analytics + DNA</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>✅ <strong>AI Coach (chat)</strong></li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>✅ Focus Mode + Pomodoro</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>✅ Journal + Mood tracking</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>✅ Vision Board & Goals</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>✅ Life Areas dashboard</li>
          </ul>
          <button 
            disabled={currentPlanId === 'pro'}
            onClick={() => handleSelectPlan('pro')}
            style={{ width: '100%', padding: '16px', borderRadius: '12px', background: currentPlanId === 'pro' ? 'var(--border)' : '#534AB7', border: 'none', color: currentPlanId === 'pro' ? 'var(--text-secondary)' : 'white', fontWeight: 600, fontSize: '1.1rem', cursor: currentPlanId === 'pro' ? 'default' : 'pointer', boxShadow: currentPlanId === 'pro' ? 'none' : '0 4px 14px rgba(83, 74, 183, 0.3)' }}
          >
            {currentPlanId === 'pro' ? 'Current Plan' : currentPlanId === 'elite' ? 'Downgrade to Pro' : 'Start Pro →'}
          </button>
        </motion.div>

        {/* ELITE CARD */}
        <motion.div 
          style={{ background: 'var(--surface)', padding: '40px 32px', borderRadius: '24px', border: currentPlanId === 'elite' ? '2px solid #BA7517' : '1px solid #BA7517', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}
        >
          {currentPlanId === 'elite' && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#BA7517', color: 'white', padding: '4px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>Current Plan</div>}
          <div style={{ display: 'inline-block', padding: '6px 12px', background: 'rgba(186, 117, 23, 0.1)', color: '#BA7517', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px', alignSelf: 'flex-start' }}>
            Elite 👑
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '24px' }}>
            ₹499<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/month</span>
          </div>
          <p style={{ color: 'var(--text)', fontWeight: 600, marginBottom: '16px', fontSize: '0.95rem' }}>Everything in Pro PLUS:</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>✅ <strong>AI Life Coach Pro</strong></li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>✅ <strong>Weekly coaching sessions</strong></li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>✅ Deep behavior analysis</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>✅ Custom AI personality</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>✅ Team/Family spaces</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>✅ API access</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>✅ Priority support</li>
          </ul>
          <button 
            disabled={currentPlanId === 'elite'}
            onClick={() => handleSelectPlan('elite')}
            style={{ width: '100%', padding: '16px', borderRadius: '12px', background: currentPlanId === 'elite' ? 'var(--border)' : 'linear-gradient(135deg, #BA7517, #f59e0b)', border: 'none', color: currentPlanId === 'elite' ? 'var(--text-secondary)' : 'white', fontWeight: 600, fontSize: '1.1rem', cursor: currentPlanId === 'elite' ? 'default' : 'pointer', boxShadow: currentPlanId === 'elite' ? 'none' : '0 4px 14px rgba(186, 117, 23, 0.3)' }}
          >
            {currentPlanId === 'elite' ? 'Current Plan' : 'Go Elite →'}
          </button>
        </motion.div>
      </div>
      
      <div style={{ marginBottom: '80px', background: 'var(--surface)', padding: '40px', borderRadius: '24px', border: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', textAlign: 'center', marginBottom: '32px' }}>
          Compare Plans
        </h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '16px', borderBottom: '2px solid var(--border)', fontSize: '1rem' }}>Feature</th>
                <th style={{ textAlign: 'center', padding: '16px', borderBottom: '2px solid var(--border)', fontSize: '1rem', color: '#888780' }}>Free</th>
                <th style={{ textAlign: 'center', padding: '16px', borderBottom: '2px solid #534AB7', backgroundColor: 'rgba(83, 74, 183, 0.05)', fontSize: '1rem', color: '#534AB7', borderRadius: '8px 8px 0 0' }}>Pro</th>
                <th style={{ textAlign: 'center', padding: '16px', borderBottom: '2px solid var(--border)', fontSize: '1rem', color: '#BA7517' }}>Elite</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((feature, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>{feature.name}</td>
                  <td style={{ textAlign: 'center', padding: '16px', color: feature.free === false ? 'var(--text-secondary)' : 'var(--text)', opacity: feature.free === false ? 0.5 : 1 }}>
                    {typeof feature.free === 'boolean' ? (feature.free ? '✅' : '—') : feature.free}
                  </td>
                  <td style={{ textAlign: 'center', padding: '16px', backgroundColor: 'rgba(83, 74, 183, 0.02)', color: feature.pro === false ? 'var(--text-secondary)' : 'var(--text)', fontWeight: feature.pro ? 600 : 400 }}>
                    {typeof feature.pro === 'boolean' ? (feature.pro ? '✅' : '—') : feature.pro}
                  </td>
                  <td style={{ textAlign: 'center', padding: '16px', color: feature.elite === false ? 'var(--text-secondary)' : 'var(--text)' }}>
                    {typeof feature.elite === 'boolean' ? (feature.elite ? '✅' : '—') : feature.elite}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', textAlign: 'center', marginBottom: '32px' }}>
          Frequently Asked Questions
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px', margin: '0 auto' }}>
          {FAQS.map((faq, idx) => (
            <details
              key={idx}
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: '16px',
                padding: '24px',
                cursor: 'pointer',
                border: '1px solid var(--border)'
              }}
            >
              <summary style={{ fontWeight: '600', fontSize: '1.1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {faq.q}
                <span style={{ color: 'var(--text-secondary)' }}>▼</span>
              </summary>
              <p style={{ color: 'var(--text-secondary)', marginTop: '16px', fontSize: '1rem', lineHeight: 1.5 }}>
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