import { supabase, isSupabaseConfigured } from './supabaseClient';

export const fetchHabits = async (userId) => {
  if (!isSupabaseConfigured || !supabase) return null;
  
  try {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
return data || [];
  } catch {
    return null;
  }
};

export const saveHabit = async (habit, userId) => {
  if (!isSupabaseConfigured || !supabase) return null;
  
  try {
    const habitData = {
      id: habit.id,
      user_id: userId,
      name: habit.name,
      category: habit.category,
      priority: habit.priority,
      icon: habit.icon,
      reminder_time: habit.reminderTime,
      notes: habit.notes,
      completion_log: habit.completionLog,
      current_streak: habit.currentStreak,
      longest_streak: habit.longestStreak,
      created_at: habit.createdAt,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('habits')
      .upsert(habitData, { onConflict: 'id' })
      .select();
    
if (error) throw error;
    return data || habit;
  } catch {
    return null;
  }
};

export const deleteHabit = async (habitId) => {
  if (!isSupabaseConfigured || !supabase) return null;
  
  try {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId);
    
    if (error) throw error;
    return true;
  } catch {
    return false;
  }
};

export const updateHabitCompletion = async (habitId, completionLog) => {
  if (!isSupabaseConfigured || !supabase) return null;
  
  try {
    const { data, error } = await supabase
      .from('habits')
      .update({ 
        completion_log: completionLog,
        updated_at: new Date().toISOString(),
      })
      .eq('id', habitId)
      .select();
    
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
};

export const fetchMoodLog = async (userId) => {
  if (!isSupabaseConfigured || !supabase) return null;
  
  try {
    const { data, error } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    const moodLog = {};
    (data || []).forEach(entry => {
      moodLog[entry.date] = entry.mood_id;
    });
    return moodLog;
  } catch {
    return null;
  }
};

export const saveMoodEntry = async (date, moodId, userId) => {
  if (!isSupabaseConfigured || !supabase) return null;
  
  try {
    const { data, error } = await supabase
      .from('mood_logs')
      .upsert({
        user_id: userId,
        date,
        mood_id: moodId,
      }, { onConflict: 'user_id,date' })
      .select();
    
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
};

export const signUp = async (email, password) => {
  if (!isSupabaseConfigured || !supabase) {
    return { error: { message: 'Supabase not configured' } };
  }
  
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { error: { message: err.message } };
  }
};

export const signIn = async (email, password) => {
  if (!isSupabaseConfigured || !supabase) {
    return { error: { message: 'Supabase not configured' } };
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { error: { message: err.message } };
  }
};

export const signOut = async () => {
  if (!isSupabaseConfigured || !supabase) return { error: { message: 'Supabase not configured' } };
  
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (err) {
    return { error: { message: err.message } };
  }
};

export const getCurrentUser = async () => {
  if (!isSupabaseConfigured || !supabase) return null;
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    return null;
  }
};

export const onAuthStateChange = (callback) => {
  if (!isSupabaseConfigured || !supabase) return () => {};
  
  return supabase.auth.onAuthStateChange(callback);
};

export const loginWithGoogle = async () => {
  if (!isSupabaseConfigured || !supabase) {
    return { error: { message: 'Supabase not configured' } };
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { error: { message: err.message } };
  }
};