import React, { useState, useEffect } from 'react';
import { getCommentsByPublication } from '../../services/api';
import './CommentsToggle.css';

const CommentsToggle = ({ publicationId, onToggle, showCount = true }) => {
    const [commentsCount, setCommentsCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (showCount) {
            loadCommentsCount();
        }
    }, [publicationId, showCount]);

    const loadCommentsCount = async () => {
        if (!publicationId) return;
        
        setLoading(true);
        try {
            const response = await getCommentsByPublication(publicationId);
            if (response.success) {
                setCommentsCount(response.comments?.length || 0);
            } else {
                setCommentsCount(0);
            }
        } catch (error) {
            console.error('Error al cargar conteo de comentarios:', error);
            setCommentsCount(0);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = () => {
        const newVisibility = !isVisible;
        setIsVisible(newVisibility);
        if (onToggle) {
            onToggle(newVisibility);
        }
    };

    const refreshCount = () => {
        if (showCount) {
            loadCommentsCount();
        }
    };

    return (
        <div className="comments-toggle">
            <button 
                onClick={handleToggle}
                className={`comments-toggle-btn ${isVisible ? 'active' : ''}`}
                disabled={loading}
            >
                <span className="comments-toggle-icon">
                    💬
                </span>
                {showCount && (
                    <span className="comments-toggle-text">
                        {loading ? '...' : `${commentsCount} comentario${commentsCount !== 1 ? 's' : ''}`}
                    </span>
                )}
                {!showCount && (
                    <span className="comments-toggle-text">
                        {isVisible ? 'Ocultar comentarios' : 'Ver comentarios'}
                    </span>
                )}
            </button>
            
            {showCount && !loading && (
                <button 
                    onClick={refreshCount}
                    className="comments-refresh-small"
                    title="Actualizar conteo"
                >
                    🔄
                </button>
            )}
        </div>
    );
};

export default CommentsToggle;
