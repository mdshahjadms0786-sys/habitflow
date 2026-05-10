import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { setPlan } from '../utils/planUtils';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (planId) => {
    setPlan(planId);
    // Setting a flag so onboarding knows the user chose a plan
    localStorage.setItem('ht_selected_plan', planId);
    navigate('/onboarding');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', color: 'var(--text)', overflowX: 'hidden' }}>
      {/* HEADER */}
      <header style={{ padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          HabitFlow
        </div>
        <div>
          <button onClick={() => navigate('/login')} style={{ background: 'transparent', border: 'none', color: 'var(--text)', marginRight: '24px', cursor: 'pointer', fontWeight: 600 }}>Login</button>
          <button onClick={() => document.getElementById('plans-section').scrollIntoView({ behavior: 'smooth' })} style={{ background: '#8b5cf6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Get Started</button>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* HERO SECTION */}
        <section style={{ textAlign: 'center', padding: '80px 0', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '24px', lineHeight: 1.1, background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Build habits that stick.<br />Track progress that matters.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '48px', maxWidth: '600px' }}
          >
            Join thousands building better lives, one habit at a time. The ultimate productivity and self-improvement OS.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}
          >
            <button 
              onClick={() => handleSelectPlan('free')}
              style={{ padding: '16px 32px', borderRadius: '12px', background: 'transparent', color: 'var(--text)', border: '2px solid var(--border)', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Start Free
            </button>
            <button 
              onClick={() => document.getElementById('plans-section').scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '16px 32px', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: 'white', border: 'none', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.4)' }}
            >
              View Plans
            </button>
          </motion.div>
        </section>

        {/* FEATURES PREVIEW */}
        <section style={{ padding: '80px 0' }}>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}
          >
            <motion.div variants={itemVariants} style={{ background: 'var(--surface)', padding: '32px', borderRadius: '24px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔥</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Streak Tracking</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Never break your chain. Visualize your consistency and build unstoppable momentum.</p>
            </motion.div>
            
            <motion.div variants={itemVariants} style={{ background: 'var(--surface)', padding: '32px', borderRadius: '24px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>AI Coaching</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Your personal AI life coach providing daily insights, motivation, and strategic planning.</p>
            </motion.div>
            
            <motion.div variants={itemVariants} style={{ background: 'var(--surface)', padding: '32px', borderRadius: '24px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Deep Analytics</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Understand your behavior patterns with comprehensive charts, heatmaps, and correlations.</p>
            </motion.div>
          </motion.div>
        </section>

        {/* PLAN SELECTION */}
        <section id="plans-section" style={{ padding: '80px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px' }}>Choose Your Plan</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Simple, transparent pricing. Cancel anytime.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center' }}>
            {/* FREE CARD */}
            <motion.div 
              whileHover={{ y: -8 }}
              style={{ background: 'var(--surface)', padding: '40px 32px', borderRadius: '24px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <div style={{ display: 'inline-block', padding: '6px 12px', background: 'rgba(136, 135, 128, 0.1)', color: '#888780', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px' }}>
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
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>✅ Dark/light mode</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', opacity: 0.5 }}>❌ AI features</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', opacity: 0.5 }}>❌ Focus mode</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', opacity: 0.5 }}>❌ Advanced analytics</li>
              </ul>
              <button 
                onClick={() => handleSelectPlan('free')}
                style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'transparent', border: '2px solid var(--border)', color: 'var(--text)', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer' }}
              >
                Start Free →
              </button>
            </motion.div>

            {/* PRO CARD */}
            <motion.div 
              whileHover={{ y: -8 }}
              style={{ background: 'var(--surface)', padding: '48px 32px', borderRadius: '24px', border: '2px solid #534AB7', position: 'relative', display: 'flex', flexDirection: 'column', height: '105%', boxShadow: '0 20px 40px -10px rgba(83, 74, 183, 0.2)' }}
            >
              <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #534AB7, #8b5cf6)', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
                Most Popular 🔥
              </div>
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
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>✅ All history & Export</li>
              </ul>
              <button 
                onClick={() => handleSelectPlan('pro')}
                style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#534AB7', border: 'none', color: 'white', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(83, 74, 183, 0.3)' }}
              >
                Start Pro →
              </button>
            </motion.div>

            {/* ELITE CARD */}
            <motion.div 
              whileHover={{ y: -8 }}
              style={{ background: 'var(--surface)', padding: '40px 32px', borderRadius: '24px', border: '1px solid #BA7517', display: 'flex', flexDirection: 'column', height: '100%' }}
            >
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
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>✅ Unlimited devices</li>
              </ul>
              <button 
                onClick={() => handleSelectPlan('elite')}
                style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'linear-gradient(135deg, #BA7517, #f59e0b)', border: 'none', color: 'white', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(186, 117, 23, 0.3)' }}
              >
                Go Elite →
              </button>
            </motion.div>
          </div>
        </section>
        
        {/* TESTIMONIALS */}
        <section style={{ padding: '80px 0', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '48px' }}>Loved by Achievers</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'left' }}>
              <p style={{ fontStyle: 'italic', marginBottom: '16px', color: 'var(--text-secondary)' }}>"The AI Coach completely changed my life. It's like having a therapist and productivity expert in my pocket."</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '24px' }}>👩‍💻</div>
                <div>
                  <div style={{ fontWeight: 600 }}>Sarah J.</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Elite Member</div>
                </div>
              </div>
            </div>
            
            <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'left' }}>
              <p style={{ fontStyle: 'italic', marginBottom: '16px', color: 'var(--text-secondary)' }}>"I've tried 10 different habit apps. This is the only one that stuck. The streak tracking is incredibly satisfying."</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '24px' }}>👨‍🎨</div>
                <div>
                  <div style={{ fontWeight: 600 }}>Mark T.</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Pro Member</div>
                </div>
              </div>
            </div>
            
            <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'left' }}>
              <p style={{ fontStyle: 'italic', marginBottom: '16px', color: 'var(--text-secondary)' }}>"Even the free version is phenomenal. Simple, clean, and fast. Highly recommend to everyone."</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '24px' }}>🏃‍♀️</div>
                <div>
                  <div style={{ fontWeight: 600 }}>Emily R.</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Free Member</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '48px 24px', textAlign: 'center', marginTop: '40px' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>HabitFlow</div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Build habits that stick. Track progress that matters.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <span style={{ cursor: 'pointer' }}>Privacy</span>
          <span style={{ cursor: 'pointer' }}>Terms</span>
          <span style={{ cursor: 'pointer' }}>Contact</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
