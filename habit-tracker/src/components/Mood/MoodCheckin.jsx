import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MoodSelector from './MoodSelector';
import { MOODS, getMoodById } from '../../utils/moodUtils';
import { useMoodContext } from '../../context/MoodContext';
import toast from 'react-hot-toast';

const MoodCheckin = ({ compact = false }) => {
  const { todayMood, logMood } = useMoodContext();
  const [selectedMood, setSelectedMood] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const moodData = todayMood ? getMoodById(todayMood) : null;
  const displayMood = selectedMood ? getMoodById(selectedMood) : moodData;

  const handleSave = () => {
    if (!selectedMood) {
      toast.error('Please select a mood first');
      return;
    }
    logMood(selectedMood);
    toast.success('Mood logged! 😊');
    setSelectedMood(null);
    setIsEditing(false);
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          backgroundColor: moodData ? moodData.bgColor : 'var(--surface)',
          borderRadius: '12px',
          padding: '12px',
          border: moodData ? `2px solid ${moodData.color}` : '1px solid var(--border)',
          textAlign: 'center',
        }}
      >
        {moodData ? (
          <>
            <span style={{ fontSize: '24px' }}>{moodData.emoji}</span>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '12px',
                fontWeight: '500',
                color: moodData.color,
              }}
            >
              {moodData.label}
            </p>
          </>
        ) : (
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}>
            How are you feeling today? 😊
          </span>
        )}
      </motion.div>
    );
  }

  return (
    <div
      style={{
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
          textAlign: 'center',
          fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif',
        }}
      >
        How are you feeling today? 😊
      </h3>

      <AnimatePresence mode="wait">
        {(!moodData || isEditing) ? (
          <motion.div
            key="selector"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <MoodSelector
              onSelect={setSelectedMood}
              currentMood={selectedMood || todayMood}
            />

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', gap: '8px' }}>
              {selectedMood && !todayMood && (
                <button
                  onClick={() => setSelectedMood(null)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    color: 'var(--text)',
                  }}
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!selectedMood && !todayMood}
                style={{
                  padding: '8px 24px',
                  backgroundColor: selectedMood ? 'var(--primary)' : 'var(--border)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: selectedMood ? 'pointer' : 'not-allowed',
                  opacity: selectedMood ? 1 : 0.5,
                }}
              >
                Save
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="display"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ textAlign: 'center' }}
          >
            <span style={{ fontSize: '48px' }}>{moodData.emoji}</span>
            <p
              style={{
                margin: '8px 0 0 0',
                fontSize: '18px',
                fontWeight: '600',
                color: moodData.color,
              }}
            >
              You felt {moodData.label} today
            </p>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                marginTop: '12px',
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '13px',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
              }}
            >
              Change
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoodCheckin;
