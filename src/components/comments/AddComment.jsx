import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { addComments } from '../../services/api';
import './AddComment.css';

const AddComment = ({ publicationId, onCommentAdded }) => {
    const { user } = useUser();
    const [text, setText] = useState('');
    const [media, setMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMedia(file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setMediaPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeMedia = () => {
        setMedia(null);
        setMediaPreview(null);
        const fileInput = document.getElementById('comment-media-input');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!text.trim() && !media) {
            alert('Debes escribir un comentario o adjuntar una imagen');
            return;
        }

        if (text.length > 500) {
            alert('El comentario no puede exceder 500 caracteres');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('text', text.trim());
            formData.append('publication', publicationId);
            formData.append('user', user.uid);
            
            if (media) {
                formData.append('media', media);
            }

            const response = await addComments(formData);
            
            if (response.success) {
                setText('');
                setMedia(null);
                setMediaPreview(null);
                
                const fileInput = document.getElementById('comment-media-input');
                if (fileInput) {
                    fileInput.value = '';
                }
                
                onCommentAdded(response.comment);
            } else {
                console.error('Error al agregar comentario:', response.e);
                alert('Error al agregar el comentario');
            }
        } catch (error) {
            console.error('Error al agregar comentario:', error);
            alert('Error al agregar el comentario');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="add-comment-login-prompt">
                <p>Debes iniciar sesión para comentar</p>
            </div>
        );
    }

    return (
        <div className="add-comment">
            <div className="add-comment-header">
                <img 
                    src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.username || user.name || 'U'}`}
                    alt="Tu avatar" 
                    className="add-comment-avatar"
                />
                <h3>Agregar comentario</h3>
            </div>

            <form onSubmit={handleSubmit} className="add-comment-form">
                <div className="add-comment-input-container">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Escribe tu comentario..."
                        className="add-comment-textarea"
                        maxLength={500}
                        rows={3}
                    />
                    <div className="add-comment-char-count">
                        {text.length}/500
                    </div>
                </div>

                {mediaPreview && (
                    <div className="add-comment-media-preview">
                        <img 
                            src={mediaPreview} 
                            alt="Vista previa" 
                            className="add-comment-preview-image"
                        />
                        <button 
                            type="button" 
                            onClick={removeMedia}
                            className="add-comment-remove-media"
                            title="Eliminar imagen"
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className="add-comment-actions">
                    <div className="add-comment-media-input">
                        <input
                            type="file"
                            id="comment-media-input"
                            accept="image/*"
                            onChange={handleMediaChange}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="comment-media-input" className="add-comment-media-btn">
                            📷 Adjuntar imagen
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting || (!text.trim() && !media)}
                        className="add-comment-submit-btn"
                    >
                        {isSubmitting ? 'Enviando...' : 'Comentar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddComment;
