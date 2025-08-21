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

    const isVideo = /\.(mp4|webm|ogg)$/i.test(publication.media);
    return (
      <div className="publication-media">
        {isVideo ? (
          <video
            src={publication.media}
            controls
            className="publication-video"
            onError={handleImageError}
          />
        ) : (
          <img
            src={publication.media}
            alt={publication.title}
            onError={handleImageError}
            className="publication-image"
          />
        )}
      </div>
    );
  };
  const renderComments = () => {
    if (!publication.comments || publication.comments.length === 0) return null;
    return (
      <div className="publication-comments">
        <h4 className="comments-title">Comentarios</h4>
        {publication.comments.map((comment) => (
          <div className="comment-item" key={comment._id || comment.cid}>
            <div className="comment-user-info">
              <img
                src={comment.user?.profilePicture || `https://ui-avatars.com/api/?name=${comment.user?.username || 'U'}`}
                alt={comment.user?.username || 'Usuario'}
                className="comment-avatar"
              />
              <span className="comment-username">@{comment.user?.username || 'Usuario'}</span>
              <span className="comment-date">{formatDate(comment.createdAt)}</span>
            </div>
            {comment.text && (
              <div className="comment-text">{comment.text}</div>
            )}
            {comment.media && (
              <div style={{ marginLeft: '38px', marginTop: '8px' }}>
                {/\.(mp4|webm|ogg)$/i.test(comment.media) ? (
                  <video 
                    src={comment.media} 
                    controls 
                    className="comment-media"
                    style={{ 
                      maxWidth: '350px', 
                      maxHeight: '250px', 
                      width: 'auto',
                      height: 'auto',
                      borderRadius: '12px',
                      objectFit: 'cover'
                    }} 
                  />
                ) : (
                  <img 
                    src={comment.media} 
                    alt="media" 
                    className="comment-media"
                    style={{ 
                      maxWidth: '350px', 
                      maxHeight: '250px', 
                      width: 'auto',
                      height: 'auto',
                      borderRadius: '12px',
                      objectFit: 'cover'
                    }} 
                  />
                )}
              </div>
            )}
          </div>
        ))}
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
          <img
            src={publication.user?.profilePicture || 'https://ui-avatars.com/api/?name=' + (publication.user?.username || 'U')}
            alt={publication.user?.username || 'Usuario'}
            className="user-avatar"
            style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e0e0e0', background: '#f5f5f5' }}
          />
          <div className="user-details">
            <span className="username">@{publication.user?.username || 'Usuario'}</span>
            <span className="publication-date">{formatDate(publication.createdAt)}</span>
          </div>
        </div>
        <div className="visibility-indicator">
          <span className={`visibility ${publication.visibility}`}>
            {publication.visibility === 'public' ? '🌍' : '🔒'}
          </span>
        </div>
      </div>

      {/* Renderizar media después del contenido de texto */}
      <div className="media-container">
        {renderMedia()}
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
          </div>
        )}

        {/* Hashtags */}
        {renderHashtags()}
      </div>

      {/* Footer con estadísticas */}
      <div className="publication-footer">
        {renderStats()}
      </div>

      {/* Comentarios al final */}
      {renderComments()}
    </div>
  );
};
