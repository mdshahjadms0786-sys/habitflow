import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useHabits } from '../hooks/useHabits';
import { 
  CERTIFICATIONS, 
  checkCertifications, 
  loadCertifications, 
  saveCertifications,
  getCertificationProgress
} from '../utils/certificationUtils';
import { loadProfile } from '../utils/profileUtils';
import CertificateCard from '../components/Achievements/CertificateCard';

const CertificationsPage = () => {
  const { habits } = useHabits();
  const [certifications, setCertifications] = useState([]);
  const [earnedCerts, setEarnedCerts] = useState([]);
  const [progress, setProgress] = useState([]);
  const profile = loadProfile();
  
  useEffect(() => {
    const earned = checkCertifications(habits);
    const storedCerts = loadCertifications();
    const mergedCerts = storedCerts.length > 0 ? storedCerts : earned.map(c => ({
      certification: c,
      habitName: c.habitName,
      date: new Date().toISOString(),
      userName: profile.name
    }));
    
    setEarnedCerts(mergedCerts);
    setCertifications(CERTIFICATIONS);
    setProgress(getCertificationProgress(habits));
  }, [habits, profile.name]);
  
  const handleDownloadAll = () => {
    toast.success('Preparing download...');
  };
  
  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
          Your Certificates 🏆
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Earn certificates by completing habit milestones
        </p>
      </div>
      
      {earnedCerts.length > 0 ? (
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
            Earned Certificates ({earnedCerts.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {earnedCerts.map((cert, idx) => (
              <CertificateCard
                key={idx}
                certificate={cert}
                compact={false}
              />
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownloadAll}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
                color: 'var(--text)',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              📥 Download All
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
                color: 'var(--text)',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              📤 Share Progress
            </motion.button>
          </div>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            marginBottom: '48px'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
            No certificates yet
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Complete habits consistently to earn certificates!
          </p>
        </div>
      )}
      
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
          All Certifications
        </h2>
        <div style={{ display: 'grid', gap: '16px' }}>
          {progress.map((cert) => {
            const isEarned = earnedCerts.some(ec => ec.certification.id === cert.id);
            
            return (
              <div
                key={cert.id}
                style={{
                  backgroundColor: isEarned ? `${cert.color}10` : 'var(--surface)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: isEarned ? `1px solid ${cert.color}` : '1px solid var(--border)',
                  opacity: isEarned ? 1 : 0.7
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      backgroundColor: isEarned ? `${cert.color}20` : 'var(--bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px'
                    }}
                  >
                    {isEarned ? cert.badge : '🔒'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                      {cert.name}
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {cert.description}
                    </p>
                  </div>
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {cert.current} / {cert.target} days
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {Math.round(cert.percentage)}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: '6px',
                      backgroundColor: 'var(--border)',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${cert.percentage}%`,
                        backgroundColor: isEarned ? cert.color : 'var(--primary)',
                        borderRadius: '3px'
                      }}
                    />
                  </div>
                </div>
                
                {cert.bestHabit && (
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Best: {cert.bestHabit}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CertificationsPage;