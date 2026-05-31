import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createStack, PREDEFINED_STACK_TEMPLATES, matchHabitsToTemplate } from '../../utils/stackUtils';
import toast from 'react-hot-toast';

const STACK_TYPES = [
  { id: 'morning', label: 'Morning 🌅', color: '#F59E0B' },
  { id: 'evening', label: 'Evening 🌙', color: '#7C3AED' },
  { id: 'workout', label: 'Workout 💪', color: '#EF4444' },
  { id: 'work', label: 'Work 💻', color: '#0EA5E9' },
  { id: 'custom', label: 'Custom 📋', color: '#6366F1' }
];

const COLORS = ['#EF4444', '#F59E0B', '#22C55E', '#0EA5E9', '#6366F1', '#8B5CF6', '#EC4899', '#14B8A6'];

const EMOJI_PICKER = ['📋', '🌅', '🌙', '💪', '🏃', '🧘', '📚', '💻', '🎯', '🔥', '⭐', '💡', '🎉', '🏆', '👑', '💎'];

const CreateStackModal = ({ isOpen, onClose, habits, existingStack, onSave }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: existingStack?.name || '',
    description: existingStack?.description || '',
    icon: existingStack?.icon || '📋',
    type: existingStack?.type || 'custom',
    color: existingStack?.color || '#6366F1',
    habitIds: existingStack?.habitIds || []
  });
  
  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a stack name');
      return;
    }
    
    if (formData.habitIds.length === 0) {
      toast.error('Please add at least one habit');
      return;
    }
    
    const stack = existingStack 
      ? { ...existingStack, ...formData }
      : createStack(formData);
    
    onSave(stack);
    toast.success(existingStack ? 'Stack updated!' : 'Stack created!');
    onClose();
  };
  
  const toggleHabit = (habitId) => {
    setFormData(prev => ({
      ...prev,
      habitIds: prev.habitIds.includes(habitId)
        ? prev.habitIds.filter(id => id !== habitId)
        : [...prev.habitIds, habitId]
    }));
  };
  
  const applyTemplate = (template) => {
    const matchedIds = matchHabitsToTemplate(template, habits);
    setFormData({
      name: template.name,
      description: template.description,
      icon: template.icon,
      type: template.type,
      color: template.color,
      habitIds: matchedIds
    });
    setStep(3);
  };
  
  if (!isOpen) return null;
  
  return (
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
          borderRadius: '24px',
          padding: '32px',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>
            {existingStack ? 'Edit Stack' : 'Create Stack'}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[1, 2, 3].map(s => (
            <div
              key={s}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '2px',
                backgroundColor: step >= s ? 'var(--primary)' : 'var(--border)'
              }}
            />
          ))}
        </div>
        
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Stack Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Power Morning"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg)',
                    fontSize: '16px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Icon</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {EMOJI_PICKER.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setFormData({ ...formData, icon: emoji })}
                      style={{
                        width: '40px',
                        height: '40px',
                        fontSize: '20px',
                        borderRadius: '8px',
                        border: formData.icon === emoji ? '2px solid var(--primary)' : '1px solid var(--border)',
                        backgroundColor: formData.icon === emoji ? 'var(--primary-light)' : 'var(--bg)',
                        cursor: 'pointer'
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Type</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {STACK_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setFormData({ ...formData, type: type.id, color: type.color })}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: formData.type === type.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                        backgroundColor: formData.type === type.id ? 'var(--primary-light)' : 'var(--bg)',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Color</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setFormData({ ...formData, color })}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        border: formData.color === color ? '3px solid var(--text)' : 'none',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description (optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your stack..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg)',
                    fontSize: '14px',
                    minHeight: '60px',
                    resize: 'none'
                  }}
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(2)}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '16px',
                  fontWeight: '600',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                Next: Add Habits →
              </motion.button>
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Select Habits</h3>
              
              <div style={{ maxHeight: '300px', overflow: 'auto', marginBottom: '16px' }}>
                {habits.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No habits yet. Create some habits first!
                  </p>
                ) : (
                  habits.map(habit => (
                    <label
                      key={habit.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        backgroundColor: 'var(--bg)',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.habitIds.includes(habit.id)}
                        onChange={() => toggleHabit(habit.id)}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span style={{ fontSize: '20px' }}>{habit.icon}</span>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '500' }}>{habit.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{habit.category}</div>
                      </div>
                    </label>
                  ))
                )}
              </div>
              
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Or use a template:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                {PREDEFINED_STACK_TEMPLATES.map(template => (
                  <button
                    key={template.name}
                    onClick={() => applyTemplate(template)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg)',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ fontSize: '16px' }}>{template.icon}</div>
                    <div style={{ fontSize: '12px', fontWeight: '500' }}>{template.name}</div>
                  </button>
                ))}
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    fontSize: '16px',
                    fontWeight: '600',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    cursor: 'pointer'
                  }}
                >
                  ← Back
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(3)}
                  disabled={formData.habitIds.length === 0}
                  style={{
                    flex: 1,
                    padding: '14px',
                    fontSize: '16px',
                    fontWeight: '600',
                    backgroundColor: formData.habitIds.length > 0 ? 'var(--primary)' : 'var(--border)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: formData.habitIds.length > 0 ? 'pointer' : 'not-allowed'
                  }}
                >
                  Preview →
                </motion.button>
              </div>
            </motion.div>
          )}
          
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Preview</h3>
              
              <div style={{
                backgroundColor: 'var(--bg)',
                borderRadius: '16px',
                padding: '20px',
                border: `4px solid ${formData.color}`,
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '32px' }}>{formData.icon}</span>
                  <div>
                    <div style={{ fontWeight: '600' }}>{formData.name || 'Unnamed Stack'}</div>
                    <div style={{ fontSize: '12px', color: formData.color }}>{formData.type}</div>
                  </div>
                </div>
                {formData.description && (
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    {formData.description}
                  </p>
                )}
                <div style={{ fontSize: '14px' }}>
                  {formData.habitIds.length} habits selected
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setStep(2)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    fontSize: '16px',
                    fontWeight: '600',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    cursor: 'pointer'
                  }}
                >
                  ← Back
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  style={{
                    flex: 1,
                    padding: '14px',
                    fontSize: '16px',
                    fontWeight: '600',
                    backgroundColor: 'var(--primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Create Stack 🎯
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default CreateStackModal;