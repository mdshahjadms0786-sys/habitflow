import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import StepIndicator from '../components/Onboarding/StepIndicator';
import { saveProfile } from '../utils/profileUtils';
import { loadHabits, saveHabits } from '../utils/db';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { getMaxHabits } from '../utils/planUtils';

const GOALS = [
  { id: 'fitness', name: 'Get Fit & Healthy', icon: '💪', color: '#10b981' },
  { id: 'learning', name: 'Learn & Grow', icon: '📚', color: '#3b82f6' },
  { id: 'productivity', name: 'Be More Productive', icon: '💼', color: '#8b5cf6' },
  { id: 'wellbeing', name: 'Improve Wellbeing', icon: '😊', color: '#f59e0b' },
  { id: 'finances', name: 'Build Better Finances', icon: '💰', color: '#22c55e' },
  { id: 'habits', name: 'Build Good Habits', icon: '🌟', color: '#ec4899' }
];

const HABIT_COUNTS = [
  { value: 3, label: 'Start Small', icon: '🌱', recommended: true, desc: 'Best for beginners' },
  { value: 5, label: 'Moderate', icon: '⚡', recommended: false, desc: 'For experienced users' },
  { value: 10, label: 'Go All In', icon: '🔥', recommended: false, desc: 'Challenge yourself' }
];

const TIME_OPTIONS = [
  { value: '06:00', label: '6 AM' },
  { value: '08:00', label: '8 AM' },
  { value: '12:00', label: '12 PM' },
  { value: '18:00', label: '6 PM' },
  { value: '21:00', label: '9 PM' }
];

const SUGGESTED_HABITS = {
  fitness: [
    { name: 'Morning Stretch', category: 'Health', difficulty: 'easy', icon: '🧘' },
    { name: '30 min Exercise', category: 'Fitness', difficulty: 'medium', icon: '🏃' },
    { name: 'No Sugar', category: 'Health', difficulty: 'hard', icon: '🚫' }
  ],
  learning: [
    { name: 'Read 30 minutes', category: 'Learning', difficulty: 'easy', icon: '📖' },
    { name: 'Practice Instrument', category: 'Personal', difficulty: 'medium', icon: '🎸' },
    { name: 'Learn New Skill', category: 'Learning', difficulty: 'hard', icon: '🧠' }
  ],
  productivity: [
    { name: 'Deep Work 2hrs', category: 'Work', difficulty: 'hard', icon: '🎯' },
    { name: 'Clear Inbox', category: 'Work', difficulty: 'medium', icon: '📧' },
    { name: 'Plan Tomorrow', category: 'Work', difficulty: 'easy', icon: '📝' }
  ],
  wellbeing: [
    { name: 'Meditate 10 min', category: 'Health', difficulty: 'easy', icon: '🧘' },
    { name: 'Gratitude Journal', category: 'Personal', difficulty: 'easy', icon: '🙏' },
    { name: 'No Screens Before Bed', category: 'Health', difficulty: 'hard', icon: '📵' }
  ],
  finances: [
    { name: 'Track Expenses', category: 'Personal', difficulty: 'medium', icon: '💳' },
    { name: 'Save 10% Income', category: 'Personal', difficulty: 'hard', icon: '🏦' },
    { name: 'Review Budget', category: 'Personal', difficulty: 'medium', icon: '📊' }
  ],
  habits: [
    { name: 'Drink 8 glasses water', category: 'Health', difficulty: 'easy', icon: '💧' },
    { name: 'No Social Media', category: 'Personal', difficulty: 'hard', icon: '🚫' },
    { name: 'Consistent Sleep Time', category: 'Health', difficulty: 'medium', icon: '😴' }
  ]
};

const matchGoalToHabits = (userInput) => {
  const input = userInput.toLowerCase();
  
  const GOAL_KEYWORDS = {
    sleep: {
      goals: ['wellbeing'],
      habits: [
        { name: 'Sleep by 10 PM', icon: '😴', category: 'Health', difficulty: 'hard' },
        { name: 'No screen before bed', icon: '📴', category: 'Health', difficulty: 'medium' },
        { name: 'Read before sleep', icon: '📖', category: 'Personal', difficulty: 'easy' },
        { name: 'Wake same time daily', icon: '⏰', category: 'Health', difficulty: 'hard' },
        { name: 'Evening meditation', icon: '🧘', category: 'Personal', difficulty: 'easy' }
      ]
    },
    weight: {
      goals: ['fitness'],
      habits: [
        { name: '30 min workout', icon: '🏋️', category: 'Fitness', difficulty: 'hard' },
        { name: 'No junk food', icon: '🥦', category: 'Health', difficulty: 'hard' },
        { name: 'Drink 3L water', icon: '💧', category: 'Health', difficulty: 'easy' },
        { name: '10,000 steps', icon: '🚶', category: 'Fitness', difficulty: 'medium' },
        { name: 'Track calories', icon: '📱', category: 'Health', difficulty: 'medium' }
      ]
    },
    stress: {
      goals: ['wellbeing'],
      habits: [
        { name: 'Morning meditation', icon: '🧘', category: 'Health', difficulty: 'easy' },
        { name: 'Deep breathing', icon: '💨', category: 'Health', difficulty: 'easy' },
        { name: 'Evening walk', icon: '🌙', category: 'Health', difficulty: 'easy' },
        { name: 'Gratitude journal', icon: '🙏', category: 'Personal', difficulty: 'easy' },
        { name: 'Digital detox 1hr', icon: '📴', category: 'Personal', difficulty: 'medium' }
      ]
    },
    focus: {
      goals: ['productivity'],
      habits: [
        { name: '2hr deep work', icon: '💻', category: 'Work', difficulty: 'hard' },
        { name: 'No social media before noon', icon: '📵', category: 'Personal', difficulty: 'hard' },
        { name: 'Morning meditation', icon: '🧘', category: 'Health', difficulty: 'easy' },
        { name: 'Plan tomorrow tonight', icon: '📅', category: 'Work', difficulty: 'easy' },
        { name: 'Complete MIT first', icon: '🎯', category: 'Work', difficulty: 'medium' }
      ]
    },
    money: {
      goals: ['finances'],
      habits: [
        { name: 'Track expenses', icon: '📊', category: 'Personal', difficulty: 'easy' },
        { name: 'No impulse buying', icon: '🛒', category: 'Personal', difficulty: 'hard' },
        { name: 'Save 20% income', icon: '🏦', category: 'Personal', difficulty: 'hard' },
        { name: 'Read finance book', icon: '📚', category: 'Learning', difficulty: 'easy' },
        { name: 'Invest daily', icon: '📈', category: 'Personal', difficulty: 'medium' }
      ]
    },
    read: {
      goals: ['learning'],
      habits: [
        { name: 'Read 30 pages', icon: '📖', category: 'Learning', difficulty: 'medium' },
        { name: 'Read before sleep', icon: '📚', category: 'Personal', difficulty: 'easy' },
        { name: 'Review notes', icon: '📋', category: 'Learning', difficulty: 'easy' },
        { name: 'Practice one skill', icon: '🎯', category: 'Learning', difficulty: 'medium' },
        { name: 'Morning journaling', icon: '📝', category: 'Personal', difficulty: 'easy' }
      ]
    },
    fitness: {
      goals: ['fitness'],
      habits: [
        { name: 'Morning run', icon: '🏃', category: 'Fitness', difficulty: 'hard' },
        { name: '30 min workout', icon: '🏋️', category: 'Fitness', difficulty: 'hard' },
        { name: 'Post-workout stretch', icon: '🤸', category: 'Fitness', difficulty: 'easy' },
        { name: '10,000 steps', icon: '🚶', category: 'Fitness', difficulty: 'medium' },
        { name: 'Cold shower', icon: '🚿', category: 'Health', difficulty: 'hard' }
      ]
    },
    morning: {
      goals: ['habits'],
      habits: [
        { name: 'Wake up at 6 AM', icon: '⏰', category: 'Personal', difficulty: 'medium' },
        { name: 'Morning meditation', icon: '🧘', category: 'Health', difficulty: 'easy' },
        { name: 'Cold shower', icon: '🚿', category: 'Health', difficulty: 'hard' },
        { name: 'Healthy breakfast', icon: '🥗', category: 'Health', difficulty: 'easy' },
        { name: 'Morning journaling', icon: '📝', category: 'Personal', difficulty: 'easy' }
      ]
    },
    code: {
      goals: ['learning', 'productivity'],
      habits: [
        { name: 'Code for 1 hour', icon: '⌨️', category: 'Work', difficulty: 'medium' },
        { name: 'Solve DSA problem', icon: '🧩', category: 'Learning', difficulty: 'hard' },
        { name: 'GitHub contribution', icon: '🐙', category: 'Work', difficulty: 'medium' },
        { name: 'Read tech blog', icon: '📰', category: 'Learning', difficulty: 'easy' },
        { name: 'Learn new tech', icon: '🔧', category: 'Learning', difficulty: 'medium' }
      ]
    },
    happy: {
      goals: ['wellbeing'],
      habits: [
        { name: 'Gratitude journal', icon: '🙏', category: 'Personal', difficulty: 'easy' },
        { name: 'Call family', icon: '📞', category: 'Personal', difficulty: 'easy' },
        { name: 'Evening walk', icon: '🌙', category: 'Health', difficulty: 'easy' },
        { name: 'Morning meditation', icon: '🧘', category: 'Health', difficulty: 'easy' },
        { name: 'Help someone today', icon: '🤲', category: 'Personal', difficulty: 'easy' }
      ]
    }
  };

  let matchedHabits = [];
  let matchedGoals = [];
  
  for (const [keyword, data] of Object.entries(GOAL_KEYWORDS)) {
    if (input.includes(keyword)) {
      matchedHabits = [...matchedHabits, ...data.habits];
      matchedGoals = [...matchedGoals, ...data.goals];
    }
  }

  if (matchedHabits.length === 0) {
    const words = input.split(' ').filter(w => w.length > 3);
    for (const word of words) {
      for (const [keyword, data] of Object.entries(GOAL_KEYWORDS)) {
        if (keyword.includes(word) || word.includes(keyword)) {
          matchedHabits = [...matchedHabits, ...data.habits];
          matchedGoals = [...matchedGoals, ...data.goals];
        }
      }
    }
  }

  const uniqueHabits = matchedHabits.filter((h, i, arr) => 
    arr.findIndex(h2 => h2.name === h.name) === i
  ).slice(0, 5);
  
  const uniqueGoals = [...new Set(matchedGoals)];

  return { habits: uniqueHabits, goals: uniqueGoals };
};

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    goals: [],
    habitCount: 3,
    reminderTime: '',
    reminderEnabled: false,
    aiHabits: []
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ habits: [], goals: [] });
  const [selectedAiHabits, setSelectedAiHabits] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const totalSteps = 5;
  
  useEffect(() => {
    const completed = localStorage.getItem('ht_onboarding_complete');
    if (completed) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults({ habits: [], goals: [] });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const results = matchGoalToHabits(searchQuery);
      setSearchResults(results);
      setIsSearching(false);

      if (results.goals.length > 0) {
        const newGoals = [...new Set([...formData.goals, ...results.goals])];
        setFormData(prev => ({ ...prev, goals: newGoals }));
        toast.success(`Added ${results.goals.length} goal(s) from your search!`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAiHabitToggle = (habit) => {
    setSelectedAiHabits(prev => {
      const exists = prev.find(h => h.name === habit.name);
      if (exists) {
        return prev.filter(h => h.name !== habit.name);
      }
      return [...prev, habit];
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults({ habits: [], goals: [] });
    setSelectedAiHabits([]);
  };
  
  const handleNameSubmit = () => {
    if (formData.name.trim()) {
      setStep(2);
    }
  };
  
  const toggleGoal = (goalId) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };
  
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleComplete = (addSuggested = true) => {
    localStorage.setItem('ht_onboarding_complete', 'true');
    localStorage.setItem('ht_onboarding', JSON.stringify(formData));
    
    const profile = {
      name: formData.name,
      username: formData.name.toLowerCase().replace(/\s+/g, '_'),
      joinDate: new Date().toISOString(),
      goals: formData.goals,
      avatarEmoji: '👤'
    };
    saveProfile(profile);
    
    const existingHabits = loadHabits();
    const newHabits = [];
    const maxAllowed = getMaxHabits();
    
    if (selectedAiHabits.length > 0) {
      for (const habit of selectedAiHabits) {
        if (existingHabits.length + newHabits.length >= maxAllowed) break;
        if (!newHabits.find(h => h.name === habit.name) && !existingHabits.find(h => h.name === habit.name)) {
          newHabits.push({
            id: uuidv4(),
            name: habit.name,
            category: habit.category,
            difficulty: habit.difficulty,
            icon: habit.icon,
            createdAt: new Date().toISOString(),
            completionLog: {},
            currentStreak: 0,
            longestStreak: 0
          });
        }
      }
    }
    
    if (addSuggested && formData.goals.length > 0) {
      const remainingCapacity = maxAllowed - existingHabits.length - newHabits.length;
      const habitsToCreate = Math.min(formData.habitCount - newHabits.length, formData.goals.length * 2, remainingCapacity);
      
      if (habitsToCreate > 0) {
        let created = 0;
        for (const goalId of formData.goals) {
          if (created >= habitsToCreate) break;
          const suggestions = SUGGESTED_HABITS[goalId] || [];
          for (const suggestion of suggestions) {
            if (created >= habitsToCreate) break;
            if (!newHabits.find(h => h.name === suggestion.name) && !existingHabits.find(h => h.name === suggestion.name)) {
              newHabits.push({
                id: uuidv4(),
                name: suggestion.name,
                category: suggestion.category,
                difficulty: suggestion.difficulty,
                icon: suggestion.icon,
                createdAt: new Date().toISOString(),
                completionLog: {},
                currentStreak: 0,
                longestStreak: 0
              });
              created++;
            }
          }
        }
      }
    }
    
    if (newHabits.length > 0) {
      saveHabits([...existingHabits, ...newHabits]);
      toast.success(`🎉 Created ${newHabits.length} habits!`);
    }
    
    navigate('/');
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}
          >
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎯</div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>
              Welcome to HabitFlow! 🌟
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '16px' }}>
              Let's set up your habit journey in 2 minutes
            </p>
            
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '500',
                  textAlign: 'left'
                }}
              >
                What should we call you?
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text)',
                  fontSize: '16px'
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNameSubmit}
              disabled={!formData.name.trim()}
              style={{
                padding: '14px 32px',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: formData.name.trim() ? 'var(--primary)' : 'var(--border)',
                color: formData.name.trim() ? '#fff' : 'var(--text-secondary)',
                cursor: formData.name.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Get Started →
            </motion.button>
          </motion.div>
        );
        
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ maxWidth: '600px', margin: '0 auto' }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: '700', textAlign: 'center', marginBottom: '8px' }}>
              What's your main focus?
            </h2>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '24px' }}>
              Select all that apply
            </p>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Or describe your goal... e.g. 'I want to sleep better'"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    paddingRight: searchQuery ? '40px' : '16px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text)',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '18px'
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
              {isSearching && (
                <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  🔍 Searching...
                </p>
              )}
            </div>

            {searchResults.habits.length > 0 && (
              <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'var(--primary-light)', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                  🤖 AI Suggested Habits
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {searchResults.habits.map((habit, idx) => {
                    const isSelected = selectedAiHabits.find(h => h.name === habit.name);
                    return (
                      <label
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 12px',
                          backgroundColor: 'var(--surface)',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={!!isSelected}
                          onChange={() => handleAiHabitToggle(habit)}
                          style={{ width: '18px', height: '18px' }}
                        />
                        <span style={{ fontSize: '20px' }}>{habit.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: '500' }}>{habit.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {habit.category} • {habit.difficulty}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {selectedAiHabits.length > 0 && (
                  <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--primary)', fontWeight: '500' }}>
                    ✓ {selectedAiHabits.length} habit(s) selected - they'll be added automatically
                  </p>
                )}
              </div>
            )}

            {!isSearching && searchQuery.length >= 2 && searchResults.habits.length === 0 && (
              <p style={{ marginBottom: '24px', fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                No matches — try different keywords like "sleep", "fitness", "stress", "focus"
              </p>
            )}
            
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px'
              }}
            >
              {GOALS.map((goal) => (
                <motion.button
                  key={goal.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleGoal(goal.id)}
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    border: formData.goals.includes(goal.id)
                      ? `2px solid ${goal.color}`
                      : '2px solid var(--border)',
                    backgroundColor: formData.goals.includes(goal.id)
                      ? `${goal.color}15`
                      : 'var(--surface)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{goal.icon}</div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{goal.name}</div>
                </motion.button>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '32px' }}>
              <button
                onClick={handleBack}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'transparent',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                disabled={formData.goals.length === 0}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: formData.goals.length > 0 ? 'var(--primary)' : 'var(--border)',
                  color: '#fff',
                  cursor: formData.goals.length > 0 ? 'pointer' : 'not-allowed',
                  fontSize: '14px'
                }}
              >
                Next →
              </button>
            </div>
          </motion.div>
        );
        
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ maxWidth: '600px', margin: '0 auto' }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: '700', textAlign: 'center', marginBottom: '8px' }}>
              How many habits to start with?
            </h2>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '32px' }}>
              {HABIT_COUNTS.filter(option => option.value <= getMaxHabits()).map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, habitCount: option.value })}
                  style={{
                    padding: '24px 20px',
                    borderRadius: '16px',
                    border: formData.habitCount === option.value
                      ? '2px solid var(--primary)'
                      : '2px solid var(--border)',
                    backgroundColor: formData.habitCount === option.value
                      ? 'var(--primary-light)'
                      : 'var(--surface)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    flex: 1,
                    maxWidth: '180px'
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{option.icon}</div>
                  <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>
                    {option.label}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {option.value} habits
                  </div>
                  {option.recommended && (
                    <div
                      style={{
                        marginTop: '8px',
                        padding: '4px 12px',
                        backgroundColor: 'var(--primary)',
                        color: '#fff',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      Recommended
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
            
            <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              💡 Research shows starting with 3 habits has 80% success rate
            </p>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '32px' }}>
              <button
                onClick={handleBack}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'transparent',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Next →
              </button>
            </div>
          </motion.div>
        );
        
      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ maxWidth: '600px', margin: '0 auto' }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: '700', textAlign: 'center', marginBottom: '8px' }}>
              When do you want your daily reminder?
            </h2>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '32px' }}>
              Get a gentle nudge to stay on track
            </p>
            
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxWidth: '300px',
                margin: '0 auto'
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  borderRadius: '12px',
                  border: formData.reminderEnabled === false ? '2px solid var(--primary)' : '2px solid var(--border)',
                  backgroundColor: formData.reminderEnabled === false ? 'var(--primary-light)' : 'var(--surface)',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="reminder"
                  checked={!formData.reminderEnabled}
                  onChange={() => setFormData({ ...formData, reminderEnabled: false, reminderTime: '' })}
                  style={{ width: '20px', height: '20px' }}
                />
                <span>No reminder</span>
              </label>
              
              {TIME_OPTIONS.map((time) => (
                <label
                  key={time.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    borderRadius: '12px',
                    border: formData.reminderTime === time.value ? '2px solid var(--primary)' : '2px solid var(--border)',
                    backgroundColor: formData.reminderTime === time.value ? 'var(--primary-light)' : 'var(--surface)',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="reminder"
                    checked={formData.reminderTime === time.value}
                    onChange={() => setFormData({ ...formData, reminderTime: time.value, reminderEnabled: true })}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <span>{time.label}</span>
                </label>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '32px' }}>
              <button
                onClick={handleBack}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'transparent',
                  color: 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ← Back
              </button>
              <button
                onClick={() => {
                  setShowConfetti(true);
                  setStep(5);
                }}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Next →
              </button>
            </div>
          </motion.div>
        );
        
      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}
          >
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>
              You're all set!
            </h2>
            
            <div style={{ marginBottom: '24px' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Your selected goals:
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {formData.goals.map(goalId => {
                  const goal = GOALS.find(g => g.id === goalId);
                  return (
                    <span
                      key={goalId}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        backgroundColor: `${goal.color}20`,
                        color: goal.color,
                        fontSize: '14px'
                      }}
                    >
                      {goal.icon} {goal.name}
                    </span>
                  );
                })}
              </div>
            </div>
            
            <div style={{ marginBottom: '32px' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Suggested habits for you:
              </p>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  alignItems: 'center'
                }}
              >
                {formData.goals.slice(0, 2).map(goalId => {
                  const suggestions = SUGGESTED_HABITS[goalId] || [];
                  return suggestions.slice(0, 2).map((habit, idx) => (
                    <div
                      key={`${goalId}-${idx}`}
                      style={{
                        padding: '12px 20px',
                        backgroundColor: 'var(--surface)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <span>{habit.icon}</span>
                      <span style={{ fontWeight: '500' }}>{habit.name}</span>
                    </div>
                  ));
                })}
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleComplete(true)}
                style={{
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                Add These Habits
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleComplete(false)}
                style={{
                  padding: '14px 32px',
                  fontSize: '14px',
                  fontWeight: '500',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'transparent',
                  color: 'var(--text)',
                  cursor: 'pointer'
                }}
              >
                Start Fresh
              </motion.button>
            </div>
          </motion.div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        padding: '40px 20px'
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {step < 5 && <StepIndicator currentStep={step} totalSteps={totalSteps} />}
        
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingPage;