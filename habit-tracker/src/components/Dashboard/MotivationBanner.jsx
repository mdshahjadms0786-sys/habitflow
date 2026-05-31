import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useOllama from '../../hooks/useOllama';

const fallbackQuotes = [
  "Small habits, big changes. Keep going! 🌟",
  "You're building a better version of yourself. 💪",
  "Every day is a fresh start. Make it count! ✨",
  "Progress, not perfection. You've got this! 🎯",
  "The secret of getting ahead is getting started. 🚀",
  "Your future self is watching. Make them proud! 👏",
  "One day at a time, one habit at a time. 🌱",
  "Believe in yourself and your abilities! 💫",
  "Consistency is the key to transformation. 🔑",
  "Today's effort is tomorrow's success. 🏆",
];

export const MotivationBanner = ({ stats, show = true }) => {
  const [message, setMessage] = useState('');
  const { fetchMotivation } = useOllama('llama3');

  useEffect(() => {
    if (!show) return;

    const getMotivation = async () => {
      const aiMessage = await fetchMotivation({
        completedToday: stats?.completedToday || 0,
        totalHabits: stats?.totalHabits || 1,
        bestStreak: stats?.bestStreak || 0,
      });

      if (aiMessage) {
        setMessage(aiMessage);
      } else {
        const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
        setMessage(fallbackQuotes[randomIndex]);
      }
    };

    getMotivation();
  }, [stats?.completedToday, stats?.totalHabits, stats?.bestStreak, show, fetchMotivation]);

  if (!show || !message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: '12px',
        padding: '20px 24px',
        marginBottom: '24px',
        color: '#ffffff',
        textAlign: 'center',
      }}
    >
      <motion.p
        key={message}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          margin: 0,
          fontSize: '16px',
          fontWeight: '500',
          lineHeight: '1.5',
        }}
      >
        {message}
      </motion.p>
    </motion.div>
  );
};

export default MotivationBanner;
