import { createContext, useContext, useReducer, useEffect, useCallback, useState } from 'react';
import { saveHabits, loadHabits, saveSettings, loadSettings } from '../utils/db';
import { calculateCurrentStreak, calculateLongestStreak } from '../utils/streakUtils';
import { getTodayISO } from '../utils/dateUtils';
import { format } from 'date-fns';
import { checkNewBadge } from '../utils/badgeUtils';
import { addPoints, checkAndAwardStreakBonus, checkAndAwardPerfectDay } from '../utils/pointsUtils';
import { calculatePointsForCompletion, getDifficultyLevel } from '../utils/difficultyUtils';
import { getMaxHabits, isPro } from '../utils/planUtils';
import toast from 'react-hot-toast';
import logger from '../utils/logger';
import { useAuthContext } from './AuthContext';
import { supabase } from '../services/supabaseClient';

const CAN_COMPLETE_HOURS = 24;

const canComplete = (habit) => {
  if (!habit.createdAt) return true;
  const created = new Date(habit.createdAt);
  const now = new Date();
  const hoursSinceCreation = (now - created) / (1000 * 60 * 60);
  return hoursSinceCreation <= CAN_COMPLETE_HOURS;
};

const isExpired = (habit) => {
  if (!habit.createdAt) return false;
  const created = new Date(habit.createdAt);
  const now = new Date();
  const hoursSinceCreation = (now - created) / (1000 * 60 * 60);
  return hoursSinceCreation > CAN_COMPLETE_HOURS;
};

const HabitContext = createContext(null);

export { CAN_COMPLETE_HOURS, canComplete, isExpired };

const initialState = {
  habits: [],
  darkMode: false,
  showMotivation: true,
  todayDate: getTodayISO(),
  newlyUnlockedBadge: null,
};

const habitReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_HABIT': {
      const maxHabits = getMaxHabits();
      const activeHabits = state.habits.filter(h => h.isActive !== false);

      if (activeHabits.length >= maxHabits) {
        if (isPro()) {
          toast.error(`You've reached your limit of ${maxHabits} active habits. Pause or delete some to add new ones.`);
        } else {
          toast.error(`Free plan allows only ${maxHabits} habits. Upgrade to Pro for unlimited!`);
        }
        return state;
      }
      const newHabits = [...state.habits, action.payload];
      saveHabits(newHabits);
      addPoints('habitCreated');
      return { ...state, habits: newHabits };
    }

    case 'EDIT_HABIT': {
      const newHabits = state.habits.map((habit) =>
        habit.id === action.payload.id ? { ...habit, ...action.payload } : habit
      );
      saveHabits(newHabits);
      return { ...state, habits: newHabits };
    }

    case 'DELETE_HABIT': {
      const newHabits = state.habits.filter((habit) => habit.id !== action.payload);
      saveHabits(newHabits);
      return { ...state, habits: newHabits };
    }

    case 'TOGGLE_HABIT': {
      const { habitId, date, isUndo } = action.payload;
      const targetDate = date || getTodayISO();
      let unlockedBadge = null;
      const newHabits = state.habits.map((habit) => {
        if (habit.id === habitId) {
          const newCompletionLog = { ...habit.completionLog };
          const existing = newCompletionLog[targetDate];
          
          if (existing) {
            delete newCompletionLog[targetDate];
          } else {
            if (!isUndo && !canComplete(habit)) {
              return habit;
            }
            const now = new Date();
            const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            newCompletionLog[targetDate] = { completed: true, completedAt: timeStr, locked: false };
            
            const { total, basePoints } = calculatePointsForCompletion(habit);
            addPoints(total);
            
            const difficulty = getDifficultyLevel(habit.difficulty || 'medium');
            const toastEmojis = { easy: '✅', medium: '⭐', hard: '🔥', extreme: '💀' };
            toast.success(`${toastEmojis[difficulty.id]} +${basePoints} pts`);
          }
          const newCurrentStreak = calculateCurrentStreak(newCompletionLog);
          const newLongestStreak = calculateLongestStreak(newCompletionLog);
          const oldStreak = habit.currentStreak || 0;
          // Streak milestone bonus
          if (newCurrentStreak > 0) {
            checkAndAwardStreakBonus(newCurrentStreak, habit.id);
          }
          const newlyUnlocked = checkNewBadge(oldStreak, newCurrentStreak);
          if (newlyUnlocked) {
            unlockedBadge = { badge: newlyUnlocked, habitName: habit.name };
          }
          return {
            ...habit,
            completionLog: newCompletionLog,
            currentStreak: newCurrentStreak,
            longestStreak: Math.max(habit.longestStreak, newLongestStreak),
          };
        }
        return habit;
      });
      saveHabits(newHabits);
      return {
        ...state,
        habits: newHabits,
        newlyUnlockedBadge: unlockedBadge || state.newlyUnlockedBadge,
      };
    }

    case 'SET_DARK_MODE': {
      saveSettings({ darkMode: action.payload, showMotivation: state.showMotivation });
      return { ...state, darkMode: action.payload };
    }

    case 'SET_SHOW_MOTIVATION': {
      saveSettings({ darkMode: state.darkMode, showMotivation: action.payload });
      return { ...state, showMotivation: action.payload };
    }

    case 'IMPORT_DATA': {
      const { habits: importedHabits, settings: importedSettings } = action.payload;
      if (importedHabits) {
        saveHabits(importedHabits);
      }
      if (importedSettings) {
        saveSettings(importedSettings);
      }
      return {
        ...state,
        habits: importedHabits || state.habits,
        darkMode: importedSettings?.darkMode ?? state.darkMode,
        showMotivation: importedSettings?.showMotivation ?? state.showMotivation,
      };
    }

    case 'RESET_ALL_DATA': {
      saveHabits([]);
      saveSettings({ darkMode: false, showMotivation: true });
      return { ...initialState, todayDate: getTodayISO() };
    }

    case 'SYNC_FROM_STORAGE': {
      const loadedHabits = (action.payload.habits || []).map(habit => {
        const currentStreak = calculateCurrentStreak(habit.completionLog || {});
        const longestStreak = calculateLongestStreak(habit.completionLog || {});
        return {
          ...habit,
          currentStreak: currentStreak,
          longestStreak: Math.max(habit.longestStreak || 0, longestStreak),
        };
      });
      return {
        ...state,
        habits: loadedHabits,
        darkMode: action.payload.settings?.darkMode ?? state.darkMode,
        showMotivation: action.payload.settings?.showMotivation ?? state.showMotivation,
        newlyUnlockedBadge: null,
      };
    }

    case 'CLEAR_BADGE_POPUP': {
      return { ...state, newlyUnlockedBadge: null };
    }

    case 'LOAD_HABITS': {
      saveHabits(action.payload);
      return { ...state, habits: action.payload };
    }

    case 'DAY_RESET': {
      return { ...state, todayDate: action.payload.newDate };
    }

    default:
      return state;
  }
};

export const HabitProvider = ({ children }) => {
  const [state, dispatch] = useReducer(habitReducer, initialState);
  const { user } = useAuthContext();

  // 1. Fetch from Supabase when user logs in
  useEffect(() => {
    if (user && supabase) {
      const fetchSupabase = async () => {
        const { data, error } = await supabase.from('habits').select('*').eq('user_id', user.id);
        if (!error && data && data.length > 0) {
           const mapped = data.map(h => ({
             id: h.id,
             name: h.name,
             category: h.category,
             priority: h.priority,
             icon: h.icon,
             reminderTime: h.reminder_time,
             notes: h.notes,
             completionLog: h.completion_log,
             currentStreak: h.current_streak,
             longestStreak: h.longest_streak,
             createdAt: h.created_at
           }));
           // Load into state and local storage
           dispatch({ type: 'LOAD_HABITS', payload: mapped });
        }
      };
      fetchSupabase();
    }
  }, [user]);

  // 2. Sync to Supabase whenever local habits change
  useEffect(() => {
    if (user && supabase && state.habits.length > 0) {
       const mappedHabits = state.habits.map(h => ({
        id: h.id,
        user_id: user.id,
        name: h.name,
        category: h.category,
        priority: h.priority,
        icon: h.icon,
        reminder_time: h.reminderTime,
        notes: h.notes,
        completion_log: h.completionLog,
        current_streak: h.currentStreak,
        longest_streak: h.longestStreak,
        created_at: h.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));
      
      supabase.from('habits').upsert(mappedHabits, { onConflict: 'id' })
        .then(({ error }) => { 
          if (error) logger.error('Supabase Sync Error:', error); 
        });
    }
  }, [state.habits, user]);

  useEffect(() => {
    const checkMidnightReset = () => {
      const now = new Date();
      const lastResetDate = localStorage.getItem('ht_last_reset_date');
      const todayStr = format(now, 'yyyy-MM-dd');
      
      if (lastResetDate !== todayStr) {
        localStorage.setItem('ht_last_reset_date', todayStr);
        
        dispatch({ type: 'DAY_RESET', payload: { newDate: todayStr } });
        
        toast('🌅 New day! Your habits have reset', {
          icon: '🌅',
          duration: 4000
        });
      }
    };
    
    checkMidnightReset();
    
    const interval = setInterval(checkMidnightReset, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const habits = loadHabits();
    const settings = loadSettings();
    dispatch({
      type: 'SYNC_FROM_STORAGE',
      payload: { habits, settings },
    });
  }, []);

  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  const addHabit = useCallback((habit) => {
    dispatch({ type: 'ADD_HABIT', payload: habit });
  }, []);

  const editHabit = useCallback((habit) => {
    dispatch({ type: 'EDIT_HABIT', payload: habit });
  }, []);

  const deleteHabit = useCallback((id) => {
    dispatch({ type: 'DELETE_HABIT', payload: id });
  }, []);

  const toggleHabit = useCallback((habitId, date, isUndo = false) => {
    dispatch({ type: 'TOGGLE_HABIT', payload: { habitId, date, isUndo } });
  }, []);

  const setDarkMode = useCallback((darkMode) => {
    dispatch({ type: 'SET_DARK_MODE', payload: darkMode });
  }, []);

  const setShowMotivation = useCallback((show) => {
    dispatch({ type: 'SET_SHOW_MOTIVATION', payload: show });
  }, []);

  const importData = useCallback((habits, settings) => {
    dispatch({ type: 'IMPORT_DATA', payload: { habits, settings } });
  }, []);

  const resetAllData = useCallback(() => {
    dispatch({ type: 'RESET_ALL_DATA' });
  }, []);

  const clearBadgePopup = useCallback(() => {
    dispatch({ type: 'CLEAR_BADGE_POPUP' });
  }, []);

  const value = {
    habits: state.habits,
    darkMode: state.darkMode,
    showMotivation: state.showMotivation,
    todayDate: state.todayDate,
    newlyUnlockedBadge: state.newlyUnlockedBadge,
    addHabit,
    editHabit,
    deleteHabit,
    toggleHabit,
    setDarkMode,
    setShowMotivation,
    importData,
    resetAllData,
    clearBadgePopup,
  };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
};

export const useHabitContext = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabitContext must be used within a HabitProvider');
  }
  return context;
};
