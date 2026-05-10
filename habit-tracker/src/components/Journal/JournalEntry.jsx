import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { saveJournalEntry, getJournalEntry } from '../../utils/journalUtils';
import { getTodayISO, formatISODate } from '../../utils/dateUtils';
import toast from 'react-hot-toast';

const JournalEntry = ({ habitId, date, existingNote, onSave }) => {
  const [note, setNote] = useState(existingNote || '');
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    if (existingNote !== undefined && existingNote !== null) {
      setNote(existingNote);
    }
  }, [existingNote]);

  const handleSave = () => {
    if (!habitId) return;
    const dateStr = date || getTodayISO();
    saveJournalEntry(habitId, dateStr, note);
    setLastSaved(new Date());
    toast.success('📝 Journal saved!');
    if (onSave) onSave();
  };

  const maxChars = 500;
  const charCount = (note || '').length;

  return (
    <div style={{ backgroundColor: 'var(--surface)', borderRadius: '12px', padding: '20px' }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
        Today's Notes
      </h3>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value.slice(0, maxChars))}
        placeholder="How did this habit go today? Any obstacles?"
        style={{
          width: '100%',
          minHeight: '120px',
          padding: '12px',
          fontSize: '14px',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--bg)',
          color: 'var(--text)',
          resize: 'vertical',
          fontFamily: 'inherit',
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
        <span style={{ fontSize: '12px', color: charCount >= maxChars ? '#ef4444' : 'var(--text-secondary)' }}>
          {charCount}/{maxChars} characters
        </span>

        {lastSaved && (
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Last saved: {lastSaved.toLocaleTimeString()}
          </span>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        disabled={!habitId || charCount === 0}
        style={{
          marginTop: '12px',
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: '600',
          color: '#ffffff',
          backgroundColor: !habitId || charCount === 0 ? 'var(--border)' : 'var(--primary)',
          border: 'none',
          borderRadius: '8px',
          cursor: !habitId || charCount === 0 ? 'not-allowed' : 'pointer',
          width: '100%',
        }}
      >
        Save Note
      </motion.button>
    </div>
  );
};

export default JournalEntry;