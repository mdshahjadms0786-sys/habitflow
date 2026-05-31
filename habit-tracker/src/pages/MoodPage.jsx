import { motion } from 'framer-motion';
import { useMoodContext } from '../context/MoodContext';
import { useHabitContext } from '../context/HabitContext';
import MoodCheckin from '../components/Mood/MoodCheckin';
import MoodInsights from '../components/Mood/MoodInsights';
import MoodHabitCorrelation from '../components/Mood/MoodHabitCorrelation';
import MoodCalendar from '../components/Mood/MoodCalendar';

const MoodPage = () => {
  const { moodLog } = useMoodContext();
  const { habits } = useHabitContext();
  const totalLogs = Object.keys(moodLog || {}).length;

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
          Mood Tracker 😊
        </h1>
        <p
          style={{
            margin: '8px 0 0 0',
            fontSize: '14px',
            color: 'var(--text-secondary)',
          }}
        >
          Track your daily mood and discover patterns
        </p>
      </motion.header>

      {totalLogs < 3 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            border: '1px solid var(--border)',
            textAlign: 'center',
            fontSize: '14px',
            color: 'var(--text-secondary)',
          }}
        >
          Start logging your mood daily to see insights! 🌟
        </motion.div>
      )}

      {/* Mood Checkin - Full Width */}
      <div style={{ marginBottom: '24px' }}>
        <MoodCheckin />
      </div>

      {/* Mood Insights - 2x2 Grid */}
      <div style={{ marginBottom: '24px' }}>
        <MoodInsights moodLog={moodLog || {}} />
      </div>

      {/* Mood Habit Correlation */}
      <div style={{ marginBottom: '24px' }}>
        <MoodHabitCorrelation moodLog={moodLog || {}} habits={habits || []} />
      </div>

      {/* Mood Calendar */}
      <MoodCalendar />
    </div>
  );
};

export default MoodPage;
