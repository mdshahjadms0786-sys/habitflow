import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveRecentEmojis, loadRecentEmojis } from '../../utils/db';

const EMOJI_CATEGORIES = {
  All: ['🏃', '🚶', '🧘', '💪', '🤸', '⛹', '🚴', '🏊', '🎯', '🎮', '🎨', '🎭', '🎬', '🎤', '🎵', '🎸', '💊', '🏥', '🩺', '💉', '🧬', '🫀', '🧠', '🦷', '👁', '💆', '🛁', '😴', '🥗', '🥤', '🍎', '🥑', '🥦', '🍳', '☕', '🍵', '💧', '🧃', '🥛', '🍌', '🍇', '🥕', '🌽', '🥜', '🌿', '🌱', '🌳', '🌸', '🌞', '🌙', '⭐', '🌟', '🔥', '❄️', '🌈', '🍃', '🌻', '🦋', '📚', '📖', '✏️', '📝', '💡', '🔬', '🔭', '💻', '📱', '⌚', '🎒', '📊', '📈', '🗓', '⭐', '💫', '✨', '🎯', '🏆', '🥇', '🎖', '🔑', '❤️', '💪', '✅', '🚀', '💯', '🙏'],
  Activities: ['🏃', '🚶', '🧘', '💪', '🤸', '⛹', '🚴', '🏊', '🎯', '🎮', '🎨', '🎭', '🎬', '🎤', '🎵', '🎸'],
  Health: ['💊', '🏥', '🩺', '💉', '🧬', '🫀', '🧠', '🦷', '👁', '💆', '🛁', '😴', '🥗', '🥤'],
  Food: ['🍎', '🥑', '🥦', '🍳', '☕', '🍵', '💧', '🧃', '🥛', '🍌', '🍇', '🥕', '🌽', '🥜'],
  Nature: ['🌿', '🌱', '🌳', '🌸', '🌞', '🌙', '⭐', '🌟', '🔥', '❄️', '🌈', '🍃', '🌻', '🦋'],
  Objects: ['📚', '📖', '✏️', '📝', '💡', '🔬', '🔭', '💻', '📱', '⌚', '🎒', '📊', '📈', '🗓'],
  Symbols: ['⭐', '💫', '✨', '🎯', '🏆', '🥇', '🎖', '🔑', '❤️', '💪', '✅', '🚀', '💯', '🙏'],
};

const CATEGORY_LABELS = {
  All: 'All',
  Activities: 'Activities 🏃',
  Health: 'Health 💊',
  Food: 'Food 🍎',
  Nature: 'Nature 🌿',
  Objects: 'Objects 📦',
  Symbols: 'Symbols ⭐',
};

const MAX_RECENT = 8;

export const EmojiPicker = ({ onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [recentEmojis, setRecentEmojis] = useState([]);
  const pickerRef = useRef(null);

  useEffect(() => {
    setRecentEmojis(loadRecentEmojis());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSelect = (emoji) => {
    const updatedRecent = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, MAX_RECENT);
    setRecentEmojis(updatedRecent);
    saveRecentEmojis(updatedRecent);
    onSelect(emoji);
  };

  const filteredEmojis = searchTerm
    ? Object.values(EMOJI_CATEGORIES).flat().filter((emoji, idx, arr) => arr.indexOf(emoji) === idx)
    : EMOJI_CATEGORIES[activeCategory] || [];

  const searchResults = searchTerm
    ? Object.values(EMOJI_CATEGORIES).flat().filter((emoji, idx, arr) => arr.indexOf(emoji) === idx)
    : [];

  const displayEmojis = searchTerm ? searchResults : filteredEmojis;

  return (
    <motion.div
      ref={pickerRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15 }}
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        zIndex: 100,
        marginTop: '8px',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '16px',
        width: '320px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      }}
    >
      <input
        type="text"
        placeholder="Search emojis..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: '14px',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          backgroundColor: 'var(--bg)',
          color: 'var(--text)',
          boxSizing: 'border-box',
          marginBottom: '12px',
        }}
      />

      {!searchTerm && recentEmojis.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '500' }}>
            Recent
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '4px' }}>
            {recentEmojis.map((emoji, idx) => (
              <button
                key={`recent-${idx}`}
                onClick={() => handleSelect(emoji)}
                style={{
                  width: '32px',
                  height: '32px',
                  fontSize: '18px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--hover-bg)')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {!searchTerm && (
        <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {Object.keys(EMOJI_CATEGORIES).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                padding: '6px 10px',
                fontSize: '12px',
                backgroundColor: activeCategory === category ? 'var(--primary)' : 'var(--bg)',
                color: activeCategory === category ? '#fff' : 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              {CATEGORY_LABELS[category]}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '4px', maxHeight: '200px', overflowY: 'auto' }}>
        {displayEmojis.map((emoji, idx) => (
          <button
            key={`${emoji}-${idx}`}
            onClick={() => handleSelect(emoji)}
            style={{
              width: '36px',
              height: '36px',
              fontSize: '20px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--hover-bg)')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
          >
            {emoji}
          </button>
        ))}
      </div>

      {searchTerm && displayEmojis.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px', padding: '20px' }}>
          No emojis found
        </div>
      )}
    </motion.div>
  );
};

export default EmojiPicker;