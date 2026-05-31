import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveProfile, loadProfile, generateUsername } from '../../utils/profileUtils';

const AVATAR_EMOJIS = [
  '👤', '😀', '😎', '🤓', '🧑‍💻', '👨‍🎨', '👩‍🔬', '👨‍🏫', '👩‍⚕️', '👨‍💼',
  '🦸', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞', '🦊', '🐱', '🐼',
  '🦁', '🐯', '🐻', '🐨', '🐸', '🦄', '🐲', '🦅', '🦉', '🦋',
  '🌟', '⭐', '🌙', '☀️', '🌈', '🔥', '💎', '🎯', '🏆', '🎨'
];

const GOAL_OPTIONS = [
  { id: 'fitness', name: 'Get Fit & Healthy', icon: '💪' },
  { id: 'learning', name: 'Learn & Grow', icon: '📚' },
  { id: 'productivity', name: 'Be More Productive', icon: '💼' },
  { id: 'wellbeing', name: 'Improve Wellbeing', icon: '😊' },
  { id: 'finances', name: 'Build Better Finances', icon: '💰' },
  { id: 'habits', name: 'Build Good Habits', icon: '🌟' }
];

const EditProfileModal = ({ isOpen, onClose }) => {
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    bio: '',
    avatarEmoji: '👤',
    isPublic: false,
    goals: []
  });
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (isOpen) {
      const loaded = loadProfile();
      setProfile(loaded);
    }
  }, [isOpen]);
  
  const handleSave = () => {
    const newErrors = {};
    if (!profile.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!profile.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (profile.bio.length > 150) {
      newErrors.bio = 'Bio must be 150 characters or less';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    saveProfile(profile);
    onClose();
  };
  
  const handleNameChange = (name) => {
    setProfile({ ...profile, name, username: generateUsername(name) });
  };
  
  const toggleGoal = (goalId) => {
    setProfile(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '20px',
            padding: '24px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Edit Profile</h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              ✕
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Avatar
              </label>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  maxHeight: '150px',
                  overflow: 'auto',
                  padding: '12px',
                  backgroundColor: 'var(--bg)',
                  borderRadius: '12px'
                }}
              >
                {AVATAR_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setProfile({ ...profile, avatarEmoji: emoji })}
                    style={{
                      width: '40px',
                      height: '40px',
                      fontSize: '24px',
                      border: profile.avatarEmoji === emoji ? '2px solid var(--primary)' : '2px solid var(--border)',
                      borderRadius: '8px',
                      backgroundColor: profile.avatarEmoji === emoji ? 'var(--primary-light)' : 'var(--surface)',
                      cursor: 'pointer'
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleNameChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: errors.name ? '1px solid #ef4444' : '1px solid var(--border)',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--text)',
                  fontSize: '14px'
                }}
              />
              {errors.name && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.name}</span>}
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Username
              </label>
              <input
                type="text"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: errors.username ? '1px solid #ef4444' : '1px solid var(--border)',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--text)',
                  fontSize: '14px'
                }}
              />
              {errors.username && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.username}</span>}
              <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                @{profile.username}
              </span>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Bio ({profile.bio.length}/150)
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value.slice(0, 150) })}
                placeholder="Tell us about yourself..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: errors.bio ? '1px solid #ef4444' : '1px solid var(--border)',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--text)',
                  fontSize: '14px',
                  resize: 'none'
                }}
              />
              {errors.bio && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.bio}</span>}
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Goals
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {GOAL_OPTIONS.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '20px',
                      border: profile.goals.includes(goal.id) ? '1px solid var(--primary)' : '1px solid var(--border)',
                      backgroundColor: profile.goals.includes(goal.id) ? 'var(--primary-light)' : 'transparent',
                      color: 'var(--text)',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    {goal.icon} {goal.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={profile.isPublic}
                  onChange={(e) => setProfile({ ...profile, isPublic: e.target.checked })}
                  style={{ width: '18px', height: '18px' }}
                />
                <span style={{ fontWeight: '500' }}>Make profile public</span>
              </label>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'transparent',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditProfileModal;