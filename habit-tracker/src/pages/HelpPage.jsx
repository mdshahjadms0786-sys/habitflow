import { useState } from 'react';
import { motion } from 'framer-motion';

const TABS = [
  { id: 'getting-started', label: 'Getting Started', icon: '🚀' },
  { id: 'features', label: 'Features Guide', icon: '📖' },
  { id: 'tips', label: 'Tips & Tricks', icon: '💡' },
  { id: 'faq', label: 'FAQ', icon: '❓' },
  { id: 'shortcuts', label: 'Shortcuts', icon: '⌨️' }
];

const GETTING_STARTED_STEPS = [
  {
    title: 'Add Your First Habit',
    desc: 'Click the + button on your dashboard to create your first habit. Choose a name, category, and difficulty level.',
    icon: '➕'
  },
  {
    title: 'Complete Daily Tasks',
    desc: 'Each day, mark your habits as complete by clicking on them. Watch your streak grow!',
    icon: '✅'
  },
  {
    title: 'Build Streaks',
    desc: 'Consistency is key! The more days you complete in a row, the higher your streak and rewards.',
    icon: '🔥'
  },
  {
    title: 'Earn Points & Badges',
    desc: 'Complete habits to earn points. Unlock achievements and badges along the way.',
    icon: '🏅'
  },
  {
    title: 'Track Progress',
    desc: 'Visit the Analytics page to see your progress over time and identify patterns.',
    icon: '📊'
  }
];

const FEATURES_LIST = [
  { name: 'Dashboard', desc: 'Your main hub for daily habit tracking', icon: '📊' },
  { name: 'All Habits', desc: 'View and manage all your habits', icon: '✅' },
  { name: 'Analytics', desc: 'Detailed statistics and insights', icon: '📈' },
  { name: 'Calendar', desc: 'Visual calendar view of completions', icon: '📅' },
  { name: 'Focus Mode', desc: 'Pomodoro timer for focused work', icon: '⏱️' },
  { name: 'Journal', desc: 'Daily journaling with AI analysis', icon: '📖' },
  { name: 'Mood Tracking', desc: 'Track your daily mood patterns', icon: '😊' },
  { name: 'AI Coach', desc: 'Get personalized habit advice', icon: '🤖' },
  { name: 'Achievements', desc: 'Earn badges and milestones', icon: '🏆' },
  { name: 'Vision Board', desc: 'Visualize your goals and dreams', icon: '🖼️' }
];

const TIPS = [
  { title: 'Start Small', desc: 'Begin with just 2-3 habits to avoid overwhelm' },
  { title: 'The 2-Minute Rule', desc: 'If a habit takes less than 2 minutes, do it immediately' },
  { title: 'Habit Stacking', desc: 'Link new habits to existing ones' },
  { title: 'Set Reminders', desc: 'Use daily reminders to stay on track' },
  { title: 'Track Consistency', desc: 'Focus on streaks, not perfection' },
  { title: 'Celebrate Wins', desc: 'Acknowledge your progress, big and small' },
  { title: 'Adjust Difficulty', desc: 'Start easy, gradually increase challenge' },
  { title: 'Use Templates', desc: 'Start with suggested habits for common goals' },
  { title: 'Review Weekly', desc: 'Check your progress every Sunday' },
  { title: 'Stay Accountable', desc: 'Share your goals with a friend' }
];

const FAQS = [
  { q: 'How do streaks work?', a: 'A streak counts consecutive days you complete a habit. Miss a day and your streak resets!' },
  { q: 'Can I edit my habits?', a: 'Yes! Click on any habit to edit its name, category, difficulty, or schedule.' },
  { q: 'What are points used for?', a: 'Points are a fun way to track your progress. You can also use them in the betting system!' },
  { q: 'How does Focus Mode work?', a: 'Focus Mode uses the Pomodoro technique - 25 minutes of focused work followed by a 5-minute break.' },
  { q: 'Is my data backed up?', a: 'Your data is stored locally. You can export your data from Settings as a backup.' },
  { q: 'How do I delete a habit?', a: 'Long-press or right-click on a habit to see the delete option.' },
  { q: 'Can I track habits for past dates?', a: 'Yes! Use the Time Travel feature to complete habits for past dates.' },
  { q: 'What is Emergency Mode?', a: 'Emergency Mode focuses on your top 3 most important habits to help you get back on track.' },
  { q: 'How does the AI Coach work?', a: 'AI Coach analyzes your habits and provides personalized suggestions based on your patterns.' },
  { q: 'How do I earn badges?', a: 'Badges are earned automatically when you reach certain milestones like streak lengths.' }
];

const SHORTCUTS = [
  { key: 'A', desc: 'Add new habit' },
  { key: 'D', desc: 'Go to Dashboard' },
  { key: 'H', desc: 'Go to Habits' },
  { key: 'S', desc: 'Go to Settings' },
  { key: 'F', desc: 'Enter Focus Mode' },
  { key: 'M', desc: 'Log mood' },
  { key: '?', desc: 'Open this help' },
  { key: 'Esc', desc: 'Close modal' },
  { key: 'Enter', desc: 'Confirm action' },
  { key: '/', desc: 'Search' }
];

const HelpPage = () => {
  const [activeTab, setActiveTab] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  
  const renderContent = () => {
    switch (activeTab) {
      case 'getting-started':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {GETTING_STARTED_STEPS.map((step, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.01 }}
                style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start'
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0
                  }}
                >
                  {step.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                    {idx + 1}. {step.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        );
        
      case 'features':
        const filteredFeatures = FEATURES_LIST.filter(f => 
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.desc.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return (
          <div>
            <input
              type="text"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg)',
                color: 'var(--text)',
                marginBottom: '20px',
                fontSize: '14px'
              }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {filteredFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderRadius: '12px',
                    padding: '16px'
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{feature.icon}</div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{feature.name}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'tips':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {TIPS.map((tip, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: '12px',
                  padding: '16px'
                }}
              >
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                  💡 {tip.title}
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{tip.desc}</p>
              </div>
            ))}
          </div>
        );
        
      case 'faq':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {FAQS.map((faq, idx) => (
              <details
                key={idx}
                style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer'
                }}
              >
                <summary style={{ fontWeight: '600', fontSize: '14px', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {faq.q}
                  <span style={{ fontSize: '20px' }}>▼</span>
                </summary>
                <p style={{ color: 'var(--text-secondary)', marginTop: '12px', fontSize: '13px' }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        );
        
      case 'shortcuts':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {SHORTCUTS.map((shortcut, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}
                >
                  {shortcut.key}
                </div>
                <span style={{ fontSize: '14px' }}>{shortcut.desc}</span>
              </div>
            ))}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px' }}>
        Help & Support ❓
      </h1>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: activeTab === tab.id ? 'var(--primary)' : 'var(--surface)',
              color: activeTab === tab.id ? '#fff' : 'var(--text)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};

export default HelpPage;