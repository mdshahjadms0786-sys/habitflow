import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useHabits } from '../hooks/useHabits';
import HabitList from '../components/Habits/HabitList';
import HabitModal from '../components/Habits/HabitModal';
import HabitTemplates from '../components/Habits/HabitTemplates';
import SubtypeModal from '../components/Habits/SubtypeModal';
import EmptyState from '../components/UI/EmptyState';
import OllamaModal from '../components/AI/OllamaModal';
import { v4 as uuidv4 } from 'uuid';
import { getTodayISO } from '../utils/dateUtils';
import { categorizeTodayHabits } from '../utils/streakUtils';
import toast from 'react-hot-toast';

const categories = ['All', 'Health', 'Work', 'Personal', 'Fitness', 'Learning'];
const sortOptions = [
  { value: 'streak', label: 'By Streak' },
  { value: 'name', label: 'By Name' },
  { value: 'priority', label: 'By Priority' },
  { value: 'dateAdded', label: 'By Date Added' },
];

const categoryColors = {
  Health: '#14b8a6',
  Work: '#3b82f6',
  Personal: '#8b5cf6',
  Fitness: '#f97316',
  Learning: '#f59e0b',
};

const AllHabits = () => {
  const {
    habits,
    addHabit,
    editHabit: updateHabit,
    deleteHabit: removeHabit,
    importData,
    ollamaModel,
  } = useHabits();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [isOllamaModalOpen, setIsOllamaModalOpen] = useState(false);
  const [subtypeModalHabit, setSubtypeModalHabit] = useState(null);
  const [isSubtypeModalOpen, setIsSubtypeModalOpen] = useState(false);

  const filteredAndSortedHabits = useMemo(() => {
    let result = [...habits];

    if (selectedCategory !== 'All') {
      result = result.filter((h) => h.category === selectedCategory);
    }

    switch (sortBy) {
      case 'streak':
        result.sort((a, b) => (b.currentStreak || 0) - (a.currentStreak || 0));
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'priority':
        const priorityOrder = { High: 0, Medium: 1, Low: 2 };
        result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
      case 'dateAdded':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    return result;
  }, [habits, selectedCategory, sortBy]);

  const handleAddHabit = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const handleAddTemplate = (newHabits) => {
    newHabits.forEach(habit => {
      addHabit(habit);
    });
    toast.success(`Added ${newHabits.length} habits from template!`);
  };

  const handleEditHabit = (habit) => {
    if (habit.subtypes && habit.subtypes.length > 0) {
      setSubtypeModalHabit(habit);
      setIsSubtypeModalOpen(true);
    } else {
      setEditingHabit(habit);
      setIsModalOpen(true);
    }
  };

  const handleSubtypeComplete = (habitId, subtype) => {
    console.log('Completed:', habitId, subtype);
  };

  const handleDeleteHabit = (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      removeHabit(habitId);
      toast.success('🗑️ Habit deleted!');
    }
  };

  const handleSaveHabit = (habitData) => {
    if (editingHabit) {
      updateHabit(habitData);
      toast.success('✏️ Habit updated!');
    } else {
      const newHabit = {
        ...habitData,
        id: uuidv4(),
        createdAt: getTodayISO(),
        completionLog: {},
        currentStreak: 0,
        longestStreak: 0,
        isActive: true,
      };
      addHabit(newHabit);
      toast.success('✅ Habit added!');
    }
    setIsModalOpen(false);
    setEditingHabit(null);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(habits, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `habit-tracker-export-${getTodayISO()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('📥 Habits exported!');
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedHabits = JSON.parse(e.target?.result);
        if (Array.isArray(importedHabits)) {
          importedHabits.forEach((habit) => {
            addHabit({ ...habit, id: uuidv4() });
          });
          toast.success(`📥 Imported ${importedHabits.length} habits!`);
        }
      } catch {
        toast.error('Failed to import habits. Invalid file format.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="page-container" style={{ padding: '24px', paddingBottom: '80px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: '700',
            color: 'var(--text)',
          }}
        >
          All Habits
        </h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsOllamaModalOpen(true)}
            style={{
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#ffffff',
              backgroundColor: '#8b5cf6',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            🤖 AI Suggest
          </button>
          <button
            onClick={handleExport}
            style={{
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text)',
              backgroundColor: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            📤 Export
          </button>
          <label
            style={{
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--text)',
              backgroundColor: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            📥 Import
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      <HabitTemplates onAddTemplate={handleAddTemplate} currentHabitsCount={habits.length} />

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '16px',
        }}
      >
        {categories.map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              color: selectedCategory === category ? '#ffffff' : 'var(--text)',
              backgroundColor:
                selectedCategory === category
                  ? categoryColors[category] || 'var(--primary)'
                  : 'var(--surface)',
              border:
                selectedCategory === category
                  ? 'none'
                  : '1px solid var(--border)',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {category}
          </motion.button>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '24px',
        }}
      >
        <span
          style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
          }}
        >
          Sort:
        </span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '8px 12px',
            fontSize: '14px',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            backgroundColor: 'var(--bg)',
            color: 'var(--text)',
            cursor: 'pointer',
          }}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {filteredAndSortedHabits.length > 0 ? (
        <HabitList
          habits={filteredAndSortedHabits}
          onToggle={handleEditHabit}
          onEdit={handleEditHabit}
          onDelete={handleDeleteHabit}
        />
      ) : (
        <EmptyState
          icon="📝"
          title="No habits found"
          description={
            selectedCategory !== 'All'
              ? `No habits in the ${selectedCategory} category.`
              : "Start by creating your first habit!"
          }
          action={handleAddHabit}
          actionLabel="Create Habit"
        />
      )}

      <HabitModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingHabit(null);
        }}
        habit={editingHabit}
        onSave={handleSaveHabit}
      />

      <SubtypeModal
        habit={subtypeModalHabit}
        isOpen={isSubtypeModalOpen}
        onClose={() => {
          setIsSubtypeModalOpen(false);
          setSubtypeModalHabit(null);
        }}
        onCompleteSubtype={handleSubtypeComplete}
      />

      <OllamaModal
        isOpen={isOllamaModalOpen}
        onClose={() => setIsOllamaModalOpen(false)}
        onAddHabits={handleAddTemplate}
        model={ollamaModel}
      />
    </div>
  );
};

export default AllHabits;
