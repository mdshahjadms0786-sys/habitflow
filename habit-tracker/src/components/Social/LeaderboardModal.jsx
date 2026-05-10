import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getConsistencyStats } from '../../utils/streakUtils';
import { getUserProfile, generateShareableLink } from '../../utils/referralUtils';
import { addPoints, loadPoints, getCurrentLevel } from '../../utils/pointsUtils';
import toast from 'react-hot-toast';

const LEADERBOARD_KEY = 'ht_friends_leaderboard';

const MOCK_FRIENDS = [
  { id: 'demo1', name: 'Alex', streak: 45, emoji: '🎯' },
  { id: 'demo2', name: 'Sam', streak: 32, emoji: '💪' },
  { id: 'demo3', name: 'Jordan', streak: 28, emoji: '🔥' },
  { id: 'demo4', name: 'Riya', streak: 21, emoji: '⭐' },
];

const getLeaderboard = () => {
  try {
    return JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];
  } catch {
    return [];
  }
};

const saveLeaderboard = (data) => {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(data));
};

const LeaderboardModal = ({ isOpen, onClose, currentStreak = 0 }) => {
  const [addingFriend, setAddingFriend] = useState(false);
  const [friendCode, setFriendCode] = useState('');
  const [sharing, setSharing] = useState(false);

  const currentStats = useMemo(() => ({
    streak: currentStreak,
    rank: 0,
  }), [currentStreak]);

  const shareData = useMemo(() => {
    const friends = getLeaderboard();
    const allEntries = [
      { id: 'you', name: 'You', streak: currentStreak, emoji: '👤', isCurrentUser: true },
      ...MOCK_FRIENDS,
      ...(friends || []).map(f => ({ ...f, isCurrentUser: false })),
    ].sort((a, b) => b.streak - a.streak);

    const userRank = allEntries.findIndex(e => e.isCurrentUser) + 1;
    
    return {
      allEntries: allEntries || [],
      userRank: userRank || 0,
      friends: friends?.slice(0, 10) || [],
    };
  }, [currentStreak]);

  const handleAddFriend = () => {
    if (!friendCode || friendCode.length < 4) {
      toast.error('Enter a valid friend code');
      return;
    }

    const friends = getLeaderboard();
    const existing = friends.find(f => f.code === friendCode.toUpperCase());
    if (existing) {
      toast.error('Friend already added!');
      return;
    }

    friends.push({
      id: Date.now().toString(),
      name: friendCode.substring(0, 6).toUpperCase(),
      code: friendCode.toUpperCase(),
      streak: Math.floor(Math.random() * 30) + 1,
      emoji: '🤝',
      addedAt: new Date().toISOString(),
    });
    
    saveLeaderboard(friends);
    setFriendCode('');
    setAddingFriend(false);
    toast.success('Friend added!');
  };

  const handleShare = () => {
    const data = generateShareableLink();
    setSharing(true);
    
    if (navigator.share) {
      navigator.share({
        title: 'Join Daily Habit Tracker',
        text: `Use my referral code: ${data.code} to join and get ${data.reward} free points! 🔥`,
        url: data.link,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${data.code}`);
      toast.success(`Code copied: ${data.code}`);
    }
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
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '400px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: 'var(--text)' }}>
              🏆 Leaderboard
            </h2>
            <button 
              onClick={onClose} 
              style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          {shareData && shareData.userRank <= 3 && currentStreak > 0 && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              style={{
                backgroundColor: '#fbbf2410',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px',
                border: '2px solid #fbbf24',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: '32px' }}>🥇</span>
              <p style={{ margin: '8px 0 0 0', fontSize: '14px', fontWeight: '600', color: '#fbbf24' }}>
                You're in Top 3!
              </p>
            </motion.div>
          )}

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '8px',
            marginBottom: '20px',
          }}>
            {shareData.allEntries.slice(0, 8).map((entry, index) => {
              const isUser = entry.isCurrentUser;
              const position = index + 1;
              
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: isUser ? '#3b82f610' : 'var(--bg)',
                    borderRadius: '8px',
                    border: isUser ? '2px solid #3b82f6' : '1px solid var(--border)',
                  }}
                >
                  <span style={{ 
                    width: '24px', 
                    fontSize: '16px',
                    fontWeight: '700',
                    color: position === 1 ? '#fbbf24' : position === 2 ? '#94a3b8' : position === 3 ? '#cd7f32' : 'var(--text-secondary)',
                  }}>
                    {position}
                  </span>
                  <span style={{ fontSize: '20px' }}>{entry.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: 'var(--text)' }}>
                      {entry.name}
                    </p>
                    {isUser && (
                      <p style={{ margin: 0, fontSize: '11px', color: '#3b82f6' }}>You</p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: isUser ? '#3b82f6' : 'var(--text)' }}>
                      {entry.streak}
                    </p>
                    <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-secondary)' }}>days</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {!addingFriend ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAddingFriend(true)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text)',
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '12px',
              }}
            >
              ➕ Add Friend by Code
            </motion.button>
          ) : (
            <div style={{ marginBottom: '12px' }}>
              <input
                type="text"
                value={friendCode}
                onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
                placeholder="Enter friend code"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '13px',
                  backgroundColor: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  marginBottom: '8px',
                }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddFriend}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#fff',
                    backgroundColor: '#22c55e',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Add
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setAddingFriend(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'var(--text)',
                    backgroundColor: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShare}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#fff',
              backgroundColor: '#8b5cf6',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            🔗 Share My Code
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LeaderboardModal;