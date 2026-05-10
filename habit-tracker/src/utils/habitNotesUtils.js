import { getTodayISO, format } from './dateUtils';

const NOTES_KEY = 'ht_habit_notes';

export const getHabitNotes = (habitId, date) => {
  try {
    const allNotes = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
    const dateKey = date || getTodayISO();
    return allNotes[`${habitId}_${dateKey}`] || null;
  } catch {
    return null;
  }
};

export const saveHabitNote = (habitId, note, date) => {
  try {
    const allNotes = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
    const dateKey = date || getTodayISO();
    allNotes[`${habitId}_${dateKey}`] = {
      note,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(NOTES_KEY, JSON.stringify(allNotes));
    return true;
  } catch {
    return false;
  }
};

export const deleteHabitNote = (habitId, date) => {
  try {
    const allNotes = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
    const dateKey = date || getTodayISO();
    delete allNotes[`${habitId}_${dateKey}`];
    localStorage.setItem(NOTES_KEY, JSON.stringify(allNotes));
    return true;
  } catch {
    return false;
  }
};

export const getAllNotesForDate = (date) => {
  try {
    const allNotes = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
    const dateKey = date || getTodayISO();
    const notes = [];
    
    Object.keys(allNotes).forEach(key => {
      if (key.endsWith(`_${dateKey}`)) {
        const habitId = key.split('_')[0];
        notes.push({
          habitId,
          note: allNotes[key],
        });
      }
    });
    
    return notes;
  } catch {
    return [];
  }
};