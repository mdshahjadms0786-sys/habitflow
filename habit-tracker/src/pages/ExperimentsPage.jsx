import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ExperimentCard from '../components/Experiments/ExperimentCard';
import ExperimentReport from '../components/Experiments/ExperimentReport';
import StartExperimentModal from '../components/Experiments/StartExperimentModal';
import { useHabits } from '../hooks/useHabits';
import { 
  loadExperiments, saveExperiments, getActiveExperiment, 
  completeExperiment, abandonExperiment, createExperiment 
} from '../utils/experimentUtils';
import toast from 'react-hot-toast';

const ExperimentsPage = () => {
  const { habits } = useHabits();
  const navigate = useNavigate();
  const [experiments, setExperiments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);

  useEffect(() => {
    setExperiments(loadExperiments());
  }, []);

  const activeExperiment = useMemo(() => getActiveExperiment(experiments), [experiments]);
  const pastExperiments = useMemo(() => 
    experiments.filter(e => e.status === 'completed' || e.status === 'abandoned'),
    [experiments]
  );

  const handleStartExperiment = (experiment) => {
    const updated = [...experiments, experiment];
    setExperiments(updated);
    saveExperiments(updated);
    setShowModal(false);
    setSelectedHabit(null);
  };

  const handleUpdateExperiment = (updated) => {
    setExperiments(updated);
    saveExperiments(updated);
  };

  const handleAbandon = () => {
    if (!activeExperiment) return;
    const updated = abandonExperiment(experiments, activeExperiment.id);
    setExperiments(updated);
    saveExperiments(updated);
    toast.success('Experiment abandoned');
  };

  const handleComplete = (result) => {
    if (!activeExperiment) return;
    const updated = completeExperiment(experiments, activeExperiment.id, result);
    setExperiments(updated);
    saveExperiments(updated);
    setViewingReport(activeExperiment);
    toast.success('Experiment complete! 🎉');
  };

  const handleShare = () => {
    if (!viewingReport) return;
    const text = `I completed "${viewingReport.title}" — ${viewingReport.duration} days experiment!\nHypothesis: ${viewingReport.hypothesis}\n#HabitTracker`;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const openHabitSelector = () => {
    if (habits.length === 0) {
      toast.error('Create a habit first!');
      navigate('/habits');
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="page-container" style={{ padding: '24px', paddingBottom: '80px' }}>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px' }}
      >
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--text)' }}>
          Habit Experiments 🔬
        </h1>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Test new habits with structured experiments
        </p>
      </motion.header>

      {activeExperiment && !viewingReport && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '32px' }}
        >
          <ExperimentCard
            experiment={activeExperiment}
            onUpdate={handleUpdateExperiment}
            onAbandon={handleAbandon}
          />
        </motion.div>
      )}

      {viewingReport && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '32px' }}
        >
          <ExperimentReport
            experiment={viewingReport}
            habits={habits}
            onRate={(result) => {
              const updated = completeExperiment(experiments, viewingReport.id, result);
              setExperiments(updated);
              saveExperiments(updated);
              setViewingReport(null);
            }}
            onStartNew={() => { setViewingReport(null); setShowModal(true); }}
            onShare={handleShare}
          />
        </motion.div>
      )}

      {!activeExperiment && !viewingReport && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openHabitSelector}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: '#534AB7',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            marginBottom: '32px'
          }}
        >
          + Start New Experiment
        </motion.button>
      )}

      {pastExperiments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: 'var(--text)' }}>
            Past Experiments
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pastExperiments.map(exp => (
              <motion.div
                key={exp.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => setViewingReport(exp)}
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--surface)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <span style={{ fontSize: '24px' }}>
                  {exp.result === 'positive' ? '👍' : exp.result === 'negative' ? '👎' : '😐'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)' }}>
                    {exp.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {exp.duration} days • {new Date(exp.startDate).toLocaleDateString()}
                  </div>
                </div>
                <span style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>→</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {experiments.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: 'var(--surface)',
            borderRadius: '16px',
            border: '1px solid var(--border)'
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔬</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '500', color: 'var(--text)' }}>
            No experiments yet
          </h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            Start your first habit experiment to test new routines!
          </p>
        </motion.div>
      )}

      <StartExperimentModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setSelectedHabit(null); }}
        habit={selectedHabit}
        onSave={handleStartExperiment}
      />
    </div>
  );
};

export default ExperimentsPage;