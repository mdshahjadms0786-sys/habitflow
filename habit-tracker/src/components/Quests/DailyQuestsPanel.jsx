import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getDailyQuests, calculateQuestProgress, saveDailyQuests, getQuestStreak } from '../../utils/questUtils';
import DailyQuestCard from './DailyQuestCard';
import toast from 'react-hot-toast';

const getTimeUntilMidnight = () => {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { hours, minutes, seconds };
};

const DailyQuestsPanel = ({ habits, moodLog, onQuestComplete }) => {
  const [quests, setQuests] = useState([]);
  const [questStreak, setQuestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnight());
  const [prevCompleted, setPrevCompleted] = useState({});

  useEffect(() => {
    const data = getDailyQuests();
    setQuests(data.quests || []);
    setQuestStreak(data.questStreak || 0);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const updatedQuests = useMemo(() => {
    if (!quests || quests.length === 0 || !habits) return quests;

    return quests.map(quest => {
      const { progress, total, percentage, isComplete } = calculateQuestProgress(quest, habits, moodLog);
      return { ...quest, progress, total, percentage, isComplete };
    });
  }, [quests, habits, moodLog]);

  useEffect(() => {
    if (!updatedQuests || updatedQuests.length === 0) return;

    updatedQuests.forEach(quest => {
      const wasComplete = prevCompleted[quest.id];
      if (quest.isComplete && !wasComplete) {
        toast.success(`🎯 Quest Complete! +${quest.points} pts earned!`);
        setPrevCompleted(prev => ({ ...prev, [quest.id]: true }));
      }
    });
  }, [updatedQuests, prevCompleted]);

  const handleRefresh = () => {
    const data = getDailyQuests();
    setQuests(data.quests || []);
    setPrevCompleted({});
    toast.success('🔄 Quests refreshed!');
  };

  const completedCount = updatedQuests?.filter(q => q.isComplete).length || 0;
  const totalPoints = updatedQuests?.reduce((sum, q) => q.isComplete ? sum : sum + q.points, 0) || 0;
  const allComplete = completedCount === 3;

  if (!habits || habits.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
            Daily Quests 📋
          </h3>
        </div>
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
          Add habits to unlock quests! 🎯
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid var(--border)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
          Daily Quests 📋
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleRefresh}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '12px',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
            title="Refresh quests"
          >
            🔄
          </button>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            🔥 {questStreak} days
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', backgroundColor: 'var(--bg)', padding: '2px 6px', borderRadius: '4px' }}>
            {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s left
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
        {updatedQuests?.map((quest, index) => (
          <DailyQuestCard
            key={quest.id}
            quest={quest}
            progress={quest.percentage || 0}
            isComplete={quest.isComplete || false}
            index={index}
          />
        ))}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '12px',
        borderTop: '1px solid var(--border)',
      }}>
        {allComplete ? (
          <p style={{ margin: 0, fontSize: '12px', color: '#22c55e', fontWeight: '500' }}>
            🎉 All quests done! Come back tomorrow
          </p>
        ) : (
          <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>
            Up to +{totalPoints} pts available
          </p>
        )}
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          {completedCount}/3 done
        </span>
      </div>
    </motion.div>
  );
};

export default DailyQuestsPanel;