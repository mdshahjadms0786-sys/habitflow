import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../hooks/useHabits';
import { useStreaks } from '../hooks/useStreak';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMoodContext } from '../context/MoodContext';
import { getLast30DaysMoods, getMoodById } from '../utils/moodUtils';
import CompletionBarChart from '../components/Analytics/CompletionBarChart';
import CategoryPieChart from '../components/Analytics/CategoryPieChart';
import StreakLineChart from '../components/Analytics/StreakLineChart';
import MonthlyHeatmap from '../components/Analytics/MonthlyHeatmap';
import TimeOfDayChart from '../components/Analytics/TimeOfDayChart';
import WeekdayAnalysis from '../components/Analytics/WeekdayAnalysis';
import HabitComparison from '../components/Analytics/HabitComparison';
import PersonalRecords from '../components/Analytics/PersonalRecords';
import EmptyState from '../components/UI/EmptyState';

const Analytics = () => {
  const { habits, allTimeCompletions, bestStreak, habitWithBestStreak, mostConsistentDay } = useHabits();
  const { bestLongestStreak } = useStreaks(habits);
  const { moodLog } = useMoodContext();

  const moodChartData = useMemo(() => {
    const all30 = getLast30DaysMoods(moodLog || {});
    return all30.slice(-14).map((d) => ({
      date: d.date,
      label: d.day,
      score: d.mood ? d.mood.id : null,
      emoji: d.mood ? d.mood.emoji : '',
      moodLabel: d.mood ? d.mood.label : '',
    }));
  }, [moodLog]);

  const summaryStats = useMemo(
    () => [
      {
        label: 'Total Habits Created',
        value: habits.length,
        icon: '📝',
        color: '#6366f1',
      },
      {
        label: 'Total Completions',
        value: allTimeCompletions,
        icon: '✅',
        color: '#22c55e',
      },
      {
        label: 'Best Streak Habit',
        value: habitWithBestStreak?.name || 'N/A',
        icon: '🔥',
        color: '#f97316',
        subValue: habitWithBestStreak ? `${bestStreak} days` : '',
      },
      {
        label: 'Most Consistent Day',
        value: mostConsistentDay,
        icon: '📅',
        color: '#8b5cf6',
      },
    ],
    [habits.length, allTimeCompletions, habitWithBestStreak, bestStreak, mostConsistentDay]
  );

  return (
    <div className="page-container" style={{ padding: '24px', paddingBottom: '80px' }}>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px' }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--text)',
          }}
        >
          Analytics & Insights
        </h1>
        <p
          style={{
            margin: '8px 0 0 0',
            fontSize: '14px',
            color: 'var(--text-secondary)',
          }}
        >
          Track your progress and patterns
        </p>
      </motion.header>

      {habits.length === 0 ? (
        <EmptyState
          icon="📊"
          title="No data yet"
          description="Start tracking habits to see your analytics!"
        />
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            {summaryStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{stat.icon}</span>
                </div>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      fontWeight: '500',
                    }}
                  >
                    {stat.label}
                  </p>
                  <p
                    style={{
                      margin: '4px 0 0 0',
                      fontSize: stat.value.length > 15 ? '16px' : '20px',
                      fontWeight: '700',
                      color: stat.color,
                    }}
                  >
                    {stat.value}
                  </p>
                  {stat.subValue && (
                    <p
                      style={{
                        margin: '4px 0 0 0',
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {stat.subValue}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <CompletionBarChart habits={habits} />
            <CategoryPieChart habits={habits} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <StreakLineChart habits={habits} />
          </div>

          <div>
            <MonthlyHeatmap habits={habits} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: '24px',
              backgroundColor: 'var(--surface)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid var(--border)',
            }}
          >
            <h3
              style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--text)',
              }}
            >
              Mood Trend 📈
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={moodChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                  stroke="var(--border)"
                />
                <YAxis
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                  stroke="var(--border)"
                />
                <Tooltip
                  formatter={(value) => {
                    const item = moodChartData.find((d) => d.score === value);
                    return value ? [`${item?.emoji} ${item?.moodLabel}`, 'Mood'] : ['No data'];
                  }}
                  labelFormatter={(label) => {
                    const item = moodChartData.find((d) => d.label === label);
                    return item?.date || label;
                  }}
                  contentStyle={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#534AB7"
                  strokeWidth={2}
                  dot={{ fill: '#534AB7', r: 3 }}
                  activeDot={{ r: 5 }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '24px' }}
          >
            <h3
              style={{
                margin: '0 0 16px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--text)',
              }}
            >
              Advanced Analytics 📊
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px',
              }}
            >
              <TimeOfDayChart />
              <WeekdayAnalysis />
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px',
                marginTop: '16px',
              }}
            >
              <HabitComparison />
              <PersonalRecords />
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Analytics;
