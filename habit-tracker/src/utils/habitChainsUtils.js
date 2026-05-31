const CHAINS_KEY = 'ht_habit_chains';

export const getChainDependencies = (habitId) => {
  try {
    const chains = JSON.parse(localStorage.getItem(CHAINS_KEY) || '{}');
    return chains[habitId] || [];
  } catch {
    return [];
  }
};

export const setChainDependency = (habitId, dependsOn) => {
  try {
    const chains = JSON.parse(localStorage.getItem(CHAINS_KEY) || '{}');
    chains[habitId] = dependsOn;
    localStorage.setItem(CHAINS_KEY, JSON.stringify(chains));
    return true;
  } catch {
    return false;
  }
};

export const removeChainDependency = (habitId, dependsOnId) => {
  try {
    const chains = JSON.parse(localStorage.getItem(CHAINS_KEY) || '{}');
    if (chains[habitId]) {
      chains[habitId] = chains[habitId].filter(id => id !== dependsOnId);
    }
    localStorage.setItem(CHAINS_KEY, JSON.stringify(chains));
    return true;
  } catch {
    return false;
  }
};

export const canCompleteChainedHabit = (habitId, habits, completions, date) => {
  const deps = getChainDependencies(habitId);
  if (!deps || deps.length === 0) return true;
  
  for (const depId of deps) {
    const depHabit = habits.find(h => h.id === depId);
    if (!depHabit) continue;
    
    if (!completions[`${depId}_${date}`]) {
      return false;
    }
  }
  return true;
};

export const getChainStatus = (habitId, habits, completions, date) => {
  const deps = getChainDependencies(habitId);
  const status = {
    blocked: false,
    blockedBy: [],
    completed: [],
  };
  
  for (const depId of deps) {
    const depHabit = habits.find(h => h.id === depId);
    if (!depHabit) continue;
    
    if (completions[`${depId}_${date}`]) {
      status.completed.push(depHabit.name);
    } else {
      status.blocked = true;
      status.blockedBy.push(depHabit.name);
    }
  }
  
  return status;
};