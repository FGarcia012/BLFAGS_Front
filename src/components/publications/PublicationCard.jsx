import React, { useState } from "react";
import { validateText } from "../../shared/validators/validateText";

export const PublicationCard = ({ publication, onSelect, isSelected = false }) => {
  const [mediaError, setMediaError] = useState(false);

  const handleImageError = () => {
    setMediaError(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderMedia = () => {
    if (!publication.media || mediaError) return null;

    return (
      <div className="publication-media">
        <img
          src={publication.media}
          alt={publication.title}
          onError={handleImageError}
          className="publication-image"
        />
      </div>
    );
  };

  const renderHashtags = () => {
    if (!publication.hashtags || publication.hashtags.length === 0) return null;

    return (
      <div className="publication-hashtags">
        {publication.hashtags.map((hashtag) => (
          <span key={hashtag._id} className="hashtag">
            #{hashtag.name}
          </span>
        ))}
      </div>
    );
  };

  const renderStats = () => {
    const { reactionCount = {}, comments = [] } = publication;
    const totalReactions = reactionCount.total || 0;
    const commentsCount = comments.length || 0;

    return (
      <div className="publication-stats">
        <div className="stat-item">
          <span className="stat-icon">❤️</span>
          <span className="stat-count">{totalReactions}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">💬</span>
          <span className="stat-count">{commentsCount}</span>
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`publication-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect && onSelect(publication)}
    >
      {/* Header con usuario y fecha primero */}
      <div className="publication-header">
        <div className="user-info">
          {publication.user?.profilePicture && (
            <img
              src={publication.user.profilePicture}
              alt={publication.user.username}
              className="user-avatar"
            />
          )}
          <div className="user-details">
            <span className="username">@{publication.user?.username}</span>
            <span className="publication-date">{formatDate(publication.createdAt)}</span>
          </div>
        </div>
        <div className="visibility-indicator">
          <span className={`visibility ${publication.visibility}`}>
            {publication.visibility === 'public' ? '🌍' : '🔒'}
          </span>
        </div>
      </div>

      {/* Título de la publicación */}
      <div className="publication-content">
        {publication.title && (
          <h3 className="publication-title">
            {validateText(publication.title) ? publication.title : 'Título no disponible'}
          </h3>
        )}

        {/* Descripción */}
        {publication.description && (
          <div>
            <p className="publication-description">
              {validateText(publication.description) ? publication.description : 'Descripción no disponible'}
            </p>
            <button className="read-more-btn">
              Leer más
            </button>
          </div>
        )}

        {/* Hashtags */}
        {renderHashtags()}
      </div>

      {/* Renderizar media después del contenido de texto */}
      {renderMedia()}

      {/* Footer con estadísticas */}
      <div className="publication-footer">
        {renderStats()}
      </div>
    </div>
  );
};
