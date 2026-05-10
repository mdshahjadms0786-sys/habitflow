import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BetCard from '../components/Bets/BetCard';
import PlaceBetModal from '../components/Bets/PlaceBetModal';
import { useHabits } from '../hooks/useHabits';
import { loadBets, getBetStats, updateBet, checkBetStatus } from '../utils/bettingUtils';
import toast from 'react-hot-toast';

const BetsPage = () => {
  const { habits } = useHabits();
  const [bets, setBets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);

  useEffect(() => {
    loadAllBets();
  }, []);

  const loadAllBets = () => {
    const allBets = loadBets();
    const checked = allBets.map(b => checkBetStatus(b, habits.reduce((acc, h) => ({ ...acc, [h.id]: h.completionLog }), {})));
    setBets(checked);
  };

  const activeBets = bets.filter(b => b.status === 'active');
  const pastBets = bets.filter(b => b.status !== 'active');
  const stats = getBetStats(bets);

  const handlePlaceBet = (bet) => {
    setBets([...bets, bet]);
  };

  const handleAbort = (betId) => {
    if (window.confirm('Abort this bet? You will lose your stake.')) {
      const updated = bets.map(b => b.id === betId ? { ...b, status: 'lost' } : b);
      setBets(updated);
      toast.success('Bet aborted');
    }
  };

  const completionLog = habits.reduce((acc, h) => ({ ...acc, ...h.completionLog }), {});

  return (
    <div className="page-container" style={{ padding: '24px', paddingBottom: '80px' }}>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '24px' }}
      >
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--text)' }}>
          Habit Bets 💰
        </h1>
        <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Put your points where your habits are
        </p>
      </motion.header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary)' }}>{stats.active}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Active</div>
        </div>
        <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#22c55e' }}>{stats.won}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Won</div>
        </div>
        <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#dc2626' }}>{stats.lost}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Lost</div>
        </div>
        <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '20px', fontWeight: '700', color: stats.net >= 0 ? '#22c55e' : '#dc2626' }}>{stats.net >= 0 ? '+' : ''}{stats.net}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Net</div>
        </div>
      </div>

      {activeBets.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>Active Bets</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeBets.map(bet => (
              <BetCard
                key={bet.id}
                bet={bet}
                completionLog={completionLog}
                onAbort={() => handleAbort(bet.id)}
              />
            ))}
          </div>
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowModal(true)}
        style={{
          width: '100%',
          padding: '14px',
          fontSize: '15px',
          fontWeight: '600',
          backgroundColor: 'var(--primary)',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          marginBottom: '24px'
        }}
      >
        + Place New Bet
      </motion.button>

      {pastBets.length > 0 && (
        <div>
          <h2 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>Past Bets</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pastBets.map(bet => (
              <motion.div
                key={bet.id}
                whileHover={{ scale: 1.01 }}
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'var(--surface)',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <span style={{ fontSize: '20px' }}>{bet.status === 'won' ? '🏆' : '💸'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>{bet.habitName}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {bet.duration} days • {bet.currentProgress}% completion
                  </div>
                </div>
                <div style={{ fontWeight: '600', color: bet.status === 'won' ? '#22c55e' : '#dc2626' }}>
                  {bet.status === 'won' ? `+${bet.reward}` : `-${bet.betAmount}`} pts
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {bets.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '500' }}>No bets yet</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Place your first bet to multiply your points!</p>
        </div>
      )}

      <PlaceBetModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        habit={selectedHabit}
        onSave={handlePlaceBet}
      />
    </div>
  );
};

export default BetsPage;