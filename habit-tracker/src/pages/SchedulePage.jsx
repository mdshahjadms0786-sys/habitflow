import { useState, useMemo } from 'react';
import ScheduleTimeBlock from '../components/Schedule/ScheduleTimeBlock';
import WeekScheduleView from '../components/Schedule/WeekScheduleView';
import SmartScheduleInsight from '../components/Schedule/SmartScheduleInsight';
import { useHabits } from '../hooks/useHabits';
import { 
  loadSchedule, saveSchedule, applySmartSchedule, 
  getScheduleForToday, getDayName
} from '../utils/schedulerUtils';
import { getTodayISO } from '../utils/dateUtils';
import toast from 'react-hot-toast';

const SchedulePage = () => {
  const { habits, toggleHabit } = useHabits();
  const [schedule, setSchedule] = useState(() => {
    const saved = loadSchedule();
    if (Object.keys(saved).length === 0) {
      const { schedule: newSchedule } = applySmartSchedule(habits);
      return newSchedule;
    }
    return saved;
  });
  const [activeTab, setActiveTab] = useState('today');
  const completionLog = useMemo(() => {
    const log = {};
    habits.forEach(h => { log[h.id] = h.completionLog || {}; });
    return log;
  }, [habits]);

  const todaySchedule = useMemo(() => getScheduleForToday(schedule), [schedule]);

  const optimalData = useMemo(() => {
    return applySmartSchedule(habits).optimalData;
  }, [habits]);

  const handleApplySchedule = () => {
    const { schedule: newSchedule } = applySmartSchedule(habits);
    setSchedule(newSchedule);
    saveSchedule(newSchedule);
    toast.success('Smart schedule applied! 📅');
  };

  const handleMarkComplete = (habitId) => {
    const today = getTodayISO();
    const habit = habits.find((item) => item.id === habitId);
    if (habit?.completionLog?.[today]) return;
    toggleHabit(habitId, today);
    toast.success('Habit marked complete!');
  };

  const currentHour = new Date().getHours();

  return (
    <div className="page-container" style={{ padding: '24px', paddingBottom: '80px' }}>
      <header
        style={{ marginBottom: '24px' }}
      >
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--text)' }}>
          Smart Scheduler 📅
        </h1>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Optimize your daily routine
        </p>
      </header>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {['today', 'week', 'insights'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              backgroundColor: activeTab === tab ? 'var(--primary)' : 'var(--surface)',
              color: activeTab === tab ? '#fff' : 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {tab === 'today' ? "Today's Schedule" : tab === 'week' ? 'This Week' : 'Insights'}
          </button>
        ))}
      </div>

      {activeTab === 'today' && (
        <div>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: 'var(--text)' }}>
            {getDayName(new Date()).charAt(0).toUpperCase() + getDayName(new Date()).slice(1)}
          </h2>

          {todaySchedule.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--surface)', borderRadius: '12px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                No habits scheduled. Generate a smart schedule!
              </p>
              <button
                onClick={handleApplySchedule}
                style={{
                  marginTop: '16px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Generate Schedule
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {todaySchedule.map(item => {
                const itemHour = parseInt(item.time.split(':')[0], 10);
                const isCurrent = itemHour <= currentHour && currentHour < itemHour + 1;
                const isCompleted = completionLog[item.habitId]?.[getTodayISO()];
                
                return (
                  <ScheduleTimeBlock
                    key={item.habitId}
                    time={item.time}
                    habit={item}
                    isCompleted={!!isCompleted}
                    isCurrent={isCurrent}
                    onComplete={() => handleMarkComplete(item.habitId)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'week' && (
        <div>
          <WeekScheduleView schedule={schedule} habits={habits} />
        </div>
      )}

      {activeTab === 'insights' && (
        <div>
          <SmartScheduleInsight 
            optimalData={optimalData} 
            onApply={handleApplySchedule} 
          />
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
