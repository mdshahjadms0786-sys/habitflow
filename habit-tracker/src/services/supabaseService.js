import {
  supabase,
  isSupabaseConfigured,
  configuredSupabaseUrl,
  configuredSupabaseKey,
} from './supabaseClient';

const getAuthErrorMessage = (err) => {
  const message = err?.message || String(err);

  if (
    message === 'Failed to fetch' ||
    message.includes('fetch') ||
    message.includes('NetworkError') ||
    message.includes('remote name could not be resolved')
  ) {
    return 'Supabase project unreachable. Check VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and that the Supabase project is active.';
  }

  return message;
};

const verifySupabaseReachable = async () => {
  if (!isSupabaseConfigured || !supabase) {
    return { error: { message: 'Supabase not configured' } };
  }

  try {
    const response = await fetch(`${configuredSupabaseUrl}/auth/v1/settings`, {
      headers: {
        apikey: configuredSupabaseKey,
      },
    });

    if (!response.ok) {
      return {
        error: {
          message: `Supabase auth is not reachable (${response.status}). Check project URL, anon key, and auth settings.`,
        },
      };
    }

    return { error: null };
  } catch (err) {
    return { error: { message: getAuthErrorMessage(err) } };
  }
};

const getOAuthRedirectTo = () => {
  if (typeof window === 'undefined') return undefined;
  return `${window.location.origin}/auth/callback`;
};

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
    return { error: { message: getAuthErrorMessage(err) } };
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
    return { error: { message: getAuthErrorMessage(err) } };
  }
};

export const signOut = async () => {
  if (!isSupabaseConfigured || !supabase) return { error: { message: 'Supabase not configured' } };

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (err) {
    return { error: { message: getAuthErrorMessage(err) } };
  }
};

export const getCurrentUser = async () => {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const hasOAuthCode = params.has('code');

      if (hasOAuthCode) {
        await supabase.auth.exchangeCodeForSession(window.location.href);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    return null;
  }
};

export const onAuthStateChange = (callback) => {
  if (!isSupabaseConfigured || !supabase) {
    return { data: { subscription: { unsubscribe: () => {} } } };
  }

  return supabase.auth.onAuthStateChange(callback);
};

export const loginWithGoogle = async () => {
  if (!isSupabaseConfigured || !supabase) {
    return { error: { message: 'Supabase not configured' } };
  }

  const reachability = await verifySupabaseReachable();
  if (reachability.error) return reachability;

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
        redirectTo: getOAuthRedirectTo(),
      },
    });
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { error: { message: getAuthErrorMessage(err) } };
  }
};

export const loginWithGoogleIdToken = async (credential) => {
  if (!isSupabaseConfigured || !supabase) {
    return { error: { message: 'Supabase not configured' } };
  }

  try {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: credential,
    });
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { error: { message: getAuthErrorMessage(err) } };
  }
};

export const getUserProfile = async (userId) => {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch {
    return null;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select();

    if (error) throw error;
    return data;
  } catch {
    return null;
  }
};

// --- NEW SYNC FUNCTIONS ---

export const fetchFocusSessions = async (userId) => {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from('focus_sessions').select('*').eq('user_id', userId);
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
};

export const saveFocusSession = async (session, userId) => {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from('focus_sessions').insert({
      id: session.id,
      user_id: userId,
      habit_id: session.habitId,
      duration: session.duration,
      date: session.date
    }).select();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
};

export const fetchJournalEntries = async (userId) => {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from('journal_entries').select('*').eq('user_id', userId);
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
};

export const saveJournalEntry = async (entry, userId) => {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from('journal_entries').upsert({
      id: entry.id,
      user_id: userId,
      habit_id: entry.habitId,
      date: entry.date,
      entry_text: entry.text,
      sentiment_score: entry.sentiment || null,
    }, { onConflict: 'id' }).select();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
};

export const fetchEliteFeatureData = async (featureKey, userId) => {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from('elite_features_data')
      .select('data_json')
      .eq('user_id', userId)
      .eq('feature_key', featureKey)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data ? data.data_json : null;
  } catch {
    return null;
  }
};

export const saveEliteFeatureData = async (featureKey, dataJson, userId) => {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from('elite_features_data').upsert({
      user_id: userId,
      feature_key: featureKey,
      data_json: dataJson,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,feature_key' }).select();
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
};

// recordPayment is removed for security.
// Payments must go through the verify-payment Edge Function which:
// 1. Verifies Razorpay signature server-side
// 2. Inserts payment record using service_role key (bypasses RLS)
// 3. Updates user plan using service_role key
// See: supabase/functions/verify-payment/index.ts
