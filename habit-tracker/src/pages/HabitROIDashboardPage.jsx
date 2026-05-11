import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePlanContext } from '../context/PlanContext';
import { useHabitContext } from '../context/HabitContext';

const HABIT_ROI_DATA = {
  exercise: { hourlyValue: 500, healthMultiplier: 1.5 },
  reading: { hourlyValue: 300, healthMultiplier: 1.2 },
  meditation: { hourlyValue: 400, healthMultiplier: 1.3 },
  sleep: { hourlyValue: 600, healthMultiplier: 1.4 },
  healthy_eating: { hourlyValue: 400, healthMultiplier: 1.3 },
  no_junk_food: { yearlySavings: 36500 },
  no_smoking: { yearlySavings: 73000 },
  no_alcohol: { yearlySavings: 36500 },
};

function HabitROIDashboardPage() {
  const planCtx = usePlanContext();
  const hasFeature = planCtx.hasFeature;
  const { habits } = useHabitContext();
  const [habitROI, setHabitROI] = useState([]);
  const [totalImpact, setTotalImpact] = useState(0);
  const [lifetimeImpact, setLifetimeImpact] = useState(0);

  if (!hasFeature('habitROIDashboard')) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h2>🚫 Elite Feature</h2>
        <p>This feature is available for Elite users only.</p>
      </div>
    );
  }

  useEffect(() => {
    calculateROI();
  }, [habits]);

  const calculateROI = () => {
    const roiData = habits.map(habit => {
      const nameLower = habit.name.toLowerCase();
      let yearlyValue = 0;
      let description = '';

      if (nameLower.includes('exercise') || nameLower.includes('workout') || nameLower.includes('run')) {
        yearlyValue = 182500;
        description = 'Based on productivity & health gains';
      } else if (nameLower.includes('read')) {
        yearlyValue = 109500;
        description = 'Knowledge compounding effect';
      } else if (nameLower.includes('meditat') || nameLower.includes('mindful')) {
        yearlyValue = 146000;
        description = 'Stress reduction & focus';
      } else if (nameLower.includes('sleep')) {
        yearlyValue = 219000;
        description = 'Performance multiplier';
      } else if (nameLower.includes('healthy') || nameLower.includes('nutrition')) {
        yearlyValue = 146000;
        description = 'Medical cost savings';
      } else if (nameLower.includes('no junk') || nameLower.includes('fast food')) {
        yearlyValue = 36500;
        description = 'Food cost savings';
      } else if (nameLower.includes('no smok')) {
        yearlyValue = 73000;
        description = 'Healthcare & lifestyle';
      } else if (nameLower.includes('learn') || nameLower.includes('skill')) {
        yearlyValue = 146000;
        description = 'Career advancement';
      } else {
        yearlyValue = 36500;
        description = 'Personal development';
      }

      const streakBonus = Math.min(habit.currentStreak / 30, 2);
      const actualValue = Math.round(yearlyValue * (1 + streakBonus * 0.5));

      return {
        habit,
        yearlyValue: actualValue,
        monthlyValue: Math.round(actualValue / 12),
        description,
        streakBonus: Math.round(streakBonus * 100),
      };
    });

    roiData.sort((a, b) => b.yearlyValue - a.yearlyValue);
    setHabitROI(roiData);

    const total = roiData.reduce((sum, r) => sum + r.yearlyValue, 0);
    setTotalImpact(total);
    setLifetimeImpact(total * 50);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
            Habit ROI Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Calculate the financial impact of your habits
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            padding: '32px',
            borderRadius: '24px',
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
              Yearly Impact
            </div>
            <div style={{ fontSize: '48px', fontWeight: 800 }}>
              ₹{(totalImpact / 100000).toFixed(1)}L
            </div>
            <div style={{ marginTop: '8px', fontSize: '14px', opacity: 0.9 }}>
              per year
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #BA7517, #f59e0b)',
            padding: '32px',
            borderRadius: '24px',
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
              Lifetime Impact (50 years)
            </div>
            <div style={{ fontSize: '48px', fontWeight: 800 }}>
              ₹{(lifetimeImpact / 1000000).toFixed(1)}M
            </div>
            <div style={{ marginTop: '8px', fontSize: '14px', opacity: 0.9 }}>
              projected
            </div>
          </div>

          <div style={{
            background: 'var(--surface)',
            padding: '32px',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Total Habits Tracked
            </div>
            <div style={{ fontSize: '48px', fontWeight: 800 }}>{habits.length}</div>
            <div style={{ marginTop: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              habits with ROI
            </div>
          </div>
        </div>

        <h2 style={{ marginBottom: '24px' }}>Habit Impact Breakdown</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {habitROI.map((item, idx) => (
            <motion.div
              key={item.habit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{
                background: 'var(--surface)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid var(--border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, #BA7517, #f59e0b)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 800,
                  color: 'white'
                }}>
                  #{idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '18px', marginBottom: '4px' }}>
                    {item.habit.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {item.description}
                    {item.streakBonus > 0 && (
                      <span style={{ marginLeft: '8px', color: '#22c55e' }}>
                        (+{item.streakBonus}% streak bonus)
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>
                    ₹{(item.yearlyValue / 1000).toFixed(0)}K
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    /year
                  </div>
                </div>
              </div>
              <div style={{
                marginTop: '12px',
                height: '4px',
                background: 'var(--border)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${Math.min((item.yearlyValue / habitROI[0].yearlyValue) * 100, 100)}%`,
                  height: '100%',
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                }} />
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{
          marginTop: '32px',
          padding: '24px',
          background: 'rgba(186, 117, 23, 0.1)',
          borderRadius: '16px',
          border: '1px solid #BA7517'
        }}>
          <h3 style={{ marginBottom: '12px' }}>💡 How ROI is Calculated</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Habit ROI is calculated based on research-backed data on health, productivity,
            and career impacts. Values increase with your streak - longer streaks mean
            more consistent habits, which compound your returns over time.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default HabitROIDashboardPage;