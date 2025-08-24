import React from 'react';
import CommentCard from './CommentCard';
import AddComment from './AddComment';
import { useComments } from '../../shared/hooks/useComments';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import './CommentsList.css';

const CommentsList = ({ 
    publicationId, 
    publication = null, 
    showAddComment = true 
}) => {
    const {
        comments,
        loading,
        error,
        canAddComment,
        refreshComments
    } = useComments(publicationId);

    const handleCommentAdded = (newComment) => {
        refreshComments();
    };

    const handleCommentDeleted = (commentId) => {
        refreshComments();
    };

    const showAddCommentForm = showAddComment && canAddComment(publication);

    if (loading) {
        return (
            <div className="comments-loading">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="publication-comments">
            <div className="comments-header">
                <h4 className="comments-title">Comentarios ({comments.length})</h4>
                <button 
                    onClick={refreshComments}
                    className="comments-refresh-btn"
                    title="Actualizar comentarios"
                >
                    🔄
                </button>
            </div>

            {showAddCommentForm && (
                <AddComment 
                    publicationId={publicationId}
                    onCommentAdded={handleCommentAdded}
                />
            )}

            {error && (
                <div className="comments-error">
                    <p>{error}</p>
                    <button 
                        onClick={refreshComments}
                        className="comments-retry-btn"
                    >
                        Reintentar
                    </button>
                </div>
            )}

            <div className="comments-list">
                {comments.length === 0 ? (
                    <div className="comments-empty">
                        <p>No hay comentarios aún</p>
                        {showAddCommentForm && (
                            <p className="comments-empty-suggestion">
                                ¡Sé el primero en comentar!
                            </p>
                        )}
                    </div>
                ) : (
                    comments.map(comment => (
                        <CommentCard
                            key={comment.cid}
                            comment={comment}
                            onCommentDeleted={handleCommentDeleted}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentsList;
