import { useState } from 'react';
import { motion } from 'framer-motion';
import { HABIT_TEMPLATES } from '../../utils/habitTemplates';
import { useHabitContext } from '../../context/HabitContext';
import toast from 'react-hot-toast';

const TemplateSelector = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { addHabit } = useHabitContext();

  const applyTemplate = (template) => {
    template.habits.forEach((habitTemplate, index) => {
      const newHabit = {
        id: `${template.id}-${index}-${Date.now()}`,
        name: habitTemplate.name,
        category: habitTemplate.category,
        priority: habitTemplate.priority,
        icon: habitTemplate.icon,
        isActive: true,
        createdAt: new Date().toISOString(),
        completionLog: {},
        currentStreak: 0,
        longestStreak: 0,
      };
      addHabit(newHabit);
    });
    toast.success(`${template.habits.length} habits added from ${template.name}!`);
    setSelectedTemplate(null);
  };

  return (
    <div>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>
        Habit Templates 📋
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {HABIT_TEMPLATES.map((template) => (
          <motion.div
            key={template.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => applyTemplate(template)}
            style={{
              padding: '16px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '32px' }}>{template.icon}</span>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'var(--text)' }}>
                  {template.name}
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {template.habits.length} habits
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;