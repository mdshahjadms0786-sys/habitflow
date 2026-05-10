import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MonthlyChallengeCard from '../components/Challenge/MonthlyChallengeCard';
import ChallengeHallOfFame from '../components/Challenge/ChallengeHallOfFame';
import { getCurrentChallenge, calculateChallengeProgress, isChallengeCompleted, markChallengeCompleted } from '../utils/challengeUtils';
import { useHabits } from '../hooks/useHabits';
import toast from 'react-hot-toast';

const ChallengePage = () => {
  const navigate = useNavigate();
  const { habits } = useHabits();
  const [challenge, setChallenge] = useState(null);
  const [progress, setProgress] = useState({ current: 0, target: 0, percentage: 0 });

  useEffect(() => {
    const currentChallenge = getCurrentChallenge();
    setChallenge(currentChallenge);
    
    if (currentChallenge) {
      const prog = calculateChallengeProgress(currentChallenge, habits);
      setProgress(prog);
      
      // Check if completed and not already marked
      if (prog.percentage >= 100 && !isChallengeCompleted(currentChallenge)) {
        markChallengeCompleted(currentChallenge);
        toast.success(`🎉 Monthly Challenge Complete! +${currentChallenge.reward} pts!`);
      }
    }
  }, [habits]);

  const getChallengeTips = () => {
    if (!challenge) return [];
    
    switch (challenge.type) {
      case 'total_completions':
        return [
          'Complete at least 1 habit every day',
          'Add multiple habits to track',
          'Keep your streaks going! 🎯'
        ];
      case 'streak':
        return [
          'Don\'t break your chain! ⛓️',
          'Pick one habit and focus on it',
          'Even small Completions count! ✅'
        ];
      case 'active_days':
        return [
          'Aim for at least 1 completion daily',
          'Different habits count as new days',
          'Quality over quantity 🎯'
        ];
      case 'completion_rate':
        return [
          'Complete ALL habits daily',
          'Keep your streak alive',
          'Don\'t miss a day! 💪'
        ];
      case 'category_completions':
        return [
          `Focus on ${challenge.category} habits`,
          'Add habits from that category',
          `Master ${challenge.category}! 🏆`
        ];
      case 'perfect_days':
        return [
          'Complete ALL active habits daily',
          'Keep list short and focused',
          'Perfection takes practice! 🎯'
        ];
      case 'categories_used':
        return [
          'Use diverse habit categories',
          'Mix it up! 🏃📚🧘',
          'Explore different areas! 🌟'
        ];
      default:
        return ['Stay consistent! 💪'];
    }
  };

  return (
    <div className="page-container" style={{ padding: '24px', paddingBottom: '80px', maxWidth: '600px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: 'var(--text)' }}>
          Monthly Challenge 🏆
        </h1>
        <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Complete monthly goals to earn points and badges!
        </p>
      </motion.div>

      {challenge && (
        <MonthlyChallengeCard habits={habits} />
      )}

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: 'var(--surface)',
          borderRadius: '12px',
          padding: '16px',
          marginTop: '20px',
          border: '1px solid var(--border)',
        }}
      >
        <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
          💡 How to Complete
        </h3>
        <ul style={{ margin: 0, padding: '0 0 0 20px' }}>
          {getChallengeTips().map((tip, idx) => (
            <li key={idx} style={{ marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              {tip}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Hall of Fame */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ marginTop: '24px' }}
      >
        <ChallengeHallOfFame />
      </motion.div>
    </div>
  );
};

export default ChallengePage;