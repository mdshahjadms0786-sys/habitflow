import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../hooks/useHabits';
import { useMoodContext } from '../context/MoodContext';
import { loadProfile } from '../utils/profileUtils';
import toast from 'react-hot-toast';

const WeeklyReportPage = () => {
  const { habits } = useHabits();
  const { moodLog } = useMoodContext();
  const profile = loadProfile();
  const [weekData, setWeekData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!habits || habits.length === 0) {
      setIsLoading(false);
      return;
    }

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - 6);
    
    const endOfWeek = new Date(today);
    
    const days = [];
    let totalCompletions = 0;
    let totalPossible = 0;
    let bestDay = { name: '', count: 0, date: '' };
    let worstDay = { name: '', count: Infinity, date: '' };
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      let completions = 0;
      habits.forEach(habit => {
        if (habit.completionLog?.[dateStr]?.completed) {
          completions++;
        }
      });
      
      totalCompletions += completions;
      totalPossible += habits.length;
      
      if (completions >= bestDay.count) {
        bestDay = { name: dayName, count: completions, date: dateStr };
      }
      if (completions <= worstDay.count && i < 6) {
        worstDay = { name: dayName, count: completions, date: dateStr };
      }
      
      const dayMood = moodLog?.[dateStr];
      let moodEmoji = '😐';
      if (dayMood) {
        const moodScore = typeof dayMood === 'string' ? parseInt(dayMood) : dayMood.score || dayMood;
        moodEmoji = moodScore >= 4 ? '🤩' : moodScore >= 3 ? '😊' : moodScore >= 2 ? '😐' : '😔';
      } else if (completions >= habits.length * 0.8) {
        moodEmoji = '🤩';
      } else if (completions >= habits.length * 0.5) {
        moodEmoji = '😊';
      } else if (completions > 0) {
        moodEmoji = '😐';
      }
      
      days.push({
        date: dateStr,
        dayName,
        completions,
        total: habits.length,
        mood: moodEmoji,
        moodScore: dayMood ? (typeof dayMood === 'string' ? parseInt(dayMood) : dayMood.score || dayMood) : null
      });
    }
    
    const habitStats = habits.map(h => {
      let weekCompletions = 0;
      days.forEach(day => {
        if (h.completionLog?.[day.date]?.completed) {
          weekCompletions++;
        }
      });
      const rate = Math.round((weekCompletions / 7) * 100);
      return {
        habit: h,
        completions: weekCompletions,
        rate,
        streak: h.currentStreak || 0
      };
    });
    
    const sortedByRate = [...habitStats].sort((a, b) => b.rate - a.rate);
    const percentage = totalPossible > 0 ? Math.round((totalCompletions / totalPossible) * 100) : 0;
    
    const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : 'D';
    
    const insights = generateInsights(days, habitStats, percentage, bestDay, worstDay, habits.length);
    
    const lastWeekData = {
      startDate: startOfWeek,
      endDate: endOfWeek,
      days,
      total: totalPossible,
      completed: totalCompletions,
      percentage,
      grade,
      bestDay: bestDay.count > 0 ? bestDay : null,
      worstDay: worstDay.count === Infinity || worstDay.count === 0 ? null : worstDay,
      bestHabit: sortedByRate[0]?.rate > 0 ? sortedByRate[0] : null,
      needsWork: sortedByRate.find(h => h.rate < 50 && h.completions > 0) || null,
      longestStreak: Math.max(...habits.map(h => h.currentStreak || 0)),
      habitStats: sortedByRate,
      insights,
      moodSummary: calculateMoodSummary(days)
    };
    
    setWeekData(lastWeekData);
    setIsLoading(false);
  }, [habits, moodLog]);
  
  function generateInsights(days, habitStats, percentage, bestDay, worstDay, totalHabits) {
    const insights = [];
    
    if (percentage >= 80) {
      insights.push({ icon: '🌟', text: `Amazing week! You achieved ${percentage}% completion rate.` });
    } else if (percentage >= 60) {
      insights.push({ icon: '💪', text: `Good progress! ${percentage}% completion this week. Keep it up!` });
    } else {
      insights.push({ icon: '🎯', text: `This week had ${percentage}% completion. Try focusing on 2-3 key habits.` });
    }
    
    const completedDays = days.filter(d => d.completions === totalHabits).length;
    if (completedDays >= 5) {
      insights.push({ icon: '🏆', text: `You had ${completedDays} perfect days! That's incredible consistency.` });
    } else if (completedDays >= 3) {
      insights.push({ icon: '✨', text: `${completedDays} days with all habits completed. Great work!` });
    }
    
    const topHabit = habitStats.find(h => h.rate === 100);
    if (topHabit) {
      insights.push({ icon: '🎖️', text: `"${topHabit.habit.name}" was your top performer with 100% completion!` });
    }
    
    const strugglingHabit = habitStats.find(h => h.rate < 30 && h.completions > 0);
    if (strugglingHabit) {
      insights.push({ icon: '💡', text: `"${strugglingHabit.habit.name}" needs attention. Consider breaking it into smaller steps.` });
    }
    
    if (bestDay && bestDay.count > worstDay?.count) {
      const diff = bestDay.count - (worstDay?.count || 0);
      if (diff >= 3) {
        insights.push({ icon: '📈', text: `Your best day (${bestDay.name}) had ${diff} more completions than your lowest day.` });
      }
    }
    
    return insights.slice(0, 4);
  }
  
  function calculateMoodSummary(days) {
    const moodsWithScores = days.filter(d => d.moodScore !== null).map(d => d.moodScore);
    if (moodsWithScores.length === 0) {
      return { average: null, trend: 'neutral', bestDay: null };
    }
    
    const average = moodsWithScores.reduce((a, b) => a + b, 0) / moodsWithScores.length;
    const firstHalf = moodsWithScores.slice(0, 3).reduce((a, b) => a + b, 0) / Math.min(3, moodsWithScores.length);
    const secondHalf = moodsWithScores.slice(3).reduce((a, b) => a + b, 0) / Math.min(3, moodsWithScores.length);
    
    let trend = 'neutral';
    if (secondHalf - firstHalf >= 0.5) trend = 'up';
    else if (firstHalf - secondHalf >= 0.5) trend = 'down';
    
    const bestDay = days.reduce((best, day) => {
      if (day.moodScore !== null && (!best || day.moodScore > best.moodScore)) {
        return day;
      }
      return best;
    }, null);
    
    return { average: Math.round(average * 10) / 10, trend, bestDay };
  }
  
  const formatDateRange = () => {
    if (!weekData?.startDate || !weekData?.endDate) return '';
    const options = { month: 'short', day: 'numeric' };
    return `${weekData.startDate.toLocaleDateString('en-US', options)} — ${weekData.endDate.toLocaleDateString('en-US', options)}, ${new Date().getFullYear()}`;
  };
  
  const handleDownload = () => {
    const reportContent = `
📊 WEEKLY HABIT REPORT
${formatDateRange()}

📈 OVERVIEW
- Grade: ${weekData?.grade || '-'}
- Completion: ${weekData?.completed || 0}/${weekData?.total || 0} (${weekData?.percentage || 0}%)
- Best Day: ${weekData?.bestDay?.name || '-'}
- Longest Streak: ${weekData?.longestStreak || 0} days

🏆 HIGHLIGHTS
${weekData?.bestHabit ? `- Best Habit: ${weekData.bestHabit.habit.name} (${weekData.bestHabit.rate}%)` : '- No best habit'}
${weekData?.needsWork && weekData.needsWork.rate < 50 ? `- Needs Work: ${weekData.needsWork.habit.name} (${weekData.needsWork.rate}%)` : ''}

📅 DAILY BREAKDOWN
${weekData?.days?.map(d => `${d.dayName}: ${d.completions}/${d.total} ${d.mood}`).join('\n') || ''}

💡 INSIGHTS
${weekData?.insights?.map(i => `${i.icon} ${i.text}`).join('\n') || ''}

---
Generated by HabitFlow
    `.trim();
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekly-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('📥 Report downloaded!');
  };
  
  const handleShare = () => {
    const shareText = `📊 My Weekly Habit Report ${formatDateRange()}

🏆 Grade: ${weekData?.grade || '-'}
📈 Completion: ${weekData?.percentage || 0}%
🔥 Best Streak: ${weekData?.longestStreak || 0} days

${weekData?.bestHabit ? `✅ Top Habit: ${weekData.bestHabit.habit.name}` : ''}

#HabitFlow #Productivity
    `.trim();
    
    if (navigator.share) {
      navigator.share({ text: shareText }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('📋 Copied to clipboard!');
    }
  };
  
  if (isLoading) {
    return (
      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', paddingTop: '100px' }}>
        <div style={{ fontSize: '48px' }}>📊</div>
        <p>Loading your weekly report...</p>
      </div>
    );
  }
  
  if (!habits || habits.length === 0) {
    return (
      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', paddingTop: '100px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>📊</div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>No Habits Yet</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Add some habits to see your weekly report!
        </p>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
          Your Week in Habits 📊
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          {formatDateRange()}
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '24px',
          padding: '32px',
          marginBottom: '24px',
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '8px solid var(--primary)'
            }}
          >
            <span style={{ fontSize: '48px', fontWeight: '700', color: 'var(--primary)' }}>
              {weekData?.grade || '-'}
            </span>
          </div>
        </div>
        
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
          You completed {weekData?.completed || 0}/{weekData?.total || 0} habits this week
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          That's {weekData?.percentage || 0}% completion rate!
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{ marginBottom: '24px' }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>7-Day Breakdown</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {weekData?.days?.map((day, idx) => {
            const isBest = weekData?.bestDay?.date === day.date;
            const isWorst = weekData?.worstDay?.date === day.date;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  backgroundColor: isBest ? 'rgba(34, 197, 94, 0.1)' : isWorst ? 'rgba(239, 68, 68, 0.1)' : 'var(--surface)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  border: isBest ? '1px solid #22c55e' : isWorst ? '1px solid #ef4444' : '1px solid var(--border)'
                }}
              >
                <span style={{ width: '40px', fontWeight: '600', fontSize: '14px' }}>{day.dayName}</span>
                <span style={{ fontSize: '20px' }}>{day.mood}</span>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      flex: 1,
                      height: '8px',
                      backgroundColor: 'var(--border)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        width: `${day.total > 0 ? (day.completions / day.total) * 100 : 0}%`,
                        height: '100%',
                        backgroundColor: day.completions === day.total ? '#22c55e' : day.completions > 0 ? '#f59e0b' : 'var(--border)',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                </div>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)', minWidth: '60px', textAlign: 'right' }}>
                  {day.completions}/{day.total}
                </span>
                {isBest && <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '600' }}>⭐ Best</span>}
                {isWorst && <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: '600' }}>⚠️ Low</span>}
              </div>
            );
          })}
        </div>
      </motion.div>
      
      {weekData?.habitStats && weekData.habitStats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: '24px' }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Habit Performance</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {weekData.habitStats.slice(0, 5).map((stat, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: 'var(--surface)',
                  borderRadius: '12px',
                  padding: '12px 16px'
                }}
              >
                <span style={{ fontSize: '24px' }}>{stat.habit.icon || '✅'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '500', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {stat.habit.name}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '3px',
                        backgroundColor: stat.habit.completionLog?.[weekData.days[i]?.date]?.completed 
                          ? '#22c55e' 
                          : 'var(--border)'
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600', minWidth: '40px', textAlign: 'right', color: stat.rate >= 80 ? '#22c55e' : stat.rate < 50 ? '#ef4444' : 'var(--text)' }}>
                  {stat.rate}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '24px'
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Highlights</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {weekData?.bestHabit && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>🏆</span>
              <span>Best habit: <strong>{weekData.bestHabit.habit.name}</strong> ({weekData.bestHabit.rate}%)</span>
            </div>
          )}
          {weekData?.needsWork && weekData.needsWork.rate < 50 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>⚠️</span>
              <span>Needs work: <strong>{weekData.needsWork.habit.name}</strong> ({weekData.needsWork.rate}%)</span>
            </div>
          )}
          {weekData?.longestStreak > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>🔥</span>
              <span>Longest streak: <strong>{weekData.longestStreak} days</strong></span>
            </div>
          )}
          {weekData?.bestDay && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>😊</span>
              <span>Best day: <strong>{weekData.bestDay.name}</strong> ({weekData.bestDay.count} habits)</span>
            </div>
          )}
        </div>
      </motion.div>
      
      {weekData?.insights && weekData.insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            backgroundColor: 'var(--primary-light)',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '24px'
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>💡 Insights</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {weekData.insights.map((insight, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>{insight.icon}</span>
                <span style={{ fontSize: '14px', lineHeight: '1.5' }}>{insight.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      
      {weekData?.moodSummary?.average !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '24px'
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>😊 Mood Summary</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '700' }}>{weekData.moodSummary.average}/5</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Average Mood</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px' }}>
                {weekData.moodSummary.trend === 'up' ? '📈' : weekData.moodSummary.trend === 'down' ? '📉' : '➡️'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Trend</div>
            </div>
            {weekData.moodSummary.bestDay && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px' }}>{weekData.moodSummary.bestDay.mood}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Best Day</div>
              </div>
            )}
          </div>
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDownload}
          style={{
            padding: '12px 24px',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            color: 'var(--text)',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          📥 Download Report
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
          style={{
            padding: '12px 24px',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--primary)',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          📤 Share Progress
        </motion.button>
      </motion.div>
    </div>
  );
};

export default WeeklyReportPage;