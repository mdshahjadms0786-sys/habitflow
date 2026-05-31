import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../hooks/useHabits';
import JournalEntry from '../components/Journal/JournalEntry';
import JournalHistory from '../components/Journal/JournalHistory';
import JournalAnalyticsPanel from '../components/Journal/JournalAnalyticsPanel';
import SentimentBadge from '../components/Journal/SentimentBadge';
import { exportJournalAsText, saveJournalEntry as saveToLocalJournal } from '../utils/journalUtils';
import { getHabitJournal } from '../utils/journalUtils';
import { analyzeSentiment } from '../utils/sentimentUtils';
import toast from 'react-hot-toast';
import logger from '../utils/logger';
import { addPoints } from '../utils/pointsUtils';
import { useAuthContext } from '../context/AuthContext';
import { fetchJournalEntries } from '../services/supabaseService';

const JournalPage = () => {
  const { habits } = useHabits();
  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState('write');
  const [syncing, setSyncing] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      fetchJournalEntries(user.id).then(({ data, error }) => {
        setSyncing(false);
        if (error) {
          logger.error('Failed to fetch journal entries:', error);
          return;
        }
        if (data && data.length > 0) {
          data.forEach(entry => {
            saveToLocalJournal(entry.habit_id, entry.date, entry.entry_text);
          });
          setRefreshKey(prev => prev + 1);
        }
      });
    } else {
      setSyncing(false);
    }
  }, [user]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    addPoints('journalEntry');
    toast.success('📝 Journal saved! +8 pts');
  };

  const handleExport = () => {
    const text = exportJournalAsText(habits);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-journal-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('📦 Journal exported!');
  };

  const selectedHabit = habits.find(h => h.id === selectedHabitId);

  const journalEntries = useMemo(() => {
    if (!selectedHabitId) return [];
    return getHabitJournal(selectedHabitId);
  }, [selectedHabitId, refreshKey]);

  return (
    <div className="page-container" style={{ padding: '24px', paddingBottom: '80px' }}>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px' }}
      >
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--text)' }}>
          Habit Journal 📖
        </h1>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Track your thoughts and progress
        </p>
      </motion.header>

      {syncing && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          gap: '12px',
          color: 'var(--text-secondary)',
          fontSize: '14px',
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid var(--border)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          Syncing journal entries...
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {['write', 'analysis'].map(tab => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
            {tab === 'write' ? '📝 Write' : '🤖 Analysis'}
          </motion.button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
            Select Habit
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {habits.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Create a habit first to start journaling!
              </p>
            ) : (
              habits.map(habit => (
                <motion.button
                  key={habit.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedHabitId(habit.id)}
                  style={{
                    padding: '16px',
                    backgroundColor: selectedHabitId === habit.id ? 'var(--primary)' : 'var(--surface)',
                    color: selectedHabitId === habit.id ? '#ffffff' : 'var(--text)',
                    border: `1px solid ${selectedHabitId === habit.id ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{habit.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>{habit.name}</span>
                </motion.button>
              ))
            )}
          </div>
        </div>

        {activeTab === 'write' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Search journal entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    fontSize: '14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text)',
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExport}
                  style={{
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--text)',
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  📥 Export
                </motion.button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div>
                <JournalEntry
                  key={`entry-${selectedHabitId}-${refreshKey}`}
                  habitId={selectedHabitId}
                  onSave={handleRefresh}
                />
              </div>
              <div>
                <h2 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
                  History
                </h2>
                <JournalHistory
                  key={`history-${selectedHabitId}-${refreshKey}`}
                  habitId={selectedHabitId}
                  searchQuery={searchQuery}
                />
              </div>
            </div>
          </>
        )}

        {activeTab === 'analysis' && (
          <JournalAnalyticsPanel
            habitId={selectedHabitId}
            allJournalEntries={journalEntries}
          />
        )}
      </div>
    </div>
  );
};

export default JournalPage;