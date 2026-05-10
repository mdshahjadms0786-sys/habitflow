import { createContext, useContext, useReducer, useEffect } from 'react';
import { saveMoodLog, loadMoodLog } from '../utils/db';
import { getTodayISO } from '../utils/dateUtils';

const MoodContext = createContext(null);

const initialState = {
  moodLog: {},
  todayMood: null,
};

const moodReducer = (state, action) => {
  switch (action.type) {
    case 'LOG_MOOD': {
      const today = getTodayISO();
      const newMoodLog = { ...state.moodLog, [today]: action.payload };
      return { ...state, moodLog: newMoodLog, todayMood: action.payload };
    }

    case 'CLEAR_TODAY_MOOD': {
      const today = getTodayISO();
      const newMoodLog = { ...state.moodLog };
      delete newMoodLog[today];
      return { ...state, moodLog: newMoodLog, todayMood: null };
    }

    case 'SYNC_FROM_STORAGE': {
      const today = getTodayISO();
      return {
        ...state,
        moodLog: action.payload.moodLog || {},
        todayMood: action.payload.moodLog?.[today] || null,
      };
    }

    case 'LOAD_MOOD_LOG': {
      const today = getTodayISO();
      const newMoodLog = action.payload;
      saveMoodLog(newMoodLog);
      return {
        ...state,
        moodLog: newMoodLog,
        todayMood: newMoodLog[today] || null,
      };
    }

    default:
      return state;
  }
};

export const MoodProvider = ({ children }) => {
  const [state, dispatch] = useReducer(moodReducer, initialState);

  useEffect(() => {
    const moodLog = loadMoodLog();
    dispatch({
      type: 'SYNC_FROM_STORAGE',
      payload: { moodLog },
    });
  }, []);

  useEffect(() => {
    if (Object.keys(state.moodLog).length > 0 || state.moodLog !== loadMoodLog()) {
      saveMoodLog(state.moodLog);
    }
  }, [state.moodLog]);

  const logMood = (moodId) => {
    dispatch({ type: 'LOG_MOOD', payload: moodId });
  };

  const clearTodayMood = () => {
    dispatch({ type: 'CLEAR_TODAY_MOOD' });
  };

  const value = {
    moodLog: state.moodLog,
    todayMood: state.todayMood,
    logMood,
    clearTodayMood,
  };

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
};

export const useMoodContext = () => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMoodContext must be used within a MoodProvider');
  }
  return context;
};
