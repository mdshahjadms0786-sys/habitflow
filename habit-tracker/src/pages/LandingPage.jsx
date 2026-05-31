import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { setPlan } from '../utils/planUtils';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [statsCount, setStatsCount] = useState({ users: 0, habits: 0, streaks: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setStatsCount({
        users: Math.floor((50000 * step) / steps),
        habits: Math.floor((250000 * step) / steps),
        streaks: Math.floor((1800000 * step) / steps),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  const handleSelectPlan = (planId) => {
    setPlan(planId);
    localStorage.setItem('ht_selected_plan', planId);
    navigate('/onboarding');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const features = [
    { icon: '🔥', title: 'Smart Streaks', desc: 'AI-powered streak protection keeps you on track even when life gets chaotic.' },
    { icon: '🧠', title: 'AI Coaching', desc: 'Your personal habit coach available 24/7 with personalized strategies and motivation.' },
    { icon: '📊', title: 'Deep Analytics', desc: 'Visualize patterns with heatmaps, correlations, and AI-generated insights.' },
    { icon: '🎯', title: 'Goal Framework', desc: 'Set SMART goals with automatic breakdown into daily habits.' },
    { icon: '⏱️', title: 'Focus Mode', desc: 'Built-in Pomodoro timer with ambient sounds for maximum productivity.' },
    { icon: '💎', title: 'Life Score', desc: 'Track your overall life balance across 8 key areas with predictive insights.' },
    { icon: '🔗', title: 'Habit Stacks', desc: 'Chain habits together using proven neuroscience-based stacking techniques.' },
    { icon: '🏆', title: 'Gamification', desc: 'Earn badges, join leagues, and compete with friends to stay motivated.' },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Elite Member', avatar: '👩‍💻', text: "The AI Coach completely changed my life. It's like having a therapist and productivity expert in my pocket.", color: '#BA7517' },
    { name: 'Mark Thompson', role: 'Pro Member', avatar: '👨‍🎨', text: "I've tried 10 different habit apps. This is the only one that stuck. The streak tracking is incredibly satisfying.", color: '#534AB7' },
    { name: 'Emily Rodriguez', role: 'Free Member', avatar: '🏃‍♀️', text: "Even the free version is phenomenal. Simple, clean, and fast. Highly recommend to everyone.", color: '#888780' },
    { name: 'James Chen', role: 'Pro Member', avatar: '👨‍💼', text: "Went from 0 to 30+ day streaks on all my habits. The AI insights helped me understand my patterns.", color: '#534AB7' },
    { name: 'Priya Sharma', role: 'Elite Member', avatar: '👩‍🔬', text: "The Life Score feature helped me achieve work-life balance for the first time in my career.", color: '#BA7517' },
    { name: 'Alex Kim', role: 'Pro Member', avatar: '🎮', text: "Gamification is top-notch! I actually look forward to completing my daily habits now.", color: '#534AB7' },
  ];

  const faqs = [
    { q: 'Can I cancel anytime?', a: 'Yes! You can cancel your subscription anytime. No hidden fees, no questions asked.' },
    { q: 'Is there a free trial?', a: 'Pro plan includes a 14-day free trial. No credit card required to start.' },
    { q: 'What makes HabitFlow different?', a: 'Unlike other apps, we combine AI coaching, deep analytics, and gamification to create a complete habit transformation system.' },
    { q: 'Can I use it on multiple devices?', a: 'Yes! Your data syncs across all devices. Pro supports 3 devices, Elite supports unlimited.' },
    { q: 'Is my data secure?', a: 'Absolutely. We use bank-level encryption and never sell your personal data.' },
  ];

  const howItWorks = [
    { step: '01', title: 'Choose Your Plan', desc: 'Start free or upgrade to unlock powerful features' },
    { step: '02', title: 'Create Your Habits', desc: 'Pick from 40+ templates or create custom habits' },
    { step: '03', title: 'Track Daily', desc: 'Complete habits and watch your streaks grow' },
    { step: '04', title: 'Get AI Insights', desc: 'Receive personalized coaching and analytics' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', color: 'var(--text)', overflowX: 'hidden' }}>
      {/* FLOATING BACKGROUND */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <motion.div 
          animate={{ x: mousePosition.x * 50, y: mousePosition.y * 50 }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <motion.div 
          animate={{ x: -mousePosition.x * 30, y: -mousePosition.y * 30 }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* HEADER */}
      <header style={{ position: 'relative', zIndex: 10, padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(10px)', background: 'rgba(var(--bg-rgb, 15, 15, 15), 0.8)' }}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
          }}>
            ⚡
          </div>
          <div style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>HabitFlow</span>
          </div>
        </motion.div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate('/login')} style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', fontWeight: 600, fontSize: '15px', padding: '8px 16px' }}>Login</button>
          <button 
            onClick={() => document.getElementById('plans-section').scrollIntoView({ behavior: 'smooth' })} 
            style={{ 
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', 
              color: 'white', 
              border: 'none', 
              padding: '10px 24px', 
              borderRadius: '10px', 
              cursor: 'pointer', 
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(139, 92, 246, 0.3)',
            }}
          >
            Get Started →
          </button>
        </div>
      </header>

      <main style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
        {/* HERO SECTION */}
        <section style={{ textAlign: 'center', padding: '80px 0 60px', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'var(--surface)',
              borderRadius: '30px',
              border: '1px solid var(--border)',
              marginBottom: '24px',
              fontSize: '14px',
            }}
          >
            <span style={{ fontSize: '16px' }}>🚀</span>
            <span style={{ color: 'var(--text-secondary)' }}>Join 50,000+ habit builders</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, marginBottom: '24px', lineHeight: 1.1, letterSpacing: '-0.02em' }}
          >
            <span style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Build habits that stick.<br />
            </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 600 }}>
              Track progress that matters.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '600px', lineHeight: 1.6 }}
          >
            The ultimate productivity OS. AI-powered coaching, deep analytics, and gamification that transforms how you build habits.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectPlan('free')}
              style={{ 
                padding: '16px 32px', 
                borderRadius: '12px', 
                background: 'transparent', 
                color: 'var(--text)', 
                border: '2px solid var(--border)', 
                fontSize: '1rem', 
                fontWeight: 600, 
                cursor: 'pointer',
              }}
            >
              Start Free Forever
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('plans-section').scrollIntoView({ behavior: 'smooth' })}
              style={{ 
                padding: '16px 32px', 
                borderRadius: '12px', 
                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', 
                color: 'white', 
                border: 'none', 
                fontSize: '1rem', 
                fontWeight: 600, 
                cursor: 'pointer', 
                boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.4)',
              }}
            >
              View All Plans
            </motion.button>
          </motion.div>

          {/* STATS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{ display: 'flex', gap: '48px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            {[
              { value: statsCount.users, suffix: '+', label: 'Active Users' },
              { value: statsCount.habits, suffix: '+', label: 'Habits Tracked' },
              { value: statsCount.streaks, suffix: '+', label: 'Day Streaks' },
            ].map((stat, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {stat.value.toLocaleString()}{stat.suffix}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ padding: '60px 0' }}>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>How It Works</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>From zero to hero in 4 simple steps</p>
            </motion.div>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
              {howItWorks.map((item, idx) => (
                <motion.div 
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  style={{ 
                    background: 'var(--surface)', 
                    padding: '28px 24px', 
                    borderRadius: '20px', 
                    border: '1px solid var(--border)',
                    textAlign: 'center',
                    minWidth: '200px',
                    maxWidth: '220px',
                    flex: '1 1 200px',
                  }}
                >
                  <div style={{ 
                    fontSize: '2.5rem', 
                    fontWeight: 800, 
                    color: 'var(--primary)',
                    opacity: 0.3,
                    marginBottom: '16px',
                  }}>
                    {item.step}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* FEATURES GRID */}
        <section style={{ padding: '60px 0' }}>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>Everything You Need</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                Powerful features designed to make habit building effortless and enjoyable
              </p>
            </motion.div>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', maxWidth: '800px', margin: '0 auto' }}>
              {features.map((feature, idx) => (
                <motion.div 
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  style={{ 
                    background: 'var(--surface)', 
                    padding: '24px 20px', 
                    borderRadius: '16px', 
                    border: '1px solid var(--border)',
                    cursor: 'default',
                    minWidth: '180px',
                    maxWidth: '200px',
                    flex: '1 1 180px',
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>{feature.icon}</div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>{feature.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* PLAN SELECTION */}
        <section id="plans-section" style={{ padding: '80px 0' }}>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '16px' }}>Choose Your Plan</h2>
              <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)' }}>Simple, transparent pricing. No hidden fees. Cancel anytime.</p>
            </motion.div>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', alignItems: 'stretch' }}>
              {/* FREE CARD */}
              <motion.div 
                whileHover={{ y: -8 }}
                variants={itemVariants}
                style={{ background: 'var(--surface)', padding: '32px 24px', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', height: '100%', minWidth: '250px', maxWidth: '280px', flex: '1 1 260px' }}
              >
                <div style={{ display: 'inline-block', padding: '6px 14px', background: 'rgba(136, 135, 128, 0.1)', color: '#888780', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px', alignSelf: 'flex-start' }}>
                  🆓 Free Forever
                </div>
                <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '8px' }}>
                  ₹0<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/month</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>Perfect for getting started</p>
                
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>✅ <strong>3 habits</strong></li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>✅ Basic streak tracking</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>✅ 7 days history</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>✅ 3 template packs</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>✅ Dark mode</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', color: 'var(--text-secondary)', opacity: 0.5 }}>❌ AI features</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', color: 'var(--text-secondary)', opacity: 0.5 }}>❌ Focus Mode</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', color: 'var(--text-secondary)', opacity: 0.5 }}>❌ Advanced analytics</li>
                </ul>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectPlan('free')}
                  style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'transparent', border: '2px solid var(--border)', color: 'var(--text)', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
                >
                  Start Free →
                </motion.button>
              </motion.div>

              {/* PRO CARD */}
              <motion.div 
                whileHover={{ y: -12 }}
                variants={itemVariants}
                style={{ background: 'var(--surface)', padding: '36px 24px', borderRadius: '24px', border: '2px solid #534AB7', position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', boxShadow: '0 20px 40px -10px rgba(83, 74, 183, 0.2)', minWidth: '250px', maxWidth: '280px', flex: '1 1 260px' }}
              >
                <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #534AB7, #8b5cf6)', color: 'white', padding: '8px 20px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, boxShadow: '0 4px 12px rgba(83, 74, 183, 0.3)' }}>
                  Most Popular 🔥
                </div>
                <div style={{ display: 'inline-block', padding: '6px 14px', background: 'rgba(83, 74, 183, 0.1)', color: '#534AB7', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px', alignSelf: 'flex-start' }}>
                  💎 Pro
                </div>
                <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '8px' }}>
                  ₹199<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/month</span>
                </div>
                <p style={{ color: '#534AB7', fontSize: '0.9rem', fontWeight: 500, marginBottom: '24px' }}>14-day free trial included</p>
                
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>✅ <strong>Unlimited habits</strong></li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>✅ All 40+ template packs</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>✅ <strong>AI Coach (unlimited)</strong></li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>✅ Focus Mode + Pomodoro</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>✅ Journal + Mood tracking</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>✅ Vision Board & Goals</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>✅ Life Score dashboard</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>✅ Full analytics + DNA</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>✅ Leagues & Challenges</li>
                </ul>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectPlan('pro')}
                  style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#534AB7', border: 'none', color: 'white', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(83, 74, 183, 0.3)' }}
                >
                  Start Pro Free Trial →
                </motion.button>
              </motion.div>

              {/* ELITE CARD */}
              <motion.div 
                whileHover={{ y: -8 }}
                variants={itemVariants}
                style={{ background: 'var(--surface)', padding: '32px 24px', borderRadius: '20px', border: '2px solid #BA7517', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', minWidth: '250px', maxWidth: '280px', flex: '1 1 260px' }}
              >
                <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #BA7517, #f59e0b)', color: 'white', padding: '8px 20px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, boxShadow: '0 4px 12px rgba(186, 117, 23, 0.3)' }}>
                  For Serious Achievers 👑
                </div>
                <div style={{ display: 'inline-block', padding: '6px 14px', background: 'rgba(186, 117, 23, 0.1)', color: '#BA7517', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px', marginTop: '16px', alignSelf: 'flex-start' }}>
                  Elite
                </div>
                <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '8px' }}>
                  ₹499<span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/month</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>For habit masters</p>
                
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>✅ <strong>Everything in Pro</strong></li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>✅ <strong>AI Life Coach Pro</strong></li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>✅ Weekly coaching sessions</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>✅ Custom AI personality</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>✅ Deep behavior analysis</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>✅ Team/Family spaces</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>✅ API access</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem' }}>✅ Priority support</li>
                </ul>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectPlan('elite')}
                  style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'linear-gradient(135deg, #BA7517, #f59e0b)', border: 'none', color: 'white', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(186, 117, 23, 0.3)' }}
                >
                  Go Elite →
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* TESTIMONIALS */}
        <section style={{ padding: '80px 0', textAlign: 'center' }}>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>Loved by Achievers</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '48px' }}>Join thousands who've transformed their lives</p>
            </motion.div>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', maxWidth: '850px', margin: '0 auto' }}>
              {testimonials.map((testimonial, idx) => (
                <motion.div 
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  style={{ 
                    background: 'var(--surface)', 
                    padding: '24px 20px', 
                    borderRadius: '16px', 
                    border: '1px solid var(--border)',
                    textAlign: 'left',
                    minWidth: '260px',
                    maxWidth: '280px',
                    flex: '1 1 260px',
                  }}
                >
                  <p style={{ fontStyle: 'italic', marginBottom: '20px', color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>"{testimonial.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ 
                      fontSize: '32px', 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '50%', 
                      background: `${testimonial.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{testimonial.name}</div>
                      <div style={{ fontSize: '0.85rem', color: testimonial.color, fontWeight: 600 }}>{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* FAQ SECTION */}
        <section style={{ padding: '60px 0' }}>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>Frequently Asked Questions</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Everything you need to know</p>
            </motion.div>

            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {faqs.map((faq, idx) => (
                <motion.div 
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  style={{ 
                    background: 'var(--surface)', 
                    borderRadius: '16px', 
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      background: 'transparent',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text)' }}>{faq.q}</span>
                    <span style={{ 
                      fontSize: '1.2rem', 
                      color: 'var(--text-secondary)',
                      transform: activeFAQ === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}>▼</span>
                  </button>
                  <AnimatePresence>
                    {activeFAQ === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p style={{ padding: '0 24px 20px', color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA BANNER */}
        <section style={{ padding: '80px 0' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              borderRadius: '24px',
              padding: '48px 32px',
              textAlign: 'center',
              color: 'white',
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>Ready to Transform Your Life?</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '32px', opacity: 0.9 }}>Join thousands already building better habits. Start free today.</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectPlan('free')}
              style={{
                background: 'white',
                color: '#8b5cf6',
                border: 'none',
                padding: '16px 40px',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              }}
            >
              Start Free Now 🚀
            </motion.button>
          </motion.div>
        </section>
      </main>
      
      {/* FOOTER */}
      <footer style={{ 
        borderTop: '1px solid var(--border)', 
        padding: '60px 24px 40px', 
        textAlign: 'center', 
        marginTop: '40px',
        background: 'var(--surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
          }}>
            ⚡
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800 }}>HabitFlow</div>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>Build habits that stick. Track progress that matters.</p>
        
        {/* TRUST BADGES */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span>🔒</span> Bank-level Security
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span>⭐</span> 4.9/5 Rating
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span>📱</span> iOS & Android
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
          <span style={{ cursor: 'pointer', hover: { color: 'var(--text)' } }}>Privacy Policy</span>
          <span style={{ cursor: 'pointer' }}>Terms of Service</span>
          <span style={{ cursor: 'pointer' }}>Contact Us</span>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          © 2026 HabitFlow. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;