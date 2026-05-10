import { useState, useEffect } from 'react';
import { getYesterdayISO } from '../../utils/dateUtils';

const REASON_OPTIONS = [
  { value: 'forgot', label: '😴 Forgot' },
  { value: 'sick', label: '🏥 Was sick' },
  { value: 'travelling', label: '🏖️ Was travelling' },
  { value: 'busy', label: '💼 Too busy' },
  { value: 'weather', label: '⛅ Weather/circumstances' },
  { value: 'other', label: '📝 Other' },
];

const MissedHabitCard = ({ habit, toggleHabit, onBackdate, onLogReason, onDoToday }) => {
  const [showReasonDropdown, setShowReasonDropdown] = useState(false);
  const [hoursLeft, setHoursLeft] = useState(48);
  const [reasonLogged, setReasonLogged] = useState(null);
  const [hasMakeupIntent, setHasMakeupIntent] = useState(false);

  useEffect(() => {
    const checkReason = () => {
      const reasons = JSON.parse(localStorage.getItem('ht_missed_reasons') || '{}');
      if (reasons[habit.id]) {
        setReasonLogged(reasons[habit.id]);
      }
    };
    checkReason();
  }, [habit.id]);

  useEffect(() => {
    const checkIntent = () => {
      const intents = JSON.parse(localStorage.getItem('ht_makeup_intents') || '{}');
      if (intents[habit.id]) {
        setHasMakeupIntent(true);
      }
    };
    checkIntent();
  }, [habit.id]);

  useEffect(() => {
    const calculateHoursLeft = () => {
      if (habit.missedDate) {
        const missedDate = new Date(habit.missedDate);
        const now = new Date();
        const hoursSinceMissed = (now - missedDate) / (1000 * 60 * 60);
        const hoursRemaining = Math.max(0, 48 - hoursSinceMissed);
        setHoursLeft(hoursRemaining);
      }
    };
    calculateHoursLeft();
    const interval = setInterval(calculateHoursLeft, 60000);
    return () => clearInterval(interval);
  }, [habit.missedDate]);

  const handleReasonSelect = (reasonValue) => {
    const reasons = JSON.parse(localStorage.getItem('ht_missed_reasons') || '{}');
    reasons[habit.id] = { 
      reason: REASON_OPTIONS.find(r => r.value === reasonValue)?.label, 
      date: getYesterdayISO(), 
      timestamp: Date.now() 
    };
    localStorage.setItem('ht_missed_reasons', JSON.stringify(reasons));
    setReasonLogged(reasons[habit.id]);
    setShowReasonDropdown(false);
  };

  const streakWasBroken = habit.currentStreak > 0;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '12px',
        border: '1px solid #FED7D7',
        borderLeft: '3px solid #EF4444',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <span style={{ fontSize: '20px', opacity: 0.6 }}>{habit.icon || '⭐'}</span>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '14px', color: 'var(--text)', opacity: 0.8, fontWeight: '500' }}>
            {habit.name}
          </span>
          <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '2px' }}>
            Missed on {habit.missedDate}
          </div>
        </div>
      </div>

      {streakWasBroken && (
        <div style={{ fontSize: '12px', color: '#F59E0B', marginBottom: '8px' }}>
          ⚠️ {habit.currentStreak} day streak broken
        </div>
      )}

      {reasonLogged ? (
        <div style={{ 
          fontSize: '12px', 
          color: '#22C55E', 
          backgroundColor: '#DCFCE7',
          padding: '6px 10px',
          borderRadius: '6px',
          marginBottom: '8px',
          display: 'inline-block'
        }}>
          ✓ Reason logged: {reasonLogged.reason}
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowReasonDropdown(!showReasonDropdown)}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                color: 'var(--text)',
                backgroundColor: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              📝 Log Reason
            </button>

            <button
              onClick={() => {
                if (toggleHabit && hoursLeft > 0) {
                  toggleHabit(habit.id, getYesterdayISO());
                }
                onBackdate();
              }}
              disabled={hoursLeft <= 0}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                color: hoursLeft <= 0 ? '#9CA3AF' : '#F59E0B',
                backgroundColor: 'transparent',
                border: `1px solid ${hoursLeft <= 0 ? '#E5E7EB' : '#F59E0B'}`,
                borderRadius: '6px',
                cursor: hoursLeft <= 0 ? 'not-allowed' : 'pointer',
              }}
            >
              ⏪ Backdate
            </button>

            <button
              onClick={onDoToday}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                color: '#22C55E',
                backgroundColor: 'transparent',
                border: '1px solid #22C55E',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              ✅ I'll do it today
            </button>
          </div>

          {showReasonDropdown && (
            <div style={{ 
              marginBottom: '8px',
              padding: '8px',
              backgroundColor: 'var(--bg)',
              borderRadius: '8px',
            }}>
              {REASON_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleReasonSelect(option.value)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: 'var(--text)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '4px',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--border)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {hasMakeupIntent && (
        <div style={{ 
          fontSize: '11px', 
          color: '#22C55E', 
          backgroundColor: '#DCFCE7',
          padding: '4px 8px',
          borderRadius: '4px',
          display: 'inline-block'
        }}>
          Making up ↗
        </div>
      )}

      {hoursLeft > 0 && (
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px' }}>
          ⏰ Backdate available for {Math.floor(hoursLeft)} more hours
        </div>
      )}
    </div>
  );
};

export default MissedHabitCard;