import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VISION_CATEGORIES, getCategoryEmojis, createVision, getCategoryInfo } from '../../utils/visionUtils';
import { useHabits } from '../../hooks/useHabits';
import toast from 'react-hot-toast';

const AddVisionModal = ({ isOpen, onClose, editVision, onSave, existingHabits = [] }) => {
  const { habits } = useHabits();
  const allHabits = existingHabits.length > 0 ? existingHabits : habits;

  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('✨');
  const [category, setCategory] = useState('lifestyle');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [relatedHabitIds, setRelatedHabitIds] = useState([]);
  const [color, setColor] = useState(VISION_CATEGORIES[4].color);

  useEffect(() => {
    if (editVision) {
      setTitle(editVision.title || '');
      setEmoji(editVision.emoji || '✨');
      setCategory(editVision.category || 'lifestyle');
      setDescription(editVision.description || '');
      setTargetDate(editVision.targetDate ? editVision.targetDate.split('T')[0] : '');
      setRelatedHabitIds(editVision.relatedHabitIds || []);
      setColor(editVision.color || VISION_CATEGORIES[4].color);
    } else {
      setTitle('');
      setEmoji('✨');
      setCategory('lifestyle');
      setDescription('');
      setTargetDate('');
      setRelatedHabitIds([]);
      setColor(VISION_CATEGORIES[4].color);
    }
  }, [editVision, isOpen]);

  const handleCategoryChange = (catId) => {
    setCategory(catId);
    const cat = getCategoryInfo(catId);
    setColor(cat.color);
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Please enter a title for your vision');
      return;
    }

    const visionData = {
      title: title.trim().slice(0, 40),
      emoji,
      category,
      description: description.trim().slice(0, 200),
      targetDate: targetDate ? new Date(targetDate).toISOString() : null,
      relatedHabitIds,
      color
    };

    onSave(visionData);
    onClose();
  };

  if (!isOpen) return null;

  const availableEmojis = getCategoryEmojis(category);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '16px',
            padding: '24px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}
        >
          <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: 'var(--text)' }}>
            {editVision ? 'Edit Vision' : 'Add New Vision 🌟'}
          </h2>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text)' }}>
              Emoji
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '4px' }}>
              {availableEmojis.map((em) => (
                <motion.button
                  key={em}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setEmoji(em)}
                  style={{
                    padding: '8px',
                    fontSize: '20px',
                    backgroundColor: emoji === em ? `${color}30` : 'var(--bg)',
                    border: emoji === em ? `2px solid ${color}` : '1px solid var(--border)',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  {em}
                </motion.button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text)' }}>
              Title (required)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 40))}
              placeholder="My big dream..."
              maxLength={40}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg)',
                color: 'var(--text)'
              }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{title.length}/40</span>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text)' }}>
              Category
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {VISION_CATEGORIES.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCategoryChange(cat.id)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px',
                    backgroundColor: category === cat.id ? cat.color : 'var(--bg)',
                    color: category === cat.id ? '#fff' : 'var(--text)',
                    border: `1px solid ${category === cat.id ? cat.color : 'var(--border)'}`,
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  {cat.icon} {cat.label}
                </motion.button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text)' }}>
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 200))}
              placeholder="What does achieving this mean to you?"
              maxLength={200}
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '12px',
                fontSize: '14px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg)',
                color: 'var(--text)',
                resize: 'vertical'
              }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{description.length}/200</span>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text)' }}>
              Target Date (optional)
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg)',
                color: 'var(--text)'
              }}
            />
          </div>

          {allHabits.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px', color: 'var(--text)' }}>
                Connect to Habits
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {allHabits.map((habit) => (
                  <motion.button
                    key={habit.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setRelatedHabitIds(prev =>
                        prev.includes(habit.id)
                          ? prev.filter(id => id !== habit.id)
                          : [...prev, habit.id]
                      );
                    }}
                    style={{
                      padding: '6px 10px',
                      fontSize: '12px',
                      backgroundColor: relatedHabitIds.includes(habit.id) ? 'var(--primary)' : 'var(--bg)',
                      color: relatedHabitIds.includes(habit.id) ? '#fff' : 'var(--text)',
                      border: `1px solid ${relatedHabitIds.includes(habit.id) ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    {habit.icon} {habit.name}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: 'var(--bg)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              style={{
                flex: 1,
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: color,
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              {editVision ? 'Save Changes' : 'Add Vision'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddVisionModal;