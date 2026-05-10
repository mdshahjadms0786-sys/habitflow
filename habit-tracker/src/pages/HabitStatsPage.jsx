import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useHabits } from '../hooks/useHabits';
import { loadHabits } from '../utils/db';
import { calculateCurrentStreak, calculateLongestStreak } from '../utils/streakUtils';
import { getPointsForHabit } from '../utils/pointsUtils';
import { getHabitJournal } from '../utils/journalUtils';

const CATEGORY_COLORS = {
  Health: '#14b8a6',
  Work: '#3b82f6',
  Personal: '#8b5cf6',
  Fitness: '#f97316',
  Learning: '#f59e0b'
};

const DIFFICULTY_LABELS = {
  easy: { label: 'Easy', color: '#22c55e' },
  medium: { label: 'Medium', color: '#f59e0b' },
  hard: { label: 'Hard', color: '#ef4444' },
  extreme: { label: 'Extreme', color: '#dc2626' }
};

const HabitStatsPage = () => {
  const { habitId } = useParams();
  const navigate = useNavigate();
  const { habits } = useHabits();
  const [habit, setHabit] = useState(null);
  
  useEffect(() => {
    const found = habits.find(h => h.id === habitId);
    if (found) {
      setHabit(found);
    } else {
      const allHabits = loadHabits();
      const fromStorage = allHabits.find(h => h.id === habitId);
      if (fromStorage) {
        setHabit(fromStorage);
      }
    }
  }, [habitId, habits]);
  
  if (!habit) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p>Loading habit stats...</p>
      </div>
    );
  }
  
  const completionRate = (() => {
    const dates = Object.keys(habit.completionLog || {});
    if (dates.length === 0) return 0;
    const completed = dates.filter(d => habit.completionLog[d]?.completed).length;
    return Math.round((completed / dates.length) * 100);
  })();
  
  const totalCompletions = Object.keys(habit.completionLog || {}).filter(
    d => habit.completionLog[d]?.completed
  ).length;
  
  const pointsEarned = getPointsForHabit(habit.id);
  const categoryColor = CATEGORY_COLORS[habit.category] || '#6b7280';
  const difficultyInfo = DIFFICULTY_LABELS[habit.difficulty] || DIFFICULTY_LABELS.medium;
  
  const getWeeklyPattern = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayCompletions = [0, 0, 0, 0, 0, 0, 0];
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    
    Object.keys(habit.completionLog || {}).forEach(date => {
      const dayIndex = new Date(date).getDay();
      dayCounts[dayIndex]++;
      if (habit.completionLog[date]?.completed) {
        dayCompletions[dayIndex]++;
      }
    });
    
    return days.map((day, idx) => ({
      day,
      rate: dayCounts[idx] > 0 ? Math.round((dayCompletions[idx] / dayCounts[idx]) * 100) : 0
    }));
  };
  
  const weeklyPattern = getWeeklyPattern();
  const bestDay = weeklyPattern.reduce((a, b) => a.rate > b.rate ? a : b);
  const worstDay = weeklyPattern.reduce((a, b) => a.rate < b.rate ? a : b);
  
  const getCalendarData = () => {
    const weeks = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 84);
    
    let currentWeek = [];
    const startDay = startDate.getDay();
    for (let i = 0; i < startDay; i++) {
      currentWeek.push(null);
    }
    
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const completed = habit.completionLog?.[dateStr]?.completed;
      
      currentWeek.push({
        date: dateStr,
        completed
      });
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }
    
    return weeks;
  };
  
  const calendarData = getCalendarData();
  
  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          fontSize: '14px',
          marginBottom: '16px'
        }}
      >
        ← Back
      </button>
      
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: `${categoryColor}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px'
            }}
          >
            {habit.icon || '✅'}
          </div>
          
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
              {habit.name}
            </h1>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span
                style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  backgroundColor: `${categoryColor}20`,
                  color: categoryColor,
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                {habit.category}
              </span>
              <span
                style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  backgroundColor: `${difficultyInfo.color}20`,
                  color: difficultyInfo.color,
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                {difficultyInfo.label}
              </span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/habits?edit=${habit.id}`)}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              backgroundColor: 'transparent',
              color: 'var(--text)',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Edit Habit
          </motion.button>
        </div>
        
        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#f97316' }}>
              {habit.currentStreak || 0}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Current Streak</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#8b5cf6' }}>
              {habit.longestStreak || 0}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Longest Streak</div>
          </div>
        </div>
      </div>
      
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        {[
          { label: 'Completion Rate', value: `${completionRate}%`, icon: '📈' },
          { label: 'Total Completions', value: totalCompletions, icon: '✅' },
          { label: 'Points Earned', value: pointsEarned.toLocaleString(), icon: '⭐' },
          { label: 'Days Tracked', value: Object.keys(habit.completionLog || {}).length, icon: '📅' }
        ].map((stat, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
            <div style={{ fontSize: '20px', fontWeight: '700' }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{stat.label}</div>
          </div>
        ))}
      </div>
      
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '24px'
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Completion Calendar (Last 12 weeks)
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {calendarData.map((week, weekIdx) => (
            <div key={weekIdx} style={{ display: 'flex', gap: '4px' }}>
              {week.map((day, dayIdx) => (
                <div
                  key={dayIdx}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    backgroundColor: day === null 
                      ? 'transparent' 
                      : day.completed 
                        ? '#22c55e' 
                        : 'var(--border)',
                    border: day === null ? 'none' : '1px solid transparent'
                  }}
                  title={day ? `${day.date}: ${day.completed ? 'Completed' : 'Missed'}` : ''}
                />
              ))}
            </div>
          ))}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'var(--border)' }} />
            <span>Missed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#22c55e' }} />
            <span>Completed</span>
          </div>
        </div>
      </div>
      
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '24px'
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Weekly Pattern
        </h2>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
          {weeklyPattern.map((day, idx) => (
            <div key={idx} style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {day.day}
              </div>
              <div
                style={{
                  height: '80px',
                  backgroundColor: 'var(--bg)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  padding: '8px'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${day.rate}%`,
                    backgroundColor: day.rate >= 80 ? '#22c55e' : day.rate >= 50 ? '#f59e0b' : '#ef4444',
                    borderRadius: '4px',
                    minHeight: '4px'
                  }}
                />
              </div>
              <div style={{ fontSize: '12px', fontWeight: '600', marginTop: '8px' }}>
                {day.rate}%
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '13px' }}>
          <span>Best day: <strong>{bestDay.day}</strong> ({bestDay.rate}%)</span>
          <span>Worst day: <strong>{worstDay.day}</strong> ({worstDay.rate}%)</span>
        </div>
      </div>
      
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '20px',
          padding: '24px'
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Streak History
        </h2>
        
        <div
          style={{
            height: '120px',
            backgroundColor: 'var(--bg)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Chart visualization coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};

export default HabitStatsPage;