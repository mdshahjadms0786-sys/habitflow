import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import VisionCard from '../components/VisionBoard/VisionCard';
import AddVisionModal from '../components/VisionBoard/AddVisionModal';
import { useHabits } from '../hooks/useHabits';
import { 
  loadVisions, saveVisions, createVision, deleteVision, 
  markVisionAchieved, getVisionStats, VISION_CATEGORIES 
} from '../utils/visionUtils';
import toast from 'react-hot-toast';

const VisionBoardPage = () => {
  const { habits } = useHabits();
  const navigate = useNavigate();
  const [visions, setVisions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingVision, setEditingVision] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAchieved, setShowAchieved] = useState(true);

  useEffect(() => {
    setVisions(loadVisions());
  }, []);

  const stats = useMemo(() => getVisionStats(visions, habits), [visions, habits]);

  const filteredVisions = useMemo(() => {
    let filtered = visions;
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(v => v.category === categoryFilter);
    }
    return filtered;
  }, [visions, categoryFilter]);

  const activeVisions = filteredVisions.filter(v => !v.isAchieved);
  const achievedVisions = visions.filter(v => v.isAchieved);

  const handleSaveVision = (visionData) => {
    if (editingVision) {
      const updated = visions.map(v => v.id === editingVision.id ? { ...v, ...visionData } : v);
      setVisions(updated);
      saveVisions(updated);
      toast.success('Vision updated!');
    } else {
      const newVision = createVision(visionData);
      const updated = [...visions, newVision];
      setVisions(updated);
      saveVisions(updated);
      toast.success('Vision added! 🌟');
    }
    setEditingVision(null);
  };

  const handleDeleteVision = (visionId) => {
    if (window.confirm('Delete this vision?')) {
      const updated = deleteVision(visions, visionId);
      setVisions(updated);
      saveVisions(updated);
      toast.success('Vision deleted');
    }
  };

  const handleMarkAchieved = (visionId) => {
    const updated = markVisionAchieved(visions, visionId);
    setVisions(updated);
    saveVisions(updated);
    toast.success('Goal achieved! 🎉');
  };

  const handleEditVision = (vision) => {
    setEditingVision(vision);
    setShowModal(true);
  };

  const todaysVision = useMemo(() => {
    if (activeVisions.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * activeVisions.length);
    return activeVisions[randomIndex];
  }, [activeVisions]);

  const relatedHabitsForVision = (visionId) => {
    const vision = visions.find(v => v.id === visionId);
    if (!vision?.relatedHabitIds) return [];
    return habits.filter(h => vision.relatedHabitIds.includes(h.id));
  };

  return (
    <div className="page-container" style={{ padding: '24px', paddingBottom: '80px' }}>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px' }}
      >
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--text)' }}>
          Vision Board 🖼️
        </h1>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Visualize your dreams — connect them to daily habits
        </p>
      </motion.header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          marginBottom: '24px',
          padding: '16px',
          backgroundColor: 'var(--surface)',
          borderRadius: '12px',
          border: '1px solid var(--border)'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text)' }}>{stats.total}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Visions</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#22c55e' }}>{stats.achieved}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Achieved</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#f97316' }}>{stats.inProgress}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>In Progress</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#534AB7' }}>{stats.connectedHabits}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Connected Habits</div>
        </div>
      </div>

      {todaysVision && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginBottom: '24px',
            padding: '20px',
            backgroundColor: '#EEEDFE',
            borderRadius: '12px',
            border: '1px solid #534AB7'
          }}
        >
          <div style={{ fontSize: '12px', color: '#534AB7', marginBottom: '8px' }}>Today, you're working toward:</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '36px' }}>{todaysVision.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text)' }}>{todaysVision.title}</div>
              {todaysVision.relatedHabitIds?.length > 0 && (
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {todaysVision.relatedHabitIds.length} habits connected
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setCategoryFilter('all')}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            backgroundColor: categoryFilter === 'all' ? 'var(--primary)' : 'var(--surface)',
            color: categoryFilter === 'all' ? '#fff' : 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          All
        </motion.button>
        {VISION_CATEGORIES.map(cat => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCategoryFilter(cat.id)}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              backgroundColor: categoryFilter === cat.id ? cat.color : 'var(--surface)',
              color: categoryFilter === cat.id ? '#fff' : 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            {cat.icon} {cat.label}
          </motion.button>
        ))}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          style={{
            padding: '8px 16px',
            fontSize: '13px',
            backgroundColor: 'var(--primary)',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            marginLeft: 'auto'
          }}
        >
          + Add Vision
        </motion.button>
      </div>

      {activeVisions.length === 0 && achievedVisions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'var(--surface)',
            borderRadius: '16px',
            border: '1px solid var(--border)'
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🌟</div>
          <h2 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '8px', color: 'var(--text)' }}>
            Add your first dream or goal
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Your habits will build toward your vision
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            style={{
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: '600',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Add Vision
          </motion.button>
        </motion.div>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '16px',
              marginBottom: '32px'
            }}
          >
            {activeVisions.map(vision => (
              <VisionCard
                key={vision.id}
                vision={vision}
                habits={habits}
                onEdit={handleEditVision}
                onDelete={handleDeleteVision}
                onAchieve={handleMarkAchieved}
              />
            ))}
          </div>

          {achievedVisions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div 
                onClick={() => setShowAchieved(!showAchieved)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  cursor: 'pointer',
                  marginBottom: '16px'
                }}
              >
                <span style={{ fontSize: '18px' }}>{showAchieved ? '▼' : '▶'}</span>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#22c55e' }}>
                  Achieved Dreams ✅ ({achievedVisions.length})
                </h2>
              </div>
              
              {showAchieved && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                    gap: '16px'
                  }}
                >
                  {achievedVisions.map(vision => (
                    <VisionCard
                      key={vision.id}
                      vision={vision}
                      habits={habits}
                      onEdit={handleEditVision}
                      onDelete={handleDeleteVision}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </>
      )}

      <AddVisionModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingVision(null); }}
        editVision={editingVision}
        onSave={handleSaveVision}
        existingHabits={habits}
      />
    </div>
  );
};

export default VisionBoardPage;