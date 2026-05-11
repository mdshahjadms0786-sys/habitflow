import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePlanContext } from '../context/PlanContext';
import { useHabitContext } from '../context/HabitContext';
import toast from 'react-hot-toast';

const PRE_BUILT_GOALS = [
  { id: 'fitness', name: 'Get Fit & Healthy', icon: '💪', duration: 90 },
  { id: 'productivity', name: 'Boost Productivity', icon: '⚡', duration: 90 },
  { id: 'mindfulness', name: 'Master Mindfulness', icon: '🧘', duration: 90 },
  { id: 'career', name: 'Accelerate Career', icon: '🚀', duration: 90 },
  { id: 'relationships', name: 'Improve Relationships', icon: '❤️', duration: 90 },
  { id: 'wealth', name: 'Build Wealth', icon: '💰', duration: 90 },
];

const WEEKLY_PHASES = [
  { week: 1, title: 'Foundation', focus: 'Build core habits, keep it simple' },
  { week: 2, title: 'Momentum', focus: 'Add challenging habits, stay consistent' },
  { week: 3, title: 'Integration', focus: 'Stack habits, create routines' },
  { week: 4, title: 'Optimization', focus: 'Fine-tune and adjust' },
  { week: 5, title: 'Expansion', focus: 'Add advanced habits' },
  { week: 6, title: 'Mastery', focus: 'Push boundaries' },
  { week: 7, title: 'Consolidation', focus: 'Lock in achievements' },
  { week: 8, title: 'Peak Performance', focus: 'Maximize results' },
  { week: 9, title: 'Sustainability', focus: 'Make it automatic' },
  { week: 10, title: 'Reflection', focus: 'Review and plan' },
  { week: 11, title: 'Growth', focus: 'Scale up' },
  { week: 13, title: 'Achievement', focus: 'Celebrate wins' },
];

function AIHabitArchitectPage() {
  const planCtx = usePlanContext();
  const hasFeature = planCtx.hasFeature;
  const { habits, addHabit } = useHabitContext();
  const [step, setStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  if (!hasFeature('aiHabitArchitect')) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h2>🚫 Elite Feature</h2>
        <p>This feature is available for Elite users only.</p>
      </div>
    );
  }

  const generatePlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const plan = WEEKLY_PHASES.map(phase => ({
        ...phase,
        habits: generateHabitsForPhase(phase, selectedGoal),
      }));
      setGeneratedPlan(plan);
      setIsGenerating(false);
    }, 2000);
  };

  const generateHabitsForPhase = (phase, goal) => {
    const baseHabits = {
      fitness: [
        { name: 'Morning Walk 15 min', difficulty: 'easy', time: 'morning' },
        { name: 'Stretch 5 min', difficulty: 'easy', time: 'morning' },
        { name: 'Drink 2L Water', difficulty: 'easy', time: 'all' },
        { name: 'No Junk Food', difficulty: 'hard', time: 'all' },
        { name: '8 Hour Sleep', difficulty: 'medium', time: 'night' },
      ],
      productivity: [
        { name: 'Plan Day (5 min)', difficulty: 'easy', time: 'morning' },
        { name: 'Deep Work 2 hr', difficulty: 'hard', time: 'morning' },
        { name: 'No Social Media 2 hr', difficulty: 'hard', time: 'all' },
        { name: 'Review Goals', difficulty: 'medium', time: 'evening' },
        { name: 'Learn 30 min', difficulty: 'medium', time: 'evening' },
      ],
      mindfulness: [
        { name: 'Meditate 10 min', difficulty: 'easy', time: 'morning' },
        { name: 'Breathing Exercise', difficulty: 'easy', time: 'afternoon' },
        { name: 'Gratitude Journal', difficulty: 'easy', time: 'evening' },
        { name: 'No Phone 1 hr', difficulty: 'medium', time: 'evening' },
        { name: 'Reflect on Day', difficulty: 'medium', time: 'night' },
      ],
      career: [
        { name: 'Skill Learning 1 hr', difficulty: 'hard', time: 'morning' },
        { name: 'Network 15 min', difficulty: 'medium', time: 'all' },
        { name: 'Update Portfolio', difficulty: 'medium', time: 'evening' },
        { name: 'Read Industry News', difficulty: 'easy', time: 'morning' },
        { name: 'Practice Interview', difficulty: 'hard', time: 'weekend' },
      ],
      relationships: [
        { name: 'Call Family 10 min', difficulty: 'easy', time: 'evening' },
        { name: 'Quality Time 30 min', difficulty: 'medium', time: 'evening' },
        { name: 'Listen Actively', difficulty: 'hard', time: 'all' },
        { name: 'Express Gratitude', difficulty: 'easy', time: 'all' },
        { name: 'Plan Date Activity', difficulty: 'medium', time: 'weekend' },
      ],
      wealth: [
        { name: 'Track Expenses', difficulty: 'easy', time: 'evening' },
        { name: 'Read Finance 30 min', difficulty: 'medium', time: 'morning' },
        { name: 'Save 10% Income', difficulty: 'hard', time: 'all' },
        { name: 'Review Investments', difficulty: 'medium', time: 'weekend' },
        { name: 'Side Hustle 1 hr', difficulty: 'hard', time: 'evening' },
      ],
    };
    return baseHabits[goal?.id] || baseHabits.fitness;
  };

  const applyPlan = () => {
    if (!generatedPlan) return;
    
    generatedPlan.forEach(week => {
      week.habits.forEach((habit, idx) => {
        addHabit({
          id: `${Date.now()}-${idx}`,
          name: habit.name,
          difficulty: habit.difficulty,
          time: habit.time,
          category: selectedGoal?.id || 'general',
          createdAt: new Date().toISOString(),
          completionLog: {},
          currentStreak: 0,
          longestStreak: 0,
          isActive: true,
        });
      });
    });

    toast.success('🎉 90-day plan applied! Good luck!');
    setStep(3);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏗️</div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
            AI Habit Architect
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Your personalized 90-day transformation plan
          </p>
        </div>

        {step === 0 && (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>
              What's your primary goal?
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '32px'
            }}>
              {PRE_BUILT_GOALS.map((goal) => (
                <motion.button
                  key={goal.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedGoal(goal);
                    setStep(1);
                  }}
                  style={{
                    padding: '24px',
                    background: 'var(--surface)',
                    border: '2px solid var(--border)',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>{goal.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: '1rem' }}>{goal.name}</div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>
              Selected: {selectedGoal?.icon} {selectedGoal?.name}
            </h2>
            <div style={{
              background: 'var(--surface)',
              padding: '24px',
              borderRadius: '16px',
              marginBottom: '24px'
            }}>
              <h3 style={{ marginBottom: '16px' }}>Your 90-Day Plan Includes:</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {['Week 1-4: Foundation Phase', 'Week 5-8: Growth Phase', 'Week 9-13: Mastery Phase'].map((phase, i) => (
                  <li key={i} style={{
                    padding: '12px 0',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{ fontSize: '20px' }}>✅</span>
                    {phase}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setStep(0)}
                style={{
                  padding: '12px 24px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Back
              </button>
              <button
                onClick={() => {
                  setStep(2);
                  generatePlan();
                }}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #BA7517, #f59e0b)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Generate My Plan 🚀
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            {isGenerating ? (
              <div style={{ textAlign: 'center', padding: '48px' }}>
                <div style={{ fontSize: '48px', marginBottom: '24px' }}>⚙️</div>
                <h2>AI is building your custom plan...</h2>
                <div style={{
                  marginTop: '24px',
                  height: '4px',
                  background: 'var(--border)',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <motion.div
                    animate={{ width: ['0%', '100%'] }}
                    transition={{ duration: 2 }}
                    style={{
                      height: '100%',
                      background: 'linear-gradient(135deg, #BA7517, #f59e0b)'
                    }}
                  />
                </div>
              </div>
            ) : generatedPlan ? (
              <div>
                <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>
                  Your 90-Day Transformation Plan
                </h2>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {generatedPlan.map((week) => (
                    <div
                      key={week.week}
                      style={{
                        background: 'var(--surface)',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px'
                      }}>
                        <span style={{ fontWeight: 700, color: '#BA7517' }}>
                          Week {week.week}: {week.title}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px' }}>
                        Focus: {week.focus}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {week.habits.map((habit, idx) => (
                          <span
                            key={idx}
                            style={{
                              padding: '6px 12px',
                              background: 'rgba(186, 117, 23, 0.1)',
                              borderRadius: '20px',
                              fontSize: '0.85rem',
                            }}
                          >
                            {habit.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '32px' }}>
                  <button
                    onClick={() => setStep(1)}
                    style={{
                      padding: '12px 24px',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    Regenerate
                  </button>
                  <button
                    onClick={applyPlan}
                    style={{
                      padding: '12px 32px',
                      background: 'linear-gradient(135deg, #BA7517, #f59e0b)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Apply Plan to My Habits 🎯
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎉</div>
            <h2>Plan Applied Successfully!</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Your 90-day transformation journey has begun. Check your habits page to start!
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default AIHabitArchitectPage;