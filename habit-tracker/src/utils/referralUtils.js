const REFERRAL_KEY = 'ht_referral_data';
const USER_PROFILE_KEY = 'ht_user_profile';

export const REFERRAL_REWARD = 50;
export const REFERRAL_CODE_LENGTH = 8;

const generateReferralCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < REFERRAL_CODE_LENGTH; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const getUserProfile = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_PROFILE_KEY)) || null;
  } catch {
    return null;
  }
};

export const createUserProfile = (name = null) => {
  const profile = {
    id: generateReferralCode() + generateReferralCode(),
    referralCode: generateReferralCode(),
    name: name || null,
    createdAt: new Date().toISOString(),
    referredBy: null,
    referralUsed: false,
    referrerBonusGiven: false,
    totalReferrals: 0,
  };
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  return profile;
};

export const updateUserProfile = (updates) => {
  const profile = getUserProfile() || createUserProfile();
  const updated = { ...profile, ...updates };
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
  return updated;
};

export const getReferralData = () => {
  try {
    return JSON.parse(localStorage.getItem(REFERRAL_KEY)) || {
      referrals: [],
      pendingClaims: [],
    };
  } catch {
    return { referrals: [], pendingClaims: [] };
  }
};

export const saveReferralData = (data) => {
  localStorage.setItem(REFERRAL_KEY, JSON.stringify(data));
};

export const applyReferralCode = (code) => {
  const profile = getUserProfile();
  
  if (profile?.referralUsed) {
    return { success: false, reason: 'Already used a referral code' };
  }
  
  if (code.length < 4) {
    return { success: false, reason: 'Invalid referral code' };
  }

  const updated = updateUserProfile({
    referredBy: code.toUpperCase(),
    referralUsed: true,
  });

  const referralData = getReferralData();
  referralData.pendingClaims.push({
    code: code.toUpperCase(),
    claimedAt: new Date().toISOString(),
    status: 'pending',
  });
  saveReferralData(referralData);

  return { success: true, bonus: REFERRAL_REWARD };
};

export const addReferral = (referredCode) => {
  const profile = getUserProfile();
  if (!profile) return null;

  const referralData = getReferralData();
  
  const existing = referralData.referrals.find(r => r.code === referredCode);
  if (existing) {
    return { success: false, reason: 'Already referred' };
  }

  referralData.referrals.push({
    code: referredCode,
    referredAt: new Date().toISOString(),
    status: 'completed',
    bonusGiven: false,
  });
  
  saveReferralData(referralData);
  
  updateUserProfile({
    totalReferrals: profile.totalReferrals + 1,
  });

  return { success: true };
};

export const processReferralBonus = (userId) => {
  const profile = getUserProfile();
  if (!profile?.referredBy) return null;

  const referralData = getReferralData();
  const claim = referralData.pendingClaims.find(c => c.code === profile.referredBy && c.status === 'pending');
  
  if (claim) {
    claim.status = 'completed';
    claim.processedAt = new Date().toISOString();
    saveReferralData(referralData);
    
    updateUserProfile({
      referrerBonusGiven: true,
    });
    
    return { bonus: REFERRAL_REWARD };
  }
  
  return null;
};

export const getReferralStats = () => {
  const profile = getUserProfile();
  const referralData = getReferralData();
  
  if (!profile) {
    return {
      referralCode: null,
      totalReferrals: 0,
      successfulReferrals: 0,
      pendingClaims: 0,
      totalBonusEarned: 0,
    };
  }

  const successfulReferrals = referralData.referrals.filter(r => r.status === 'completed').length;
  const pendingClaims = referralData.pendingClaims.filter(c => c.status === 'pending').length;

  return {
    referralCode: profile.referralCode,
    totalReferrals: profile.totalReferrals || successfulReferrals,
    successfulReferrals,
    pendingClaims,
    totalBonusEarned: successfulReferrals * REFERRAL_REWARD,
  };
};

export const generateShareableLink = () => {
  const profile = getUserProfile() || createUserProfile();
  return {
    code: profile.referralCode,
    link: `https://dailyhabits.app/join/${profile.referralCode}`,
    reward: REFERRAL_REWARD,
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