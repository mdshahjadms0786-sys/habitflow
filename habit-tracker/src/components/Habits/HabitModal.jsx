import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from '../UI/EmojiPicker';
import DifficultySelector from '../Difficulty/DifficultySelector';
import { suggestDifficulty } from '../../utils/difficultyUtils';

const categories = ['Health', 'Work', 'Personal', 'Fitness', 'Learning'];
const priorities = ['Low', 'Medium', 'High', 'Extreme'];

const priorityToDifficulty = { Low: 'easy', Medium: 'medium', High: 'hard', Extreme: 'extreme' };
const difficultyToPriority = { easy: 'Low', medium: 'Medium', hard: 'High', extreme: 'Extreme' };

const categoryColors = {
  Health: '#14b8a6',
  Work: '#3b82f6',
  Personal: '#8b5cf6',
  Fitness: '#f97316',
  Learning: '#f59e0b',
};

const categoryDefaultIcons = {
  Health: '💊',
  Work: '💼',
  Personal: '⭐',
  Fitness: '💪',
  Learning: '📚',
};

export const HabitModal = ({ isOpen, onClose, habit, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    icon: '⭐',
    category: 'Personal',
    priority: 'Medium',
    difficulty: 'medium',
    reminderTime: '',
    deadlineTime: '',
    notes: '',
  });
  const [showPicker, setShowPicker] = useState(false);
  const [userPickedIcon, setUserPickedIcon] = useState(false);
  const [errors, setErrors] = useState({});
  const pickerRef = useRef(null);
  const [showDifficultySuggestion, setShowDifficultySuggestion] = useState(false);
  const [suggestedDifficulty, setSuggestedDifficulty] = useState(null);

  useEffect(() => {
    if (habit) {
      const pickedIcon = habit.icon || categoryDefaultIcons[habit.category] || '⭐';
      setFormData({
        name: habit.name || '',
        icon: pickedIcon,
        category: habit.category || 'Personal',
        priority: habit.priority || 'Medium',
        difficulty: habit.difficulty || 'medium',
        reminderTime: habit.reminderTime || '',
        deadlineTime: habit.deadlineTime || '',
        notes: habit.notes || '',
      });
      setUserPickedIcon(!!habit.icon);
      
      if (habit.completionLog) {
        const suggested = suggestDifficulty(habit.completionLog);
        if (suggested !== (habit.difficulty || 'medium')) {
          setSuggestedDifficulty(suggested);
          setShowDifficultySuggestion(true);
        }
      }
    } else {
      const defaultIcon = categoryDefaultIcons['Personal'] || '⭐';
      setFormData({
        name: '',
        icon: defaultIcon,
        category: 'Personal',
        priority: 'Medium',
        difficulty: 'medium',
        reminderTime: '',
        deadlineTime: '',
        notes: '',
      });
      setUserPickedIcon(false);
      setSuggestedDifficulty(null);
      setShowDifficultySuggestion(false);
    }
    setErrors({});
    setShowPicker(false);
  }, [habit, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Habit name is required';
    }
    if (formData.name.length > 50) {
      newErrors.name = 'Habit name must be less than 50 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...habit,
        ...formData,
        color: categoryColors[formData.category],
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setFormData((prev) => ({ ...prev, category: newCategory }));
    if (!userPickedIcon) {
      setFormData((prev) => ({ ...prev, icon: categoryDefaultIcons[newCategory] || '⭐' }));
    }
  };

  const handleIconSelect = (emoji) => {
    setFormData((prev) => ({ ...prev, icon: emoji }));
    setUserPickedIcon(true);
    setShowPicker(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: '16px',
                padding: '24px',
                width: '100%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflow: 'auto',
              }}
            >
              <h2
                style={{
                  margin: '0 0 20px 0',
                  fontSize: '20px',
                  fontWeight: '700',
                  color: 'var(--text)',
                }}
              >
                {habit ? 'Edit Habit' : 'Create New Habit'}
              </h2>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    htmlFor="name"
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'var(--text)',
                    }}
                  >
                    Habit Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Morning Meditation"
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '14px',
                      border: `1px solid ${errors.name ? '#ef4444' : 'var(--border)'}`,
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text)',
                      boxSizing: 'border-box',
                    }}
                  />
                  {errors.name && (
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#ef4444' }}>
                      {errors.name}
                    </p>
                  )}
                </div>

                <div style={{ marginBottom: '16px', position: 'relative' }} ref={pickerRef}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'var(--text)',
                    }}
                  >
                    Icon
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '8px',
                        border: '2px solid var(--border)',
                        backgroundColor: 'var(--bg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                      }}
                    >
                      {formData.icon}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPicker(!showPicker)}
                      style={{
                        padding: '10px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: 'var(--text)',
                        backgroundColor: 'var(--bg)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      Choose Icon
                    </button>
                  </div>
                  <AnimatePresence>
                    {showPicker && <EmojiPicker onSelect={handleIconSelect} onClose={() => setShowPicker(false)} />}
                  </AnimatePresence>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label
                      htmlFor="category"
                      style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: 'var(--text)',
                      }}
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleCategoryChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '14px',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--text)',
                        boxSizing: 'border-box',
                      }}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="priority"
                      style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: 'var(--text)',
                      }}
                    >
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={(e) => {
                        const newPriority = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          priority: newPriority,
                          difficulty: priorityToDifficulty[newPriority] || 'medium'
                        }));
                      }}
                      style={{
                        width: '100%',
                        padding: '12px',
                        fontSize: '14px',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--text)',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="Low">🟢 Low</option>
                      <option value="Medium">🟡 Medium</option>
                      <option value="High">🔴 High</option>
                      <option value="Extreme">💀 Extreme</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'var(--text)',
                    }}
                  >
                    Difficulty
                  </label>
                  <DifficultySelector 
                    value={formData.difficulty} 
                    onChange={(value) => {
                      setFormData(prev => ({ 
                        ...prev, 
                        difficulty: value,
                        priority: difficultyToPriority[value] || 'Medium'
                      }));
                    }} 
                  />
                  
                  {showDifficultySuggestion && suggestedDifficulty && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        marginTop: '12px',
                        padding: '12px',
                        backgroundColor: 'var(--bg)',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>💡</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                          Based on your completion rate, we suggest: <strong>{suggestedDifficulty}</strong>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, difficulty: suggestedDifficulty }));
                          setShowDifficultySuggestion(false);
                        }}
                        style={{
                          padding: '6px 12px',
                          fontSize: '11px',
                          color: 'var(--text)',
                          backgroundColor: 'var(--primary)',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        Apply
                      </button>
                    </motion.div>
                  )}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label
                    htmlFor="reminderTime"
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'var(--text)',
                    }}
                  >
                    Reminder Time (optional)
                  </label>
                  <input
                    type="time"
                    id="reminderTime"
                    name="reminderTime"
                    value={formData.reminderTime}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '14px',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text)',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label
                    htmlFor="deadlineTime"
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'var(--text)',
                    }}
                  >
                    Complete By (optional)
                  </label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <input
                      type="time"
                      id="deadlineTime"
                      name="deadlineTime"
                      value={formData.deadlineTime}
                      onChange={handleChange}
                      style={{
                        flex: 1,
                        padding: '12px',
                        fontSize: '14px',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg)',
                        color: 'var(--text)',
                      }}
                    />
                    <button 
                      type="button"
                      onClick={() => handleChange({ target: { name: 'deadlineTime', value: '' } })}
                      style={{
                        padding: '8px 12px',
                        fontSize: '12px',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                      }}
                    >
                      Clear
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['09:00', '12:00', '18:00', '21:00', '23:59'].map(time => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => handleChange({ target: { name: 'deadlineTime', value: time } })}
                        style={{
                          padding: '4px 8px',
                          fontSize: '11px',
                          backgroundColor: formData.deadlineTime === time ? 'var(--color-primary)' : 'var(--bg)',
                          border: '1px solid var(--border)',
                          borderRadius: '4px',
                          color: formData.deadlineTime === time ? 'white' : 'var(--text-secondary)',
                          cursor: 'pointer',
                        }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  <small style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '6px', display: 'block' }}>
                    Default: midnight (11:59 PM). Set earlier deadline for time-sensitive habits.
                  </small>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label
                    htmlFor="notes"
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'var(--text)',
                    }}
                  >
                    Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Add any notes about this habit..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '14px',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--text)',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'var(--text)',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#ffffff',
                      backgroundColor: 'var(--primary)',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    {habit ? 'Save Changes' : 'Create Habit'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HabitModal;