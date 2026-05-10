import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHANGELOG, markVersionAsRead } from '../../data/changelog';

const TYPE_STYLES = {
  new: { icon: '✨', color: '#22c55e', label: 'New' },
  improved: { icon: '⬆️', color: '#3b82f6', label: 'Improved' },
  fixed: { icon: '🔧', color: '#f59e0b', label: 'Fixed' }
};

const VERSION_COLORS = {
  major: '#8b5cf6',
  minor: '#3b82f6',
  patch: '#6b7280'
};

const ChangelogModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      markVersionAsRead();
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: '20px',
            padding: '24px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700' }}>📋 What's New</h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              ✕
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {CHANGELOG.map((release, idx) => (
              <div
                key={idx}
                style={{
                  borderRadius: '16px',
                  padding: '20px',
                  backgroundColor: 'var(--bg)',
                  border: `1px solid ${VERSION_COLORS[release.type]}40`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      backgroundColor: VERSION_COLORS[release.type],
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  >
                    v{release.version}
                  </span>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      backgroundColor: `${VERSION_COLORS[release.type]}20`,
                      color: VERSION_COLORS[release.type],
                      fontSize: '12px',
                      fontWeight: '500',
                      textTransform: 'uppercase'
                    }}
                  >
                    {release.type}
                  </span>
                </div>
                
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  {release.title}
                </h3>
                
                <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {release.changes.map((change, cidx) => {
                    const typeStyle = TYPE_STYLES[change.type] || TYPE_STYLES.new;
                    return (
                      <li
                        key={cidx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '14px'
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            backgroundColor: `${typeStyle.color}20`,
                            color: typeStyle.color,
                            fontSize: '11px'
                          }}
                        >
                          {typeStyle.icon} {typeStyle.label}
                        </span>
                        <span>{change.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChangelogModal;