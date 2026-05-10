import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getHabitJournal, deleteJournalEntry, searchJournalEntries } from '../../utils/journalUtils';

const JournalHistory = ({ habitId, searchQuery }) => {
  const [entries, setEntries] = useState([]);
  const [displayCount, setDisplayCount] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!habitId) {
      setEntries([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let journalEntries;

    if (searchQuery) {
      journalEntries = searchJournalEntries(searchQuery).filter(e => e.habitId === habitId);
    } else {
      journalEntries = getHabitJournal(habitId);
    }

    setEntries(journalEntries);
    setLoading(false);
  }, [habitId, searchQuery]);

  const handleDelete = (entryDate) => {
    if (!habitId) return;
    if (window.confirm('Delete this journal entry?')) {
      deleteJournalEntry(habitId, entryDate);
      setEntries(prev => prev.filter(e => e.date !== entryDate));
    }
  };

  const visibleEntries = entries.slice(0, displayCount);
  const hasMore = entries.length > displayCount;

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
        Loading...
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
        <p>No journal entries yet</p>
        <p style={{ fontSize: '12px' }}>Start writing notes about your habits!</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {visibleEntries.map(entry => (
        <motion.div
          key={entry.date}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
              {entry.date}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => handleDelete(entry.date)}
              style={{
                padding: '4px 8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                opacity: 0.6,
              }}
            >
              🗑️
            </motion.button>
          </div>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
            {entry.note}
          </p>
        </motion.div>
      ))}

      {hasMore && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setDisplayCount(prev => prev + 10)}
          style={{
            padding: '12px',
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Load more ({entries.length - displayCount} remaining)
        </motion.button>
      )}
    </div>
  );
};

export default JournalHistory;