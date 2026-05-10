const HABITS_KEY = 'habit-tracker-habits';
const SETTINGS_KEY = 'habit-tracker-settings';
const MOOD_KEY = 'ht_moodlog';
const RECENT_EMOJIS_KEY = 'ht_recent_emojis';
const TIMER_SESSIONS_KEY = 'ht_timer_sessions';
const FOCUS_SESSIONS_KEY = 'ht_focus_sessions';

export const saveRecentEmojis = (emojis) => {
  try {
    localStorage.setItem(RECENT_EMOJIS_KEY, JSON.stringify(emojis));
    return true;
  } catch (error) {
    console.error('Failed to save recent emojis:', error);
    return false;
  }
};

export const loadRecentEmojis = () => {
  try {
    const data = localStorage.getItem(RECENT_EMOJIS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load recent emojis:', error);
    return [];
  }
};

export const saveHabits = (habits) => {
  try {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    return true;
  } catch (error) {
    console.error('Failed to save habits:', error);
    return false;
  }
};

export const loadHabits = () => {
  try {
    const data = localStorage.getItem(HABITS_KEY);
    if (!data || data === '[]') {
      return []; // New user — empty array
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed.filter((h) => h != null) : [];
  } catch (error) {
    console.error('Failed to load habits:', error);
    return [];
  }
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Failed to save settings:', error);
    return false;
  }
};

export const loadSettings = () => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data
      ? JSON.parse(data)
      : { darkMode: false, ollamaModel: 'llama3', showMotivation: true };
  } catch (error) {
    console.error('Failed to load settings:', error);
    return { darkMode: false, ollamaModel: 'llama3', showMotivation: true };
  }
};

export const saveMoodLog = (moodLog) => {
  try {
    localStorage.setItem(MOOD_KEY, JSON.stringify(moodLog));
    return true;
  } catch (error) {
    console.error('Failed to save mood log:', error);
    return false;
  }
};

export const loadMoodLog = () => {
  try {
    const data = localStorage.getItem(MOOD_KEY);
    if (!data) return {};
    const parsed = JSON.parse(data);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (error) {
    console.error('Failed to load mood log:', error);
    return {};
  }
};

export const clearAllData = () => {
  try {
    localStorage.removeItem(HABITS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(MOOD_KEY);
    localStorage.removeItem(TIMER_SESSIONS_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear data:', error);
    return false;
  }
};

export const saveTimerSessions = (data) => {
  try {
    localStorage.setItem(TIMER_SESSIONS_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save timer sessions:', error);
    return false;
  }
};

export const loadTimerSessions = () => {
  try {
    const data = localStorage.getItem(TIMER_SESSIONS_KEY);
    return data ? JSON.parse(data) : { totalSessions: 0 };
  } catch {
    return { totalSessions: 0 };
  }
};

export const saveFocusSessions = (sessions) => {
  try {
    localStorage.setItem(FOCUS_SESSIONS_KEY, JSON.stringify(sessions));
    return true;
  } catch {
    return false;
  }
};

export const loadFocusSessions = () => {
  try {
    const data = localStorage.getItem(FOCUS_SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};
