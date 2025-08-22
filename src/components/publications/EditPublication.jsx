import React, { useState, useEffect } from 'react';
import { X, Image } from 'lucide-react';
import { updatePublication } from '../../services/api';
import { usePublicationsRefresh } from '../../contexts/PublicationsRefreshContext';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { validateText } from '../../shared/validators/validateText';
import toast from 'react-hot-toast';
import './EditPublication.css';

export const EditPublication = ({ 
    publication, 
    isOpen, 
    onClose, 
    onPublicationUpdated 
}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        visibility: 'public'
    });
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [keepCurrentMedia, setKeepCurrentMedia] = useState(true);
    const { onPublicationUpdated: triggerGlobalRefresh } = usePublicationsRefresh();

    useEffect(() => {
        if (publication && isOpen) {
            setFormData({
                title: publication.title || '',
                description: publication.description || '',
                visibility: publication.visibility || 'public'
            });
            setKeepCurrentMedia(!!publication.media);
            setMediaFile(null);
            setMediaPreview(null);
            setError('');
        }
    }, [publication, isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];
            if (!validTypes.includes(file.type)) {
                setError('Tipo de archivo no válido. Solo se permiten imágenes (JPEG, PNG, GIF) y videos (MP4, WebM)');
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                setError('El archivo es demasiado grande. Máximo 10MB');
                return;
            }

            setError('');
            setMediaFile(file);
            setKeepCurrentMedia(false);

            const reader = new FileReader();
            reader.onload = (e) => {
                const isVideo = file.type.startsWith('video/');
                setMediaPreview({
                    url: e.target.result,
                    type: isVideo ? 'video' : 'image'
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const removeNewMedia = () => {
        setMediaFile(null);
        setMediaPreview(null);
        if (publication.media) {
            setKeepCurrentMedia(true);
        }
    };

    const removeCurrentMedia = () => {
        setKeepCurrentMedia(false);
        setMediaFile(null);
        setMediaPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateText(formData.title.trim())) {
            setError('El título es obligatorio');
            return;
        }

        if (!validateText(formData.description.trim())) {
            setError('La descripción es obligatoria');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const submitData = new FormData();
            submitData.append('title', formData.title.trim());
            submitData.append('description', formData.description.trim());
            submitData.append('visibility', formData.visibility);

            if (mediaFile) {
                submitData.append('media', mediaFile);
            }
            else if (!keepCurrentMedia) {
                submitData.append('removeMedia', 'true');
            }

            const publicationId = publication.pid || publication._id;
            const result = await updatePublication(publicationId, submitData);

            if (result.error) {
                setError(result.e?.response?.data?.message || 'Error al actualizar la publicación');
                return;
            }

            toast.success('Publicación actualizada exitosamente');
            
            if (onPublicationUpdated) {
                onPublicationUpdated(result.publication);
            }
            
            triggerGlobalRefresh();
            
            handleClose();

        } catch (err) {
            console.error('Error updating publication:', err);
            setError('Error al actualizar la publicación');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            title: '',
            description: '',
            visibility: 'public'
        });
        setMediaFile(null);
        setMediaPreview(null);
        setKeepCurrentMedia(true);
        setError('');
        onClose();
    };

    const getCurrentMediaPreview = () => {
        if (!publication.media || !keepCurrentMedia) return null;

        const isVideo = /\.(mp4|webm|ogg)$/i.test(publication.media);
        return (
            <div className="current-media-preview">
                <div className="media-preview-header">
                    <span>Multimedia actual:</span>
                    <button
                        type="button"
                        className="remove-media"
                        onClick={removeCurrentMedia}
                        title="Eliminar multimedia actual"
                    >
                        <X size={16} />
                    </button>
                </div>
                {isVideo ? (
                    <video 
                        src={publication.media} 
                        className="preview-video"
                        controls
                    />
                ) : (
                    <img 
                        src={publication.media} 
                        alt="Multimedia actual" 
                        className="preview-image"
                    />
                )}
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="edit-publication-overlay">
            <div className="edit-publication-modal">
                <div className="modal-header">
                    <h3>Editar Publicación</h3>
                    <button 
                        className="close-button"
                        onClick={handleClose}
                        type="button"
                        disabled={loading}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="edit-publication-form">
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="edit-title">Título *</label>
                        <input
                            type="text"
                            id="edit-title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Escribe el título de tu publicación"
                            maxLength={200}
                            required
                            disabled={loading}
                        />
                        <small>{formData.title.length}/200 caracteres</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="edit-description">Descripción *</label>
                        <textarea
                            id="edit-description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="¿Qué quieres compartir?"
                            maxLength={1000}
                            rows={4}
                            required
                            disabled={loading}
                        />
                        <small>{formData.description.length}/1000 caracteres</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="edit-visibility">Visibilidad</label>
                        <select
                            id="edit-visibility"
                            name="visibility"
                            value={formData.visibility}
                            onChange={handleInputChange}
                            disabled={loading}
                        >
                            <option value="public">Pública</option>
                            <option value="private">Privada</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Multimedia</label>
                        
                        {getCurrentMediaPreview()}

                        <div className="media-input-container">
                            <input
                                type="file"
                                id="edit-media"
                                accept="image/*,video/*"
                                onChange={handleMediaChange}
                                style={{ display: 'none' }}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="media-button"
                                onClick={() => document.getElementById('edit-media').click()}
                                disabled={loading}
                            >
                                <Image size={20} />
                                {mediaFile ? 'Cambiar multimedia' : 'Agregar nueva multimedia'}
                            </button>
                        </div>

                        {mediaPreview && (
                            <div className="media-preview">
                                <div className="media-preview-header">
                                    <span>Nueva multimedia:</span>
                                    <button
                                        type="button"
                                        className="remove-media"
                                        onClick={removeNewMedia}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                {mediaPreview.type === 'image' ? (
                                    <img 
                                        src={mediaPreview.url} 
                                        alt="Preview" 
                                        className="preview-image"
                                    />
                                ) : (
                                    <video 
                                        src={mediaPreview.url} 
                                        className="preview-video"
                                        controls
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading || !formData.title.trim() || !formData.description.trim()}
                        >
                            {loading ? <LoadingSpinner size="small" /> : 'Actualizar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
