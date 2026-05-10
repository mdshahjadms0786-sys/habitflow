const STORAGE_KEY = 'ht_experiments';

export const getExperimentProgress = (experiment) => {
  if (!experiment) return { daysCompleted: 0, daysLeft: 0, percentage: 0 };
  
  const start = new Date(experiment.startDate);
  const now = new Date();
  const daysCompleted = Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1;
  const daysLeft = Math.max(0, experiment.duration - daysCompleted);
  const percentage = Math.min(100, Math.round((daysCompleted / experiment.duration) * 100));
  
  return { daysCompleted, daysLeft, percentage };
};

export const getActiveExperiment = (experiments) => {
  if (!experiments || experiments.length === 0) return null;
  return experiments.find(e => e.status === 'active') || null;
};

export const saveExperimentNote = (experiments, experimentId, date, note) => {
  return experiments.map(exp => {
    if (exp.id === experimentId) {
      return {
        ...exp,
        dailyNotes: { ...exp.dailyNotes, [date]: note }
      };
    }
    return exp;
  });
};

export const completeExperiment = (experiments, experimentId, result) => {
  return experiments.map(exp => {
    if (exp.id === experimentId) {
      return {
        ...exp,
        status: 'completed',
        result,
        completedAt: new Date().toISOString()
      };
    }
    return exp;
  });
};

export const abandonExperiment = (experiments, experimentId) => {
  return experiments.map(exp => {
    if (exp.id === experimentId) {
      return { ...exp, status: 'abandoned' };
    }
    return exp;
  });
};

export const generateExperimentReport = (experiment, habits) => {
  const { daysCompleted, percentage } = getExperimentProgress(experiment);
  
  const habit = habits.find(h => h.id === experiment.habitId);
  let completionRate = 0;
  if (habit?.completionLog) {
    const dates = Object.keys(habit.completionLog);
    const experimentDates = dates.filter(d => {
      const expDate = new Date(d);
      const startDate = new Date(experiment.startDate);
      const endDate = new Date(experiment.endDate);
      return expDate >= startDate && expDate <= endDate;
    });
    completionRate = experimentDates.length > 0 
      ? Math.round((experimentDates.length / daysCompleted) * 100) 
      : 0;
  }

  return {
    title: experiment.title,
    habitName: experiment.habitName,
    duration: experiment.duration,
    daysCompleted,
    completionRate,
    hypothesis: experiment.hypothesis,
    result,
    startedAt: experiment.startDate,
    completedAt: new Date().toISOString()
  };
};

export const createExperiment = (data) => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + data.duration);
  
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    title: data.title,
    habitId: data.habitId,
    habitName: data.habitName,
    duration: data.duration,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    hypothesis: data.hypothesis || '',
    beforeState: data.beforeState || '',
    dailyNotes: {},
    afterState: '',
    status: 'active',
    result: null,
    createdAt: new Date().toISOString()
  };
};

export const saveExperiments = (experiments) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(experiments));
  } catch (e) {
    console.error('Failed to save experiments', e);
  }
};

export const loadExperiments = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to load experiments', e);
    return [];
  }
};

export const DURATION_OPTIONS = [
  { value: 7, label: '7 days' },
  { value: 14, label: '14 days' },
  { value: 21, label: '21 days' },
  { value: 30, label: '30 days' },
  { value: 66, label: '66 days' }
];

export default { 
  getExperimentProgress, 
  getActiveExperiment, 
  createExperiment, 
  saveExperiments, 
  loadExperiments,
  completeExperiment,
  abandonExperiment,
  generateExperimentReport,
  DURATION_OPTIONS
};