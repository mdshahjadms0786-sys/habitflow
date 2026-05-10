import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FocusTimer from '../components/Focus/FocusTimer';
import FocusSoundControls from '../components/Focus/FocusSoundControls';
import FocusSessionSummary from '../components/Focus/FocusSessionSummary';
import { useTimerContext } from '../context/TimerContext';
import { useHabits } from '../hooks/useHabits';
import { getNextQuote } from '../utils/focusQuotes';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const BREAK_DURATION = 5 * 60;
const POINTS_PER_MINUTE = 2;
const SOUNDS = ['rain', 'ocean', 'cafe', 'forest'];

const ExitConfirmModal = ({ isOpen, onContinue, onExit }) => {
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '320px',
            width: '100%',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h2 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: '700', color: '#fff' }}>
            Exit Focus Mode?
          </h2>
          <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>
            Your session is incomplete. Progress will be lost and habit won't be marked complete.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
            <button
              onClick={onContinue}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#fff',
                backgroundColor: '#8b5cf6',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              Continue Focusing 💪
            </button>
            <button
              onClick={onExit}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                color: 'rgba(255,255,255,0.7)',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              Exit Anyway
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const FocusPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const habitId = searchParams.get('habitId');
  const focusContainerRef = useRef(null);
  
  const { habits, toggleHabit } = useHabits();
  const { 
    addFocusSession, 
    getTodayFocusStats,
    startFocusTimer,
    pauseFocusTimer,
    resumeFocusTimer,
    stopFocusTimer,
    addFocusTime,
    setCustomDuration,
    saveIncompleteSession,
    cancelSession,
    isRunning: contextRunning
  } = useTimerContext();

  const habit = habits?.find(h => h.id === habitId);
  
  const [selectedDuration, setSelectedDuration] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(-1);
  const [activeSound, setActiveSound] = useState(null);
  const [soundIndex, setSoundIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  const soundRef = useRef(null);
  const intervalRef = useRef(null);

  const todayStats = getTodayFocusStats();
  const sessionCount = todayStats?.sessionCount || 1;
  const quote = currentQuoteIndex >= 0 ? getNextQuote(habit?.category || 'default', currentQuoteIndex) : getNextQuote(habit?.category || 'default', -1);
  const totalFocusedTime = Math.floor((selectedDuration - timeLeft) / 60);
  const pointsEarned = totalFocusedTime * POINTS_PER_MINUTE;

  const toggleFullScreen = useCallback(() => {
    if (!focusContainerRef.current) return;
    
    if (!document.fullscreenElement) {
      focusContainerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const handleSessionComplete = useCallback(() => {
    setIsRunning(false);
    setShowSummary(true);
    addFocusSession({ 
      habitId, 
      habitName: habit?.name || 'Focus', 
      habitIcon: habit?.icon || '⭐', 
      duration: selectedDuration, 
      completedAt: new Date().toISOString(), 
      date: new Date().toISOString().split('T')[0], 
      points: pointsEarned 
    });
    if (habit && !habit.completionLog?.[new Date().toISOString().split('T')[0]]) { toggleHabit(habitId); }
    if (soundRef.current) { soundRef.current.stop(); soundRef.current = null; }
  }, [habit, habitId, selectedDuration, pointsEarned, addFocusSession, toggleHabit]);

  const handleExitConfirm = useCallback(() => {
    if (isRunning && timeLeft < selectedDuration) {
      setShowExitConfirm(true);
    } else {
      handleExit();
    }
  }, [isRunning, timeLeft, selectedDuration]);

  const handleExit = useCallback(() => {
    if (isRunning && timeLeft < selectedDuration) {
      saveIncompleteSession(selectedDuration, timeLeft);
      toast('Session exited — habit not marked complete', { icon: '⚠️' });
    }
    stopFocusTimer();
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    navigate(-1);
  }, [isRunning, timeLeft, selectedDuration, saveIncompleteSession, stopFocusTimer, navigate]);

  const handleContinueFocusing = useCallback(() => {
    setShowExitConfirm(false);
    setIsRunning(true);
    resumeFocusTimer();
  }, [resumeFocusTimer]);

  const handleStart = useCallback(() => { setIsRunning(true); startFocusTimer(); toast.success('Focus started!'); }, [startFocusTimer]);
  const handlePause = useCallback(() => { setIsRunning(false); pauseFocusTimer(); }, [pauseFocusTimer]);
  const handleResume = useCallback(() => { setIsRunning(true); resumeFocusTimer(); }, [resumeFocusTimer]);
  const handleStop = useCallback(() => { setIsRunning(false); stopFocusTimer(); handleExit(); }, [stopFocusTimer, handleExit]);
  const handleAddTime = useCallback(() => { setTimeLeft(prev => prev + 60); setSelectedDuration(prev => prev + 60); addFocusTime(60); }, [addFocusTime]);
  const handleDurationChange = useCallback((duration) => { if (!isRunning && !isBreak) { setSelectedDuration(duration); setTimeLeft(duration); setCustomDuration(duration); } }, [isRunning, isBreak, setCustomDuration]);
  const handleSoundChange = useCallback((sound) => { setActiveSound(sound); }, []);
  const handleStartAnother = useCallback(() => { setShowSummary(false); setSelectedDuration(25 * 60); setTimeLeft(25 * 60); setIsBreak(false); setCurrentQuoteIndex(-1); }, []);
  const handleTakeBreak = useCallback(() => { setShowSummary(false); setIsBreak(true); setTimeLeft(BREAK_DURATION); setIsRunning(true); }, []);
  const handleDone = useCallback(() => { 
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    navigate(-1); 
  }, [navigate]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullScreen) {
        e.preventDefault();
        if (isRunning && timeLeft < selectedDuration) {
          setShowExitConfirm(true);
        }
      } else if (e.key === ' ' && !isFullScreen) {
        e.preventDefault();
        if (isRunning) handlePause();
        else handleResume();
      } else if (e.key === '+' || e.key === '=') {
        handleAddTime();
      } else if (e.key === 's' || e.key === 'S') {
        const nextIndex = (soundIndex + 1) % SOUNDS.length;
        setSoundIndex(nextIndex);
        setActiveSound(SOUNDS[nextIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen, isRunning, handlePause, handleResume, handleAddTime, soundIndex, timeLeft, selectedDuration]);

  useEffect(() => {
    const handlePopState = (e) => {
      if (isRunning && timeLeft < selectedDuration) {
        e.preventDefault();
        setShowExitConfirm(true);
        window.history.pushState(null, '', window.location.href);
      }
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isRunning, timeLeft, selectedDuration]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            if (isBreak) {
              setIsBreak(false);
              setTimeLeft(selectedDuration);
              setIsRunning(false);
              toast.success('Break over!');
            } else {
              handleSessionComplete();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(intervalRef.current);
    }
  }, [isRunning, isBreak, selectedDuration, handleSessionComplete]);

  useEffect(() => {
    return () => {
      if (isRunning && timeLeft < selectedDuration) {
        saveIncompleteSession(selectedDuration, timeLeft);
      }
    };
  }, []);

  const focusContainerStyle = {
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    color: '#fff',
    padding: '12px',
    position: 'relative',
  };

  return (
    <>
      <ExitConfirmModal 
        isOpen={showExitConfirm} 
        onContinue={handleContinueFocusing} 
        onExit={handleExit} 
      />
      
      <div ref={focusContainerRef} style={focusContainerStyle}>
        <FocusSessionSummary isOpen={showSummary} onClose={handleDone} habitName={habit?.name || 'Habit'} habitIcon={habit?.icon || '⭐'} duration={Math.floor(selectedDuration / 60)} points={pointsEarned} sessionCount={sessionCount} totalTimeToday={todayStats?.totalMinutes || totalFocusedTime} onStartAnother={handleStartAnother} onTakeBreak={handleTakeBreak} />

        {/* Top Bar */}
        <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <button onClick={handleExitConfirm} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '8px 12px', color: '#fff', cursor: 'pointer' }}>← Exit</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ fontSize: '18px' }}>{habit?.icon || '⭐'}</span><span style={{ fontSize: '14px', fontWeight: '600' }}>{habit?.name || 'Focus'}</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={toggleFullScreen} 
              style={{ 
                background: 'rgba(255,255,255,0.1)', 
                border: 'none', 
                borderRadius: '8px', 
                padding: '8px 12px', 
                color: '#fff', 
                cursor: 'pointer',
                fontSize: '16px'
              }}
              title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
            >
              {isFullScreen ? '⊡' : '⛶'}
            </button>
            <div style={{ textAlign: 'right' }}><p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Session {sessionCount}</p><p style={{ margin: 0, fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>🔥 {todayStats?.focusStreak || 0}</p></div>
          </div>
        </div>

        {/* Center */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <FocusTimer 
            timeLeft={timeLeft} 
            totalTime={selectedDuration} 
            isBreak={isBreak} 
            size={isFullScreen ? 260 : 180}
            fontSize={isFullScreen ? 56 : 40}
          />
          {!isBreak && quote && <div style={{ textAlign: 'center', maxWidth: isFullScreen ? '400px' : '280px' }}><p style={{ margin: 0, fontSize: isFullScreen ? '16px' : '13px', fontStyle: 'italic', color: 'rgba(255,255,255,0.85)', lineHeight: '1.4' }}>"{quote.text}"</p><p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>— {quote.author}</p></div>}
        </div>

        {/* Bottom Controls */}
        <div style={{ height: 'auto', maxHeight: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', flexShrink: 0, paddingBottom: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[15, 25, 45, 60].map(duration => <button key={duration} onClick={() => handleDurationChange(duration * 60)} disabled={isRunning || isBreak} style={{ padding: '6px 14px', backgroundColor: selectedDuration === duration * 60 ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.1)', border: `1px solid ${selectedDuration === duration * 60 ? '#8b5cf6' : 'rgba(255,255,255,0.2)'}`, borderRadius: '16px', color: '#fff', fontSize: '12px', cursor: isRunning || isBreak ? 'not-allowed' : 'pointer', opacity: isRunning || isBreak ? 0.5 : 1 }}>{duration}</button>)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {isRunning ? <button onClick={handlePause} style={{ padding: '10px 24px', fontSize: '13px', fontWeight: '600', color: '#fff', backgroundColor: '#8b5cf6', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>⏸ Pause</button> : <button onClick={handleStart} style={{ padding: '10px 24px', fontSize: '13px', fontWeight: '600', color: '#fff', backgroundColor: '#8b5cf6', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>▶ Start</button>}
            <button onClick={handleStop} style={{ padding: '10px 14px', fontSize: '12px', color: 'rgba(255,255,255,0.7)', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', cursor: 'pointer' }}>⏹</button>
            <button onClick={handleAddTime} style={{ padding: '10px 14px', fontSize: '12px', color: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.1)', border: '1px solid #8b5cf6', borderRadius: '10px', cursor: 'pointer' }}>+1</button>
          </div>
          <FocusSoundControls activeSound={activeSound} onSoundChange={handleSoundChange} />
        </div>

        {/* Stats Sidebar - Desktop */}
        {!isFullScreen && (
          <div style={{ position: 'fixed', right: 0, top: '50%', transform: 'translateY(-50%)', width: '80px', display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '12px 0 0 12px' }}>
            <div style={{ textAlign: 'center' }}><p style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#8b5cf6' }}>{todayStats?.totalMinutes || 0}m</p><p style={{ margin: 0, fontSize: '9px', color: 'rgba(255,255,255,0.6)' }}>Focus</p></div>
            <div style={{ textAlign: 'center' }}><p style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#22c55e' }}>{todayStats?.sessionCount || 0}</p><p style={{ margin: 0, fontSize: '9px', color: 'rgba(255,255,255,0.6)' }}>Sessions</p></div>
            <div style={{ textAlign: 'center' }}><p style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#f97316' }}>{todayStats?.focusStreak || 0}</p><p style={{ margin: 0, fontSize: '9px', color: 'rgba(255,255,255,0.6)' }}>Streak</p></div>
            <div style={{ textAlign: 'center' }}><p style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#fbbf24' }}>+{todayStats?.totalPoints || 0}</p><p style={{ margin: 0, fontSize: '9px', color: 'rgba(255,255,255,0.6)' }}>Points</p></div>
          </div>
        )}

        {/* Keyboard Shortcuts Hint */}
        <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
          {isFullScreen ? 'Esc: Exit fullscreen' : 'Space: Pause • +: Add time • S: Sound'}
        </div>
      </div>
    </>
  );
};

export default FocusPage;