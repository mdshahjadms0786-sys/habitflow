import { motion, AnimatePresence } from 'framer-motion';
import HabitCard from './HabitCard';
import EmptyState from '../UI/EmptyState';

export const HabitList = ({ habits, onToggle, onEdit, onDelete }) => {
  if (!habits || habits.length === 0) {
    return (
      <EmptyState
        icon="📝"
        title="No habits yet"
        description="Start by creating your first habit to track your progress!"
      />
    );
  }

  const completedHabits = habits.filter((h) => h.completionLog?.[new Date().toISOString().split('T')[0]]);
  const pendingHabits = habits.filter((h) => !h.completionLog?.[new Date().toISOString().split('T')[0]]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {pendingHabits.length > 0 && (
        <div>
          <h3
            style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Pending Today
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <AnimatePresence>
              {pendingHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {completedHabits.length > 0 && (
        <div>
          <h3
            style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            ✅ Completed
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <AnimatePresence>
              {completedHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitList;
