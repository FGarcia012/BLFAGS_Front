import React, { useState } from 'react';
import { CommentsList, CommentsToggle } from '../comments';
import './PublicationWithComments.css';

const PublicationWithComments = ({ publication, showCommentsInitially = false }) => {
    const [showComments, setShowComments] = useState(showCommentsInitially);

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
        if (!publication.media) return null;

        const isVideo = /\.(mp4|webm|ogg)$/i.test(publication.media);
        const mediaUrl = publication.media.startsWith('http') 
            ? publication.media 
            : `https://blfags-back.vercel.app/BLFAGS/v1/uploads/publications/${publication.media}`;

        return (
            <div className="publication-media">
                {isVideo ? (
                    <video
                        src={mediaUrl}
                        controls
                        className="publication-video"
                    />
                ) : (
                    <img
                        src={mediaUrl}
                        alt={publication.title}
                        className="publication-image"
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
                    <span key={hashtag._id || hashtag.hid} className="hashtag">
                        #{hashtag.name}
                    </span>
                ))}
            </div>
        );
    };

    const renderStats = () => {
        const { reactionCount = {} } = publication;
        const totalReactions = reactionCount.total || 0;

        return (
            <div className="publication-stats">
                <div className="stat-item">
                    <span className="stat-icon">❤️</span>
                    <span className="stat-count">{totalReactions}</span>
                </div>
                <CommentsToggle 
                    publicationId={publication.pid || publication._id}
                    onToggle={setShowComments}
                    showCount={true}
                />
            </div>
        );
    };

    return (
        <article className="publication-with-comments">
            {/* Header de la publicación */}
            <div className="publication-header">
                <div className="user-info">
                    <img
                        src={publication.user?.profilePicture || '/default-avatar.png'}
                        alt={publication.user?.username || 'Usuario'}
                        className="user-avatar"
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
                </div>
            </div>

            {/* Media de la publicación */}
            {renderMedia()}

            {/* Contenido de la publicación */}
            <div className="publication-content">
                {publication.title && (
                    <h3 className="publication-title">
                        {publication.title}
                    </h3>
                )}

                {publication.description && (
                    <p className="publication-description">
                        {publication.description}
                    </p>
                )}

                {renderHashtags()}
            </div>

            {/* Footer con estadísticas y toggle de comentarios */}
            <div className="publication-footer">
                {renderStats()}
            </div>

            {/* Sección de comentarios */}
            {showComments && (
                <CommentsList 
                    publicationId={publication.pid || publication._id}
                    showAddComment={true}
                />
            )}
        </article>
    );
};

export default PublicationWithComments;
