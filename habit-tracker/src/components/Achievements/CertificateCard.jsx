import { motion } from 'framer-motion';
import { loadProfile } from '../../utils/profileUtils';

const CertificateCard = ({ certificate, compact = false }) => {
  const profile = loadProfile();
  const { certification, habitName, date, userName } = certificate;
  
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  if (compact) {
    return (
      <div
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '16px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          border: `1px solid ${certification.color}40`
        }}
      >
        <div
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            backgroundColor: `${certification.color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px'
          }}
        >
          {certification.badge}
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
            {certification.name}
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            {habitName} • {formatDate(date)}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '32px',
        border: `3px solid ${certification.color}`,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 4px 20px ${certification.color}30`
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(45deg, ${certification.color}10 25%, transparent 25%),
            linear-gradient(-45deg, ${certification.color}10 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, ${certification.color}10 75%),
            linear-gradient(-45deg, transparent 75%, ${certification.color}10 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          opacity: 0.3
        }}
      />
      
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '14px', color: certification.color, fontWeight: '600', letterSpacing: '2px' }}>
            HabitFlow
          </span>
        </div>
        
        <h2 style={{ 
          fontSize: '28px', 
          fontWeight: '700', 
          color: certification.color,
          marginBottom: '16px',
          fontFamily: 'Georgia, serif'
        }}>
          Certificate of Achievement
        </h2>
        
        <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
          This certifies that
        </p>
        
        <h3 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          marginBottom: '20px',
          fontFamily: 'cursive',
          color: '#1a1a1a'
        }}>
          {userName || profile.name || 'User'}
        </h3>
        
        <p style={{ color: '#666', marginBottom: '8px', fontSize: '14px' }}>
          has successfully completed
        </p>
        
        <h4 style={{ 
          fontSize: '22px', 
          fontWeight: '600', 
          color: certification.color,
          marginBottom: '16px'
        }}>
          {certification.name}
        </h4>
        
        <div style={{ 
          display: 'inline-block', 
          padding: '8px 20px', 
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          {habitName}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
          <div style={{ fontSize: '48px' }}>{certification.badge}</div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>Date Earned</p>
            <p style={{ fontSize: '14px', fontWeight: '600', margin: 0 }}>{formatDate(date)}</p>
          </div>
        </div>
        
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
          <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
            HabitFlow Official Certificate
          </p>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            backgroundColor: 'transparent',
            color: 'var(--text)',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          📥 Download
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            backgroundColor: 'transparent',
            color: 'var(--text)',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          📤 Share
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CertificateCard;