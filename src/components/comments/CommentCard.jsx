import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { deleteComment } from '../../services/api';
import './CommentCard.css';

const CommentCard = ({ comment, onCommentDeleted }) => {
    const { user } = useUser();
    const [isDeleting, setIsDeleting] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleDeleteComment = async () => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await deleteComment(comment.cid);
            
            if (response.success) {
                onCommentDeleted(comment.cid);
            } else {
                console.error('Error al eliminar comentario:', response.e);
                alert('Error al eliminar el comentario');
            }
        } catch (error) {
            console.error('Error al eliminar comentario:', error);
            alert('Error al eliminar el comentario');
        } finally {
            setIsDeleting(false);
        }
    };

    const canDeleteComment = () => {
        return user && (
            user.uid === comment.user._id || 
            user.uid === comment.user.uid ||
            user.role === 'ADMIN'
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const getMediaUrl = (mediaPath) => {
        if (!mediaPath) return null;
        
        if (mediaPath.startsWith('http')) {
            return mediaPath;
        }
        
        return `http://localhost:3020/BLFAGS/v1/uploads/comments/${mediaPath}`;
    };

    return (
        <div className="comment-item">
            <div className="comment-user-info">
                <img
                    src={comment.user?.profilePicture || `https://ui-avatars.com/api/?name=${comment.user?.username || 'U'}`}
                    alt={comment.user?.username || 'Usuario'}
                    className="comment-avatar"
                />
                <span className="comment-username">@{comment.user?.username || 'Usuario'}</span>
                <span className="comment-date">{formatDate(comment.createdAt)}</span>
                
                {canDeleteComment() && (
                    <button 
                        className="comment-delete-btn"
                        onClick={handleDeleteComment}
                        disabled={isDeleting}
                        title="Eliminar comentario"
                    >
                        {isDeleting ? '...' : '🗑️'}
                    </button>
                )}
            </div>
            
            {comment.text && (
                <div className="comment-text">{comment.text}</div>
            )}
            
            {comment.media && !imageError && (
                <div className="comment-media-container">
                    {/\.(mp4|webm|ogg)$/i.test(comment.media) ? (
                        <video 
                            src={getMediaUrl(comment.media)}
                            controls 
                            className="comment-media"
                            onError={handleImageError}
                        />
                    ) : (
                        <img 
                            src={getMediaUrl(comment.media)}
                            alt="Comentario multimedia" 
                            className="comment-media"
                            onError={handleImageError}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default CommentCard;
