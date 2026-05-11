import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePlanContext } from '../context/PlanContext';
import toast from 'react-hot-toast';

const QUESTIONS = [
  {
    id: 1,
    question: 'What is your primary goal?',
    options: [
      { label: 'Get Fit & Healthy', icon: '💪' },
      { label: 'Boost Productivity', icon: '⚡' },
      { label: 'Master Mindfulness', icon: '🧘' },
      { label: 'Advance Career', icon: '🚀' },
      { label: 'Improve Relationships', icon: '❤️' },
      { label: 'Build Wealth', icon: '💰' },
    ],
  },
  {
    id: 2,
    question: 'How would you describe your current discipline level?',
    options: [
      { label: 'Just Starting', icon: '🌱' },
      { label: 'Somewhat Consistent', icon: '📈' },
      { label: 'Pretty Disciplined', icon: '💎' },
      { label: 'Highly Disciplied', icon: '🔥' },
    ],
  },
  {
    id: 3,
    question: 'How many hours per week can you commit to habits?',
    options: [
      { label: '1-3 hours', icon: '⏰' },
      { label: '3-7 hours', icon: '⏰⏰' },
      { label: '7-14 hours', icon: '⏰⏰⏰' },
      { label: '14+ hours', icon: '⏰⏰⏰⏰' },
    ],
  },
  {
    id: 4,
    question: 'What time of day do you feel most energetic?',
    options: [
      { label: 'Early Morning (5-8 AM)', icon: '🌅' },
      { label: 'Late Morning (8-12 PM)', icon: '☀️' },
      { label: 'Afternoon (12-5 PM)', icon: '🌤️' },
      { label: 'Evening (5-10 PM)', icon: '🌙' },
    ],
  },
  {
    id: 5,
    question: 'What is your biggest challenge with habits?',
    options: [
      { label: 'Starting', icon: '🚦' },
      { label: 'Staying Consistent', icon: '🔄' },
      { label: 'Motivation', icon: '💪' },
      { label: 'Time Management', icon: '⏱️' },
    ],
  },
  {
    id: 6,
    question: 'How do you prefer to receive guidance?',
    options: [
      { label: 'Daily Reminders', icon: '🔔' },
      { label: 'Weekly Check-ins', icon: '📅' },
      { label: 'Real-time Support', icon: '💬' },
      { label: 'Self-directed', icon: '🎯' },
    ],
  },
  {
    id: 7,
    question: 'What type of accountability do you prefer?',
    options: [
      { label: 'Private (self-accountable)', icon: '🔒' },
      { label: 'Peer Support', icon: '👥' },
      { label: 'Competition', icon: '🏆' },
      { label: 'Rewards System', icon: '🎁' },
    ],
  },
  {
    id: 8,
    question: 'What is your sleep schedule?',
    options: [
      { label: 'Early Bird (9 PM - 5 AM)', icon: '🐔' },
      { label: 'Normal (10 PM - 6 AM)', icon: '😴' },
      { label: 'Night Owl (11 PM - 7 AM)', icon: '🦉' },
      { label: 'Irregular', icon: '🌀' },
    ],
  },
  {
    id: 9,
    question: 'What motivates you the most?',
    options: [
      { label: 'Long-term Goals', icon: '🏔️' },
      { label: 'Immediate Rewards', icon: '🎯' },
      { label: 'Social Recognition', icon: '👏' },
      { label: 'Self-Improvement', icon: '📈' },
    ],
  },
  {
    id: 10,
    question: 'What should AI call you?',
    options: [
      { label: 'Coach', icon: '🎓' },
      { label: 'Guide', icon: '🧭' },
      { label: 'Partner', icon: '🤝' },
      { label: 'Mentor', icon: '📚' },
    ],
  },
];

function WhiteGloveOnboardingPage() {
  const planCtx = usePlanContext();
  const hasFeature = planCtx.hasFeature;
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [plan, setPlan] = useState(null);

  if (!hasFeature('whiteGloveOnboarding')) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <h2>🚫 Elite Feature</h2>
        <p>This feature is available for Elite users only.</p>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  const selectOption = (option) => {
    setAnswers({ ...answers, [currentStep]: option });
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generatePlan();
    }
  };

  const generatePlan = () => {
    const goalAnswer = answers[0] || 'Get Fit & Healthy';
    const disciplineLevel = answers[1] || 'Somewhat Consistent';
    const timeCommitment = answers[2] || '3-7 hours';
    const peakEnergy = answers[3] || 'Morning';
    
    const totalHours = timeCommitment.includes('1-3') ? 1 :
                       timeCommitment.includes('3-7') ? 5 :
                       timeCommitment.includes('7-14') ? 10 : 15;
    
    const habitCount = Math.min(10, Math.max(3, Math.floor(totalHours / 1.5)));

    const suggestedHabits = [];
    
    if (goalAnswer.includes('Fit')) {
      suggestedHabits.push({ name: 'Morning Exercise', difficulty: 'hard', time: peakEnergy === 'Evening' ? 'afternoon' : 'morning' });
      suggestedHabits.push({ name: 'Healthy Meal Prep', difficulty: 'medium', time: 'evening' });
      suggestedHabits.push({ name: '8 Hour Sleep', difficulty: 'medium', time: 'night' });
    } else if (goalAnswer.includes('Productivity')) {
      suggestedHabits.push({ name: 'Morning Planning', difficulty: 'easy', time: 'morning' });
      suggestedHabits.push({ name: 'Deep Work 2hr', difficulty: 'hard', time: 'morning' });
      suggestedHabits.push({ name: 'Review & Reflect', difficulty: 'medium', time: 'evening' });
    } else if (goalAnswer.includes('Mindfulness')) {
      suggestedHabits.push({ name: 'Meditation 10min', difficulty: 'easy', time: 'morning' });
      suggestedHabits.push({ name: 'Breathing Exercises', difficulty: 'easy', time: 'afternoon' });
      suggestedHabits.push({ name: 'Gratitude Journal', difficulty: 'easy', time: 'evening' });
    }

    if (disciplineLevel.includes('Just') || disciplineLevel.includes('Somewhat')) {
      suggestedHabits.push({ name: 'Track Progress Daily', difficulty: 'easy', time: 'evening' });
    }

    const generatedPlan = {
      goal: goalAnswer,
      disciplineLevel,
      totalHabits: habitCount,
      suggestedHabits: suggestedHabits.slice(0, habitCount),
      energyPattern: peakEnergy,
      style: answers[9] || 'Coach',
    };

    setPlan(generatedPlan);
    setIsComplete(true);
  };

  const applyPlan = () => {
    localStorage.setItem('ht_white_glove_complete', 'true');
    localStorage.setItem('ht_habit_plan', JSON.stringify(plan));
    toast.success('🎉 Your personalized HabitFlow is ready!');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '700px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
            White Glove AI Onboarding
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Your special Elite setup - 10 quick questions
          </p>
        </div>

        <div style={{
          marginBottom: '32px',
          height: '4px',
          background: 'var(--border)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <motion.div
            animate={{ width: `${progress}%` }}
            style={{
              height: '100%',
              background: 'linear-gradient(135deg, #BA7517, #f59e0b)',
            }}
          />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {currentStep + 1} of {QUESTIONS.length}
          </span>
        </div>

        {!isComplete ? (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'var(--surface)',
              padding: '40px',
              borderRadius: '24px',
              border: '1px solid var(--border)',
              textAlign: 'center'
            }}
          >
            <h2 style={{ fontSize: '24px', marginBottom: '32px' }}>
              {currentQuestion.question}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '12px'
            }}>
              {currentQuestion.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectOption(option.label)}
                  style={{
                    padding: '20px 16px',
                    background: 'var(--bg)',
                    border: '2px solid var(--border)',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{option.icon}</div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{option.label}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div>
            <div style={{
              background: 'linear-gradient(135deg, #BA7517, #f59e0b)',
              padding: '32px',
              borderRadius: '24px',
              color: 'white',
              textAlign: 'center',
              marginBottom: '32px'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
              <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Your HabitFlow is Ready!</h2>
              <p>AI has created a personalized plan based on your answers</p>
            </div>

            <div style={{
              background: 'var(--surface)',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              marginBottom: '24px'
            }}>
              <h3 style={{ marginBottom: '16px' }}>📋 Your Personalized Plan</h3>
              <div style={{ marginBottom: '16px' }}>
                <strong>Primary Goal:</strong> {plan?.goal}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong>Total Habits:</strong> {plan?.totalHabits}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong>Peak Energy Time:</strong> {plan?.energyPattern}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong>AI Coach Style:</strong> {plan?.style}
              </div>
              
              <h4 style={{ marginTop: '24px', marginBottom: '12px' }}>Suggested Habits:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {plan?.suggestedHabits.map((habit, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px',
                      background: 'var(--bg)',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{habit.name}</span>
                    <span style={{
                      padding: '4px 8px',
                      background: habit.difficulty === 'hard' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {habit.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  setCurrentStep(0);
                  setAnswers({});
                  setIsComplete(false);
                  setPlan(null);
                }}
                style={{
                  padding: '12px 24px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Restart
              </button>
              <button
                onClick={applyPlan}
                style={{
                  padding: '12px 32px',
                  background: 'linear-gradient(135deg, #BA7517, #f59e0b)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Apply Plan →
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default WhiteGloveOnboardingPage;