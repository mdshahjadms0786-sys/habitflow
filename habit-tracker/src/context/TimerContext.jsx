import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { useHabitContext } from './HabitContext';
import { getTodayISO } from '../utils/dateUtils';
import { saveTimerSessions, loadTimerSessions } from '../utils/db';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

const STORAGE_KEY = 'ht_focus_sessions';

const TimerContext = createContext(null);

const WORK_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

const initialState = {
  timeLeft: WORK_DURATION,
  isRunning: false,
  isBreak: false,
  sessions: 0,
  activeHabitId: null,
  activeHabitName: '',
  activeHabitIcon: '⭐',
  focusSessions: [],
  customDuration: WORK_DURATION,
  sessionStatus: 'idle',
  timeCompleted: 0,
};

const timerReducer = (state, action) => {
  switch (action.type) {
    case 'START_TIMER': {
      return {
        ...state,
        timeLeft: state.customDuration || WORK_DURATION,
        isRunning: true,
        isBreak: false,
        sessions: 0,
        activeHabitId: action.payload?.habitId || state.activeHabitId,
        activeHabitName: action.payload?.habitName || state.activeHabitName,
        activeHabitIcon: action.payload?.habitIcon || state.activeHabitIcon || '⭐',
      };
    }

    case 'PAUSE_TIMER': {
      return { ...state, isRunning: false };
    }

    case 'RESUME_TIMER': {
      return { ...state, isRunning: true };
    }

    case 'RESET_TIMER': {
      return {
        ...initialState,
        timeLeft: WORK_DURATION,
        sessions: state.sessions,
      };
    }

    case 'TICK': {
      const newTime = state.timeLeft - 1;
      if (newTime <= 0) {
        if (!state.isBreak) {
          return {
            ...state,
            timeLeft: 0,
            isRunning: false,
          };
        } else {
          return {
            ...state,
            timeLeft: 0,
            isRunning: false,
          };
        }
      }
      return { ...state, timeLeft: newTime };
    }

    case 'COMPLETE_WORK': {
      const newSessions = state.sessions + 1;
      const timerData = {
        totalSessions: newSessions,
        lastUpdated: new Date().toISOString(),
      };
      const existing = loadTimerSessions();
      const updated = {
        ...existing,
        totalSessions: (existing.totalSessions || 0) + 1,
        lastUpdated: new Date().toISOString(),
      };
      saveTimerSessions(updated);
      return {
        ...state,
        timeLeft: BREAK_DURATION,
        isRunning: false,
        isBreak: true,
        sessions: newSessions,
      };
    }

    case 'COMPLETE_BREAK': {
      return {
        ...state,
        timeLeft: WORK_DURATION,
        isBreak: false,
        isRunning: true,
      };
    }

    case 'SKIP_BREAK': {
      return {
        ...state,
        timeLeft: WORK_DURATION,
        isBreak: false,
        isRunning: true,
      };
    }

    case 'SET_TIME_LEFT': {
      return { ...state, timeLeft: action.payload };
    }

    case 'SET_CUSTOM_DURATION': {
      return { ...state, timeLeft: action.payload };
    }

    case 'ADD_FOCUS_SESSION': {
      const sessions = state.focusSessions || [];
      const newSessions = [...sessions, action.payload];
      const today = getTodayISO();
      const todaySessions = newSessions.filter(s => s.date === today);
      return { ...state, focusSessions: newSessions };
    }

    case 'CANCEL_SESSION': {
      return {
        ...state,
        sessionStatus: 'cancelled',
        isRunning: false,
        activeHabitId: null,
        activeHabitName: '',
        activeHabitIcon: '⭐',
        timeLeft: WORK_DURATION,
      };
    }

    case 'SET_TIME_COMPLETED': {
      return { ...state, timeCompleted: action.payload };
    }

    default:
      return state;
  }
};

export const TimerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(timerReducer, initialState);
  const { toggleHabit } = useHabitContext();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [state.isRunning]);

  useEffect(() => {
    if (state.timeLeft <= 0 && !state.isRunning) {
      if (!state.isBreak) {
        if (state.activeHabitId) {
          toggleHabit(state.activeHabitId, getTodayISO());
        }
        dispatch({ type: 'COMPLETE_WORK' });
      } else {
        dispatch({ type: 'COMPLETE_BREAK' });
      }
    }
  }, [state.timeLeft, state.isRunning, state.isBreak, state.activeHabitId, toggleHabit]);

  const startTimer = useCallback((habitId, habitName, habitIcon) => {
    dispatch({
      type: 'START_TIMER',
      payload: { habitId, habitName, habitIcon },
    });
  }, []);

  const pauseTimer = useCallback(() => {
    dispatch({ type: 'PAUSE_TIMER' });
  }, []);

  const resumeTimer = useCallback(() => {
    dispatch({ type: 'RESUME_TIMER' });
  }, []);

  const resetTimer = useCallback(() => {
    dispatch({ type: 'RESET_TIMER' });
  }, []);

  const skipBreak = useCallback(() => {
    dispatch({ type: 'SKIP_BREAK' });
  }, []);

  const startFocusTimer = useCallback(() => {
    dispatch({ type: 'START_TIMER' });
  }, []);

  const pauseFocusTimer = useCallback(() => {
    dispatch({ type: 'PAUSE_TIMER' });
  }, []);

  const resumeFocusTimer = useCallback(() => {
    dispatch({ type: 'RESUME_TIMER' });
  }, []);

  const stopFocusTimer = useCallback(() => {
    dispatch({ type: 'RESET_TIMER' });
  }, []);

  const addFocusTime = useCallback((seconds) => {
    dispatch({ type: 'SET_TIME_LEFT', payload: state.timeLeft + seconds });
  }, [state.timeLeft]);

  const setCustomDuration = useCallback((duration) => {
    dispatch({ type: 'SET_CUSTOM_DURATION', payload: duration });
  }, []);

  const addFocusSession = useCallback((session) => {
    const sessionData = {
      id: uuidv4(),
      habitId: session.habitId || state.activeHabitId,
      habitName: session.habitName || state.activeHabitName,
      habitIcon: session.habitIcon || state.activeHabitIcon || '⭐',
      duration: Math.floor(session.duration / 60),
      completedAt: session.completedAt || new Date().toISOString(),
      date: format(new Date(), 'yyyy-MM-dd'),
    };
    
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = [...existing, sessionData];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    dispatch({ type: 'ADD_FOCUS_SESSION', payload: sessionData });
  }, [state.activeHabitId, state.activeHabitName, state.activeHabitIcon]);

  const saveIncompleteSession = useCallback((plannedDuration, timeLeft) => {
    const timeDone = Math.floor((plannedDuration - timeLeft) / 60);
    if (timeDone < 1) return;
    
    const sessionData = {
      id: uuidv4(),
      habitId: state.activeHabitId,
      habitName: state.activeHabitName,
      habitIcon: state.activeHabitIcon || '⭐',
      plannedDuration: Math.floor(plannedDuration / 60),
      timeCompleted: timeDone,
      status: 'incomplete',
      exitedAt: new Date().toISOString(),
      date: format(new Date(), 'yyyy-MM-dd'),
    };
    
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updated = [...existing, sessionData];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    dispatch({ type: 'SET_TIME_COMPLETED', payload: timeDone });
  }, [state.activeHabitId, state.activeHabitName, state.activeHabitIcon]);

  const cancelSession = useCallback(() => {
    dispatch({ type: 'CANCEL_SESSION' });
  }, []);

  const getTodayFocusStats = useCallback(() => {
    const today = getTodayISO();
    const sessions = state.focusSessions || [];
    const todaySessions = sessions.filter(s => s.date === today);
    const totalMinutes = todaySessions.reduce((acc, s) => acc + Math.floor(s.duration / 60), 0);
    const totalPoints = todaySessions.reduce((acc, s) => acc + (s.points || 0), 0);
    
    let focusStreak = 0;
    for (let i = 0; i <= 30; i++) {
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasSession = sessions.some(s => s.date === dateStr);
      if (hasSession) focusStreak++;
      else if (i > 0) break;
    }

    return {
      totalMinutes,
      sessionCount: todaySessions.length,
      totalPoints,
      focusStreak,
    };
  }, [state.focusSessions]);

  const value = {
    ...state,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    skipBreak,
    startFocusTimer,
    pauseFocusTimer,
    resumeFocusTimer,
    stopFocusTimer,
    addFocusTime,
    setCustomDuration,
    addFocusSession,
    saveIncompleteSession,
    cancelSession,
    getTodayFocusStats,
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimerContext must be used within a TimerProvider');
  }
  return context;
};
