import { createContext, useContext, useReducer, useEffect } from 'react';
import logger from '../utils/logger';
import { saveMoodLog, loadMoodLog } from '../utils/db';
import { getTodayISO } from '../utils/dateUtils';
import { addPoints } from '../utils/pointsUtils';
import { useAuthContext } from './AuthContext';
import { supabase } from '../services/supabaseClient';

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
  const { user } = useAuthContext();

  useEffect(() => {
    if (user && supabase) {
      const fetchSupabase = async () => {
        const { data, error } = await supabase.from('mood_logs').select('*').eq('user_id', user.id);
        if (!error && data && data.length > 0) {
           const mappedMoodLog = {};
           data.forEach(log => {
             mappedMoodLog[log.date] = log.mood;
           });
           dispatch({ type: 'LOAD_MOOD_LOG', payload: mappedMoodLog });
        }
      };
      fetchSupabase();
    }
  }, [user]);

  useEffect(() => {
    const moodLog = loadMoodLog();
    dispatch({
      type: 'SYNC_FROM_STORAGE',
      payload: { moodLog },
    });
  }, []);

  useEffect(() => {
    if (Object.keys(state.moodLog).length > 0 || JSON.stringify(state.moodLog) !== JSON.stringify(loadMoodLog())) {
      saveMoodLog(state.moodLog);
      
      if (user && supabase && Object.keys(state.moodLog).length > 0) {
        const mappedLogs = Object.entries(state.moodLog).map(([date, mood]) => ({
          user_id: user.id,
          date,
          mood
        }));
        
        supabase.from('mood_logs').upsert(mappedLogs, { onConflict: 'user_id,date' })
          .then(({ error }) => { 
            if (error) logger.error('Supabase Mood Sync Error:', error); 
          })
          .catch(e => logger.error('Sync failed:', e));
      }
    }
  }, [state.moodLog, user]);

  const logMood = (moodId) => {
    dispatch({ type: 'LOG_MOOD', payload: moodId });
    addPoints('moodCheckin');
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
