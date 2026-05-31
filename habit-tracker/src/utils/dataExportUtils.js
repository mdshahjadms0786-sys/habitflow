import { getTodayISO } from './dateUtils';

export const exportToJSON = (habits, completions) => {
  const data = {
    exportDate: new Date().toISOString(),
    habits,
    completions,
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `habit-tracker-export-${getTodayISO()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToCSV = (habits, completions) => {
  let csv = 'Habit Name,Category,Date,Completed\n';
  
  Object.keys(completions).forEach(key => {
    const [habitId, date] = key.split('_');
    const habit = habits.find(h => h.id === habitId);
    if (habit && completions[key]) {
      csv += `"${habit.name}","${habit.category}","${date}","${completions[key] ? 'Yes' : 'No'}"\n`;
    }
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `habit-tracker-export-${getTodayISO()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const importData = (data) => {
  if (data.habits) {
    localStorage.setItem('ht_habits', JSON.stringify(data.habits));
  }
  if (data.completions) {
    localStorage.setItem('ht_completions', JSON.stringify(data.completions));
  }
  return true;
};