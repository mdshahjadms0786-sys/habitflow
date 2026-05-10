export const exportToCSV = (habits, mood) => {
  let csv = 'Date,Habit,Category,Completed,Streak,Notes\n';

  const today = new Date();
  for (let i = 365; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    habits.forEach(habit => {
      const completion = habit.completionLog?.[dateStr];
      const completed = completion ? 'Yes' : 'No';
      csv += `${dateStr},"${habit.name}",${habit.category},${completed},${habit.currentStreak || 0},"${habit.notes || ''}"\n`;
    });
  }

  return csv;
};

export const exportToJSON = (habits, mood) => {
  return JSON.stringify({ habits, mood, exportedAt: new Date().toISOString() }, null, 2);
};

export const exportToText = (habits, mood) => {
  let text = '=== HABIT TRACKER EXPORT ===\n';
  text += `Exported: ${new Date().toLocaleString()}\n\n`;

  habits.forEach(habit => {
    text += `\n--- ${habit.icon} ${habit.name} ---\n`;
    text += `Category: ${habit.category}\n`;
    text += `Priority: ${habit.priority}\n`;
    text += `Current Streak: ${habit.currentStreak || 0}\n`;
    text += `Longest Streak: ${habit.longestStreak || 0}\n`;
    
    const completions = Object.values(habit.completionLog || {}).filter(Boolean).length;
    text += `Total Completions: ${completions}\n`;
  });

  return text;
};

export const downloadFile = (content, filename, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportHabitsCSV = (habits) => {
  const csv = exportToCSV(habits, {});
  downloadFile(csv, `habit-tracker-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
};

export const exportHabitsJSON = (habits) => {
  const json = exportToJSON(habits, {});
  downloadFile(json, `habit-tracker-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
};

export const exportHabitsText = (habits) => {
  const text = exportToText(habits, {});
  downloadFile(text, `habit-tracker-${new Date().toISOString().split('T')[0]}.txt`, 'text/plain');
};

export default { exportHabitsCSV, exportHabitsJSON, exportHabitsText };