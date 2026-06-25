const getCode = () => {
  let code = localStorage.getItem('ht_referral_code');
  if (!code) {
    code = 'HF-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    localStorage.setItem('ht_referral_code', code);
  }
  return code;
};

const getReward = (plan) => {
  if (plan === 'elite') return 150;
  if (plan === 'pro') return 100;
  return 50;
};

export const applyReferralCode = (code) => {
  if (localStorage.getItem('ht_referral_used')) {
    return { success: false, reason: 'Already used a referral code' };
  }
  if (!code || code.length < 4) {
    return { success: false, reason: 'Invalid referral code' };
  }
  localStorage.setItem('ht_referral_used', 'true');
  localStorage.setItem('ht_referred_by', code.toUpperCase());
  const currentPlan = localStorage.getItem('ht_plan') || 'free';
  const bonus = getReward(currentPlan);
  const prevBonus = parseInt(localStorage.getItem('ht_referral_bonus') || '0');
  localStorage.setItem('ht_referral_bonus', String(prevBonus + bonus));
  return { success: true, bonus };
};

export const getReferralCode = () => getCode();

export const getReferralStats = () => {
  try {
    const stats = JSON.parse(localStorage.getItem('ht_referrals') || '{"sent":0,"completed":0}');
    stats.bonus = parseInt(localStorage.getItem('ht_referral_bonus') || '0');
    return stats;
  } catch {
    return { sent: 0, completed: 0, bonus: 0 };
  }
};

export const saveReferralStats = (stats) => {
  localStorage.setItem('ht_referrals', JSON.stringify(stats));
};

export const generateShareableLink = () => {
  const plan = localStorage.getItem('ht_plan') || 'free';
  return {
    code: getCode(),
    link: `https://dailyhabits.app/join/${getCode()}`,
    reward: getReward(plan),
  };
};

export default {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  applyReferralCode,
  addReferral,
  getReferralStats,
  generateShareableLink,
  processReferralBonus,
  REFERRAL_REWARD,
};