const JOURNAL_KEY = 'ht_journal';

const loadJournal = () => {
  try {
    const data = localStorage.getItem(JOURNAL_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const saveJournal = (journal) => {
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(journal));
};

export const saveJournalEntry = (habitId, date, note) => {
  if (!habitId || !date) return;
  const journal = loadJournal();
  if (!journal[habitId]) {
    journal[habitId] = {};
  }
  journal[habitId][date] = {
    note,
    updatedAt: new Date().toISOString(),
  };
  saveJournal(journal);
};

export const getJournalEntry = (habitId, date) => {
  if (!habitId || !date) return null;
  const journal = loadJournal();
  return journal[habitId]?.[date]?.note || null;
};

export const getHabitJournal = (habitId) => {
  if (!habitId) return [];
  const journal = loadJournal();
  const entries = journal[habitId] || {};

  return Object.entries(entries)
    .map(([date, data]) => ({
      habitId,
      date,
      note: data.note,
      updatedAt: data.updatedAt,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
};

export const getAllJournalEntries = () => {
  const journal = loadJournal();
  const allEntries = [];

  Object.entries(journal).forEach(([habitId, entries]) => {
    Object.entries(entries).forEach(([date, data]) => {
      allEntries.push({
        habitId,
        date,
        note: data.note,
        updatedAt: data.updatedAt,
      });
    });
  });

  return allEntries.sort((a, b) => b.date.localeCompare(a.date));
};

export const deleteJournalEntry = (habitId, date) => {
  if (!habitId || !date) return;
  const journal = loadJournal();
  if (journal[habitId]?.[date]) {
    delete journal[habitId][date];
    if (Object.keys(journal[habitId] || {}).length === 0) {
      delete journal[habitId];
    }
    saveJournal(journal);
  }
};

export const searchJournalEntries = (query) => {
  if (!query) return [];
  const allEntries = getAllJournalEntries();
  const lowerQuery = query.toLowerCase();

  return allEntries.filter(entry =>
    entry.note?.toLowerCase().includes(lowerQuery)
  );
};

export const exportJournalAsText = (habits = []) => {
  const allEntries = getAllJournalEntries();

  if (allEntries.length === 0) {
    return 'No journal entries found.';
  }

  const habitMap = new Map(habits.map(h => [h.id, h]));

  let text = '=== HABIT JOURNAL EXPORT ===\n';
  text += `Exported: ${new Date().toLocaleString()}\n`;
  text += '================================\n\n';

  const groupedByHabit = {};
  allEntries.forEach(entry => {
    if (!groupedByHabit[entry.habitId]) {
      groupedByHabit[entry.habitId] = [];
    }
    groupedByHabit[entry.habitId].push(entry);
  });

  Object.entries(groupedByHabit).forEach(([habitId, entries]) => {
    const habit = habitMap.get(habitId);
    const habitName = habit ? `${habit.icon} ${habit.name}` : habitId;

    text += `--- ${habitName} ---\n\n`;

    entries.sort((a, b) => b.date.localeCompare(a.date));

    entries.forEach(entry => {
      text += `${entry.date}\n`;
      text += `${entry.note}\n\n`;
    });
  });

  return text;
};