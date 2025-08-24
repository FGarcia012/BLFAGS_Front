import { useReactions } from '../../shared/hooks/useReactions';
import { useState } from 'react';
function isAuthenticated() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return !!(user && user.token);
  } catch {
    return false;
  }
}

const reactionTypes = [
  { type: 'like', icon: '❤️', label: 'Me gusta', color: '#ff4d4f' },
  { type: 'love', icon: '😍', label: 'Me encanta', color: '#ff85c0' },
  { type: 'laugh', icon: '😂', label: 'Me divierte', color: '#ffd666' },
  { type: 'sad', icon: '😢', label: 'Me entristece', color: '#69c0ff' },
  { type: 'angry', icon: '😡', label: 'Me enoja', color: '#ff7875' }
];

export function PublicationReactions({ publicationId }) {
  const {
    userReaction,
    counts,
    handleAddReaction,
    handleRemoveReaction,
    loading,
    error
  } = useReactions(publicationId);
  const [showWarning, setShowWarning] = useState(false);
    if (error) {
      console.error('Error en useReactions:', error);
    }

  const handleReactionClick = (type) => {
    if (loading) return;
    if (!isAuthenticated()) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 2500);
      return;
    }
      if (userReaction === type) {
        handleRemoveReaction();
      } else {
        handleAddReaction(type);
      }
  };

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', position: 'relative' }}>
      {reactionTypes.map(r => {
        const isActive = userReaction === r.type;
        return (
          <button
            key={r.type}
            onClick={() => handleReactionClick(r.type)}
            style={{
              background: isActive ? r.color : '#f7f7f7',
              color: isActive ? '#222' : '#888',
              border: isActive ? `2px solid ${r.color}` : '2px solid #e0e0e0',
              fontWeight: isActive ? 700 : 500,
              fontSize: 20,
              cursor: loading ? 'not-allowed' : 'pointer',
              borderRadius: 20,
              padding: '4px 16px 4px 10px',
              boxShadow: isActive ? '0 2px 8px 0 rgba(0,0,0,0.08)' : 'none',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.18s',
              opacity: loading ? 0.7 : 1,
              minWidth: 44
            }}
            aria-label={r.label}
            disabled={loading}
          >
            <span style={{ fontSize: 22 }}>{r.icon}</span>
            <span style={{ fontSize: 16 }}>{counts?.[r.type] || 0}</span>
          </button>
        );
      })}
      {showWarning && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '-38px',
          transform: 'translateX(-50%)',
          background: '#fffbe6',
          color: '#ad6800',
          border: '1px solid #ffe58f',
          borderRadius: 8,
          padding: '7px 18px',
          fontSize: 15,
          fontWeight: 500,
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
          zIndex: 10
        }}>
          No puedes reaccionar ya que no posees una cuenta registrada
        </div>
      )}
      {error && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '-70px',
          transform: 'translateX(-50%)',
          background: '#fff1f0',
          color: '#cf1322',
          border: '1px solid #ffa39e',
          borderRadius: 8,
          padding: '7px 18px',
          fontSize: 15,
          fontWeight: 500,
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
          zIndex: 11
        }}>
          Error: {error.message || 'Ocurrió un error al procesar la reacción'}
        </div>
      )}
    </div>
  );
}
