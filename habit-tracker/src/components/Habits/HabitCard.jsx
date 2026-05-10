import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CategoryBadge, PriorityBadge } from '../UI/Badge';
import DifficultyBadge from '../Difficulty/DifficultyBadge';
import { WeeklyProgressBar } from '../UI/ProgressBar';
import { getWeekCompletions, isCompletedToday } from '../../utils/streakUtils';
import { getEarnedBadges } from '../../utils/badgeUtils';
import StartTimerButton from '../Timer/StartTimerButton';
import FocusModeButton from '../Focus/FocusModeButton';
import JournalEntry from '../Journal/JournalEntry';
import { getTodayISO } from '../../utils/dateUtils';
import { getJournalEntry } from '../../utils/journalUtils';
import { getHabitDeadline, getTimeRemaining, formatCountdown } from '../../utils/countdownUtils';

const categoryColors = {
  Health: '#14b8a6',
  Work: '#3b82f6',
  Personal: '#8b5cf6',
  Fitness: '#f97316',
  Learning: '#f59e0b',
};

export const HabitCard = ({ habit, onToggle, onEdit, onDelete }) => {
  const completedToday = isCompletedToday(habit.completionLog);
  const weekCompletions = getWeekCompletions(habit.completionLog);
  const color = categoryColors[habit.category] || '#8b5cf6';

  const [showJournal, setShowJournal] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);

  const todayNote = getJournalEntry(habit.id, getTodayISO()) || '';

  useEffect(() => {
    if (completedToday) {
      setTimeRemaining(null);
      return;
    }
    
    const updateCountdown = () => {
      const deadline = getHabitDeadline(habit);
      const remaining = getTimeRemaining(deadline);
      setTimeRemaining(remaining);
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [habit, completedToday]);

  // Swipe gesture state
  const [swipeX, setSwipeX] = useState(0);
  const [startX, setStartX] = useState(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const cardRef = useRef(null);

  const handleTouchStart = (e) => {
    if (!('ontouchstart' in window)) return;
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping || startX === null) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    // Resist scrolling when swiping horizontally
    if (Math.abs(diff) > 10) {
      e.preventDefault();
    }
    setSwipeX(Math.max(-100, Math.min(100, diff)));
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;

    if (swipeX < -80) {
      // Swipe left - show delete
      if (window.confirm('Delete this habit?')) {
        onDelete(habit.id);
      }
    } else if (swipeX > 80) {
      // Swipe right - toggle completion
      onToggle(habit.id);
    }

    setSwipeX(0);
    setStartX(null);
    setIsSwiping(false);
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    onToggle(habit.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (habit.subtypes && habit.subtypes.length > 0) {
      onEdit(habit);
    } else {
      onEdit(habit);
    }
  };

  const handleNameClick = (e) => {
    e.stopPropagation();
    if (habit.subtypes && habit.subtypes.length > 0) {
      onEdit(habit);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(habit.id);
  };

  const isTouchDevice = 'ontouchstart' in window;
  const cardStyle = {
    backgroundColor: completedToday ? `${color}20` : 'var(--surface)',
    border: `2px solid ${completedToday ? color : 'var(--border)'}`,
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    cursor: 'pointer',
    transition: isSwiping ? 'none' : 'all 0.2s',
    transform: isSwiping ? `translateX(${swipeX}px)` : 'translateX(0)',
    touchAction: isTouchDevice ? 'pan-y' : 'manipulation',
    overflow: 'hidden',
    position: 'relative',
  };

  return (
    <motion.div
      layout
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={!isSwiping ? { scale: 1.02 } : {}}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={cardStyle}
    >
      {/* Swipe action indicators */}
      {isSwiping && (
        <>
          {swipeX > 0 && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${Math.min(swipeX, 100)}px`,
                backgroundColor: '#22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingLeft: '16px',
                borderRadius: '10px 0 0 10px',
              }}
            >
              <span style={{ fontSize: '20px' }}>✓</span>
            </div>
          )}
          {swipeX < 0 && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: `${Math.min(Math.abs(swipeX), 100)}px`,
                backgroundColor: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '16px',
                borderRadius: '0 10px 10px 0',
              }}
            >
              <span style={{ fontSize: '20px' }}>🗑️</span>
            </div>
          )}
        </>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleToggle}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: completedToday ? color : 'transparent',
              border: `2px solid ${color}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {completedToday && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{ color: '#ffffff', fontSize: '16px' }}
              >
                ✓
              </motion.span>
            )}
          </motion.button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
            <span 
              style={{ fontSize: '24px', flexShrink: 0, cursor: habit.subtypes?.length ? 'pointer' : 'default' }}
              onClick={habit.subtypes?.length ? handleNameClick : undefined}
            >
              {habit.icon || '⭐'}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: '600',
                  color: completedToday ? 'var(--text-secondary)' : 'var(--text)',
                  textDecoration: completedToday ? 'line-through' : 'none',
                  cursor: habit.subtypes?.length ? 'pointer' : 'default',
                }}
                onClick={habit.subtypes?.length ? handleNameClick : undefined}
              >
                {habit.name}
              </h3>
              {habit.subtypes && habit.subtypes.length > 0 && (
                <div style={{ fontSize: '12px', color: '#14b8a6', marginTop: '4px' }}>
                  Tap to select
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                <CategoryBadge category={habit.category} size="sm" />
                <DifficultyBadge difficulty={habit.difficulty || 'medium'} size="md" />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleEdit}
            style={{
              padding: '6px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              opacity: 0.7,
            }}
          >
            ✏️
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            style={{
              padding: '6px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              opacity: 0.7,
            }}
          >
            🗑️
          </motion.button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
        <span style={{ color: 'var(--text-secondary)' }}>
          🔥 {habit.currentStreak || 0} day streak
        </span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {timeRemaining && !completedToday && (
            <span style={{
              fontSize: '11px',
              padding: '2px 6px',
              borderRadius: '4px',
              background: timeRemaining.urgency === 'critical' ? '#FCEBEB' : 
                         timeRemaining.urgency === 'warning' ? '#FAEEDA' : '#E1F5EE',
              color: timeRemaining.urgency === 'critical' ? '#E24B4A' : 
                     timeRemaining.urgency === 'warning' ? '#BA7517' : '#1D9E75',
              fontWeight: 500,
              animation: timeRemaining.urgency === 'critical' ? 'pulse-red 1.5s ease-in-out infinite' : 'none',
            }}>
              {timeRemaining.expired ? '⏰ Expired' : formatCountdown(timeRemaining)}
            </span>
          )}
          {completedToday && (
            <span style={{ fontSize: '11px', color: '#22C55E', fontWeight: 500 }}>
              ✅ Done
            </span>
          )}
          {habit.reminderTime && !completedToday && (
            <span style={{ color: 'var(--text-secondary)' }}>
              ⏰ {habit.reminderTime}
            </span>
          )}
        </div>
      </div>

      <WeeklyProgressBar completions={weekCompletions} color={color} />

      {habit.notes && (
        <p
          style={{
            margin: 0,
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: '1.4',
          }}
        >
          {habit.notes}
        </p>
      )}

      {(() => {
        const earnedBadges = getEarnedBadges(habit.currentStreak || 0);
        if (earnedBadges.length === 0) return null;
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '8px',
            }}
            title={`${earnedBadges.length} badge${earnedBadges.length > 1 ? 's' : ''} earned`}
          >
            {earnedBadges.map((badge) => (
              <span key={badge.id} style={{ fontSize: '16px' }}>
                {badge.emoji}
              </span>
            ))}
          </div>
        );
      })()}
 
      {!completedToday && (
        <FocusModeButton
          habitId={habit.id}
          habitName={habit.name}
          habitIcon={habit.icon || '⭐'}
          habitCategory={habit.category}
        />
      )}

      {completedToday && (
        <StartTimerButton
          habitId={habit.id}
          habitName={habit.name}
          habitIcon={habit.icon || '⭐'}
        />
      )}

      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowJournal(!showJournal)}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            backgroundColor: showJournal ? 'var(--primary)' : 'var(--bg)',
            color: showJournal ? '#ffffff' : 'var(--text-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          📝 Note
        </motion.button>
      </div>

      {showJournal && (
        <div style={{ marginTop: '12px' }}>
          <JournalEntry habitId={habit.id} date={getTodayISO()} existingNote={todayNote} />
        </div>
      )}
    </motion.div>
  );
};

export default HabitCard;
