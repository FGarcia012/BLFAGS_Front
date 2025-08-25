import React, { useState } from "react";
import { PublicationReactions } from "./PublicationReactions";
import { validateText } from "../../shared/validators/validateText";
import { PublicationActions } from "./PublicationActions";
import { CommentsList, CommentsToggle } from "../comments";
import "./PublicationCard.css";

export const PublicationCard = ({ 
  publication, 
  onSelect, 
  isSelected = false, 
  onEdit,
  onDelete 
}) => {
  const [mediaError, setMediaError] = useState(false);
  const [showComments, setShowComments] = useState(false);

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
    return (
      <div className="publication-comments-section">
        {showComments && (
          <CommentsList 
            publicationId={publication.pid || publication._id}
            publication={publication}
            showAddComment={true}
          />
        )}
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
    let totalReactions = 0;
    if (publication.reactionCount && typeof publication.reactionCount.total === 'number') {
      totalReactions = publication.reactionCount.total;
    }
    return (
      <div className="publication-stats" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="stat-item" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="stat-icon" style={{ fontSize: 20 }}>⭐</span>
          <span className="stat-count">{totalReactions}</span>
        </div>
        <PublicationReactions publicationId={publication.pid || publication._id} />
        <CommentsToggle 
          publicationId={publication.pid || publication._id}
          onToggle={setShowComments}
          showCount={true}
        />
      </div>
    );
  };

  return (
    <div 
      className={`publication-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect && onSelect(publication)}
    >
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
        <div className="header-actions">
          <div className="visibility-indicator">
            <span className={`visibility ${publication.visibility}`}>
              {publication.visibility === 'public' ? '🌍' : '🔒'}
            </span>
          </div>
          <PublicationActions 
            publication={publication}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      </div>

      <div className="media-container">
        {renderMedia()}
      </div>

      <div className="publication-content">
        {publication.title && (
          <h3 className="publication-title">
            {validateText(publication.title) ? publication.title : 'Título no disponible'}
          </h3>
        )}

        {publication.description && (
          <div>
            <p className="publication-description">
              {validateText(publication.description) ? publication.description : 'Descripción no disponible'}
            </p>
          </div>
        )}

        {renderHashtags()}
      </div>

      <div className="publication-footer">
        {renderStats()}
      </div>

      {renderComments()}
    </div>
  );
};

export default PublicationCard;
