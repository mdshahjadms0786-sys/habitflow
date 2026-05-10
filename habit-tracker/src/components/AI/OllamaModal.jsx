import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryBadge, PriorityBadge } from '../UI/Badge';
import useOllama from '../../hooks/useOllama';
import { v4 as uuidv4 } from 'uuid';
import { getTodayISO } from '../../utils/dateUtils';

const categoryColors = {
  Health: '#14b8a6',
  Work: '#3b82f6',
  Personal: '#8b5cf6',
  Fitness: '#f97316',
  Learning: '#f59e0b',
};

export const OllamaModal = ({ isOpen, onClose, onAddHabits, model }) => {
  const [goal, setGoal] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const { fetchSuggestions, loading, error, connected, checkConnection } = useOllama(model);

  const handleGetSuggestions = async () => {
    if (!goal.trim()) return;

    const result = await fetchSuggestions(goal);
    if (result) {
      setSuggestions(result);
    }
  };

  const handleAddHabit = (suggestion) => {
    const newHabit = {
      id: uuidv4(),
      name: suggestion.name,
      category: suggestion.category,
      priority: suggestion.priority,
      reminderTime: null,
      notes: suggestion.notes || '',
      color: categoryColors[suggestion.category],
      icon: '',
      createdAt: getTodayISO(),
      completionLog: {},
      currentStreak: 0,
      longestStreak: 0,
      isActive: true,
    };
    onAddHabits([newHabit]);
    setSuggestions((prev) => prev?.filter((s) => s.name !== suggestion.name));
  };

  const handleAddAll = () => {
    if (!suggestions) return;

    const newHabits = suggestions.map((suggestion) => ({
      id: uuidv4(),
      name: suggestion.name,
      category: suggestion.category,
      priority: suggestion.priority,
      reminderTime: null,
      notes: suggestion.notes || '',
      color: categoryColors[suggestion.category],
      icon: '',
      createdAt: getTodayISO(),
      completionLog: {},
      currentStreak: 0,
      longestStreak: 0,
      isActive: true,
    }));

    onAddHabits(newHabits);
    setSuggestions(null);
    setGoal('');
    onClose();
  };

  const handleCheckConnection = async () => {
    await checkConnection();
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
                maxWidth: '600px',
                maxHeight: '90vh',
                overflow: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: '20px',
                    fontWeight: '700',
                    color: 'var(--text)',
                  }}
                >
                  🤖 AI Habit Suggestions
                </h2>
                <button
                  onClick={handleCheckConnection}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: 'var(--text)',
                  }}
                >
                  {connected === null ? 'Check Connection' : connected ? '✅ Connected' : '❌ Not Connected'}
                </button>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="goal"
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'var(--text)',
                  }}
                >
                  What goal do you want to achieve?
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    id="goal"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g., build a morning routine, get fit, reduce stress"
                    onKeyDown={(e) => e.key === 'Enter' && handleGetSuggestions()}
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
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGetSuggestions}
                    disabled={loading || !goal.trim()}
                    style={{
                      padding: '12px 20px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#ffffff',
                      backgroundColor: loading ? 'var(--text-secondary)' : 'var(--primary)',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {loading ? '...' : 'Get Suggestions'}
                  </motion.button>
                </div>
              </div>

              {error && (
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    color: '#dc2626',
                    fontSize: '13px',
                    marginBottom: '16px',
                  }}
                >
                  <strong>Connection Error:</strong> Could not connect to Ollama. Make sure Ollama is running at
                  http://localhost:11434. The app works fine without AI features.
                </div>
              )}

              {suggestions && suggestions.length > 0 && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px',
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'var(--text)',
                      }}
                    >
                      Suggested Habits ({suggestions.length})
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddAll}
                      style={{
                        padding: '8px 16px',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#ffffff',
                        backgroundColor: 'var(--primary)',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      Add All
                    </motion.button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {suggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        style={{
                          padding: '16px',
                          backgroundColor: 'var(--bg)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <h4
                            style={{
                              margin: '0 0 8px 0',
                              fontSize: '15px',
                              fontWeight: '600',
                              color: 'var(--text)',
                            }}
                          >
                            {suggestion.name}
                          </h4>
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            <CategoryBadge category={suggestion.category} size="sm" />
                            <PriorityBadge priority={suggestion.priority} size="sm" />
                          </div>
                          {suggestion.notes && (
                            <p
                              style={{
                                margin: 0,
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                              }}
                            >
                              {suggestion.notes}
                            </p>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddHabit(suggestion)}
                          style={{
                            padding: '8px 16px',
                            fontSize: '13px',
                            fontWeight: '500',
                            color: '#ffffff',
                            backgroundColor: 'var(--primary)',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Add
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border)',
                }}
              >
                <button
                  onClick={onClose}
                  style={{
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'var(--text)',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OllamaModal;
