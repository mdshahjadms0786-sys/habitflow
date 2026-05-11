import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../hooks/useHabits';
import { hasFeature } from '../utils/planUtils';
import { loadStacks, saveStacks, getTodayStackStatus, getStackStats, PREDEFINED_STACK_TEMPLATES, updateStackStreaks } from '../utils/stackUtils';
import StackCard from '../components/Stacks/StackCard';
import CreateStackModal from '../components/Stacks/CreateStackModal';
import PlanBadge from '../components/UI/PlanBadge';
import toast from 'react-hot-toast';

const HabitStacksPage = () => {
  const { habits } = useHabits();
  const navigate = useNavigate();
  const [stacks, setStacks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStack, setEditingStack] = useState(null);
  
  const canAccess = hasFeature('habitStacks');
  
  useEffect(() => {
    const loadedStacks = loadStacks();
    const updated = updateStackStreaks(loadedStacks, habits);
    setStacks(updated);
  }, [habits]);
  
  if (!canAccess) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ marginBottom: '12px' }}>Pro Feature</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Upgrade to Pro to access Habit Stacks
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
  
  const todayStatus = getTodayStackStatus(stacks, habits);
  const stats = getStackStats(stacks);
  
  const handleSaveStack = (stack) => {
    const existing = stacks.find(s => s.id === stack.id);
    let newStacks;
    
    if (existing) {
      newStacks = stacks.map(s => s.id === stack.id ? stack : s);
    } else {
      newStacks = [...stacks, stack];
    }
    
    saveStacks(newStacks);
    setStacks(newStacks);
    setEditingStack(null);
  };
  
  const handleDeleteStack = (stackId) => {
    if (window.confirm('Delete this stack?')) {
      const newStacks = stacks.filter(s => s.id !== stackId);
      saveStacks(newStacks);
      setStacks(newStacks);
      toast.success('Stack deleted');
    }
  };
  
  const handleCompleteStack = (stackId) => {
    const stack = stacks.find(s => s.id === stackId);
    if (!stack) return;
    
    const today = new Date().toISOString().split('T')[0];
    const stackHabits = habits.filter(h => stack.habitIds.includes(h.id));
    const incomplete = stackHabits.filter(h => !h.completionLog?.[today]?.completed);
    
    if (incomplete.length > 0) {
      toast.success(`Marked ${incomplete.length} habits as complete!`);
    }
    
    setStacks(updateStackStreaks(stacks, habits));
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
            Habit Stacks 🔗
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Chain habits together for powerful routines
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
            Create Stack +
          </motion.button>
        </div>
      </motion.div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'var(--surface)', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '24px', fontWeight: '700' }}>{stats.total}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Stacks</div>
        </div>
        <div style={{ backgroundColor: 'var(--surface)', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '24px', fontWeight: '700' }}>{stats.activeToday}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Active Today</div>
        </div>
        <div style={{ backgroundColor: 'var(--surface)', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '24px', fontWeight: '700' }}>{stats.bestStreak}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Best Streak</div>
        </div>
        <div style={{ backgroundColor: 'var(--surface)', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '24px', fontWeight: '700' }}>🔥</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Keep Going</div>
        </div>
      </div>
      
      {todayStatus.length > 0 ? (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Today's Stacks</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
            {todayStatus.map(stack => (
              <StackCard
                key={stack.id}
                stack={stack}
                habits={habits}
                onEdit={() => { setEditingStack(stack); setShowModal(true); }}
                onDelete={() => handleDeleteStack(stack.id)}
                onComplete={() => handleCompleteStack(stack.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px', 
          backgroundColor: 'var(--surface)', 
          borderRadius: '20px',
          border: '1px solid var(--border)',
          marginBottom: '40px'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔗</div>
          <h3 style={{ marginBottom: '12px' }}>No Habit Stacks Yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Create your first habit stack to build powerful routines
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
            Create Your First Stack →
          </motion.button>
        </div>
      )}
      
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Stack Templates</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {PREDEFINED_STACK_TEMPLATES.map(template => (
            <motion.div
              key={template.name}
              whileHover={{ scale: 1.02 }}
              style={{
                backgroundColor: 'var(--surface)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                cursor: 'pointer'
              }}
              onClick={() => { setEditingStack({ ...template, habitIds: [] }); setShowModal(true); }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{template.icon}</div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>{template.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{template.description}</div>
              <div style={{ fontSize: '11px', color: template.color, marginTop: '8px' }}>
                {template.suggestedHabits.length} habits
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <CreateStackModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingStack(null); }}
        habits={habits}
        existingStack={editingStack}
        onSave={handleSaveStack}
      />
    </div>
  );
};

export default HabitStacksPage;