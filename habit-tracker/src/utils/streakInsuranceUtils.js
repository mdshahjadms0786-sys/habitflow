const STREAK_INSURANCE_KEY = 'ht_streak_insurance';

const INSURANCE_CONFIG = {
  cost: 100,
  protectionPerUse: 1,
  maxProtection: 3,
};

export const getStreakInsurance = () => {
  try {
    const data = JSON.parse(localStorage.getItem(STREAK_INSURANCE_KEY)) || {
      pointsSpent: 0,
      protectionUsed: 0,
      totalProtected: 0,
    };
    return data;
  } catch {
    return { pointsSpent: 0, protectionUsed: 0, totalProtected: 0 };
  }
};

export const saveStreakInsurance = (data) => {
  localStorage.setItem(STREAK_INSURANCE_KEY, JSON.stringify(data));
};

export const buyStreakInsurance = (currentPoints) => {
  const insurance = getStreakInsurance();
  
  if (currentPoints < INSURANCE_CONFIG.cost) {
    return { success: false, reason: 'Not enough points' };
  }
  
  if (insurance.totalProtected >= INSURANCE_CONFIG.maxProtection) {
    return { success: false, reason: 'Maximum protection reached' };
  }
  
  const newData = {
    pointsSpent: insurance.pointsSpent + INSURANCE_CONFIG.cost,
    protectionUsed: insurance.protectionUsed,
    totalProtected: insurance.totalProtected + 1,
  };
  
  saveStreakInsurance(newData);
  
  return {
    success: true,
    remaining: INSURANCE_CONFIG.maxProtection - newData.totalProtected,
    totalProtected: newData.totalProtected,
  };
};

export const useStreakInsurance = (currentPoints = 0) => {
  const insurance = getStreakInsurance();
  
  const canBuy = currentPoints >= INSURANCE_CONFIG.cost && 
                 insurance.totalProtected < INSURANCE_CONFIG.maxProtection;
  
  const useProtection = () => {
    const insurance = getStreakInsurance();
    if (insurance.protectionUsed <= 0) return false;
    
    const newData = {
      ...insurance,
      protectionUsed: insurance.protectionUsed - 1,
    };
    saveStreakInsurance(newData);
    return true;
  };
  
  return {
    insurance,
    canBuy,
    cost: INSURANCE_CONFIG.cost,
    remainingProtection: INSURANCE_CONFIG.maxProtection - insurance.totalProtected,
    useProtection,
    buyStreakInsurance: () => buyStreakInsurance(currentPoints),
  };
};

export { INSURANCE_CONFIG };

export default { getStreakInsurance, buyStreakInsurance, useStreakInsurance, INSURANCE_CONFIG };