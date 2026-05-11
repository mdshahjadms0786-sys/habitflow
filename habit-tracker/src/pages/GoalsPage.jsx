import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../hooks/useHabits';
import { hasFeature } from '../utils/planUtils';
import { 
  loadSmartGoals, 
  saveSmartGoals, 
  createSmartGoal, 
  calculateGoalProgress, 
  getGoalInsight,
  getGoalStats,
  getActiveGoals,
  getGoalsByCategory,
  updateGoalStatus
} from '../utils/smartGoalUtils';
import { LIFE_AREAS } from '../utils/lifeAreasUtils';
import { v4 as uuidv4 } from 'uuid';
import PlanBadge from '../components/UI/PlanBadge';
import toast from 'react-hot-toast';

const GoalsPage = () => {
  const { habits } = useHabits();
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  
  const canAccess = hasFeature('goals');
  
  useEffect(() => {
    setGoals(loadSmartGoals());
  }, []);
  
  if (!canAccess) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ marginBottom: '12px' }}>Pro Feature</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Upgrade to Pro to access Goals
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/upgrade')}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: 'var(--primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer'
          }}
        >
          Upgrade to Pro →
        </motion.button>
      </div>
    );
  }
  
  const activeGoals = getActiveGoals();
  const stats = getGoalStats();
  const goalsByCategory = getGoalsByCategory();
  
  const handleCreateGoal = (goalData) => {
    const newGoal = createSmartGoal(goalData);
    const updated = [...goals, newGoal];
    saveSmartGoals(updated);
    setGoals(updated);
    setShowModal(false);
    toast.success('Goal created!');
  };
  
  const handleCompleteGoal = (goalId) => {
    updateGoalStatus(goalId, 'completed');
    setGoals(loadSmartGoals());
    toast.success('Goal completed! 🎉');
  };
  
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'growth',
    icon: '🎯',
    targetDate: '',
    isSmartGoal: false,
    smart: {},
    milestones: [],
    linkedHabitIds: []
  });
  
  const addMilestone = () => {
    setNewGoal(prev => ({
      ...prev,
      milestones: [...prev.milestones, { id: uuidv4(), title: '', targetDate: '', isComplete: false }]
    }));
  };
  
  const updateMilestone = (idx, field, value) => {
    setNewGoal(prev => ({
      ...prev,
      milestones: prev.milestones.map((m, i) => i === idx ? { ...m, [field]: value } : m)
    }));
  };
  
  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', paddingBottom: '100px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}
      >
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: 0 }}>
            Goals 🎯
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Your habits build your dreams
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <PlanBadge />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            style={{
              padding: '12px 20px',
              fontSize: '16px',
              fontWeight: '600',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
          >
            Add Goal +
          </motion.button>
        </div>
      </motion.div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'var(--surface)', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '24px', fontWeight: '700' }}>{stats.active}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Active Goals</div>
        </div>
        <div style={{ backgroundColor: 'var(--surface)', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '24px', fontWeight: '700' }}>{stats.completed}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Completed</div>
        </div>
        <div style={{ backgroundColor: 'var(--surface)', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '24px', fontWeight: '700' }}>{stats.completionRate}%</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Completion Rate</div>
        </div>
        <div style={{ backgroundColor: 'var(--surface)', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '24px', fontWeight: '700' }}>📈</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>This Year</div>
        </div>
      </div>
      
      {activeGoals.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px', 
          backgroundColor: 'var(--surface)', 
          borderRadius: '20px',
          border: '1px solid var(--border)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎯</div>
          <h3 style={{ marginBottom: '12px' }}>No Goals Yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Set your first SMART goal to start achieving your dreams
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            style={{
              padding: '14px 28px',
              fontSize: '16px',
              fontWeight: '600',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
          >
            Create Your First Goal →
          </motion.button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {activeGoals.map(goal => {
            const progress = calculateGoalProgress(goal, habits);
            const insight = getGoalInsight(goal, habits);
            const area = LIFE_AREAS.find(a => a.id === goal.category);
            const today = new Date();
            const targetDate = new Date(goal.targetDate);
            const daysLeft = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '32px' }}>{goal.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '18px', fontWeight: '600' }}>{goal.title}</div>
                    {area && (
                      <span style={{ fontSize: '12px', color: area.color, fontWeight: '500' }}>
                        {area.icon} {area.name}
                      </span>
                    )}
                  </div>
                </div>
                
                {goal.description && (
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    {goal.description}
                  </p>
                )}
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="10" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="none" 
                        stroke={area?.color || 'var(--primary)'} 
                        strokeWidth="10"
                        strokeDasharray={`${progress * 2.51} 251`}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div style={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%)',
                      fontSize: '18px',
                      fontWeight: '700'
                    }}>
                      {progress}%
                    </div>
                  </div>
                </div>
                
                {goal.milestones.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                      Milestones: {goal.milestones.filter(m => m.isComplete).length}/{goal.milestones.length}
                    </div>
                    {goal.milestones.slice(0, 3).map((m, idx) => (
                      <div key={idx} style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span>{m.isComplete ? '✅' : '⭕'}</span>
                        <span style={{ opacity: m.isComplete ? 0.5 : 1 }}>{m.title}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px',
                  backgroundColor: 'var(--bg)',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}>
                  <span style={{ fontSize: '13px', color: daysLeft >= 0 ? 'var(--text-secondary)' : '#ef4444' }}>
                    {daysLeft >= 0 ? `${daysLeft} days left` : `${Math.abs(daysLeft)} days overdue`}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--primary)' }}>💡 {insight}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleCompleteGoal(goal.id)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      fontSize: '14px',
                      fontWeight: '600',
                      backgroundColor: '#22c55e',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Complete
                  </button>
                  <button
                    style={{
                      padding: '10px 16px',
                      fontSize: '14px',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>Create New Goal</h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Goal Title</label>
              <input
                type="text"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                placeholder="e.g., Run a marathon"
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)' }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Life Area</label>
              <select
                value={newGoal.category}
                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)' }}
              >
                {LIFE_AREAS.map(area => (
                  <option key={area.id} value={area.id}>{area.icon} {area.name}</option>
                ))}
              </select>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Target Date</label>
              <input
                type="date"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)' }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description</label>
              <textarea
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                placeholder="Describe your goal..."
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', minHeight: '80px', resize: 'none' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ flex: 1, padding: '14px', fontSize: '16px', fontWeight: '600', backgroundColor: 'transparent', border: '1px solid var(--border)', borderRadius: '12px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => handleCreateGoal(newGoal)}
                style={{ flex: 1, padding: '14px', fontSize: '16px', fontWeight: '600', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
              >
                Create Goal 🎯
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default GoalsPage;