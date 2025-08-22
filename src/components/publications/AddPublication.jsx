import React, { useState } from 'react';
import { Plus, Image, X } from 'lucide-react';
import { addPublications } from '../../services/api';
import { usePublicationsRefresh } from '../../contexts/PublicationsRefreshContext';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import './AddPublication.css';

export const AddPublication = ({ onPublicationAdded, isOwnProfile = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        visibility: 'public'
    });
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { onPublicationAdded: triggerGlobalRefresh } = usePublicationsRefresh();

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    const getCurrentUserId = () => {
        return currentUser.user?.uid || currentUser.user?._id || currentUser._id || currentUser.uid;
    };

    if (!isOwnProfile) {
        return null;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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

            setMediaFile(file);
            setError('');

            const reader = new FileReader();
            reader.onload = (e) => {
                setMediaPreview({
                    url: e.target.result,
                    type: file.type.startsWith('image/') ? 'image' : 'video'
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const removeMedia = () => {
        setMediaFile(null);
        setMediaPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title.trim() || !formData.description.trim()) {
            setError('El título y la descripción son obligatorios');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const submitData = new FormData();
            submitData.append('title', formData.title.trim());
            submitData.append('description', formData.description.trim());
            submitData.append('user', getCurrentUserId());
            submitData.append('visibility', formData.visibility);
            
            if (mediaFile) {
                submitData.append('media', mediaFile);
            }

            const response = await addPublications(submitData);

            if (response.error) {
                throw new Error(response.e?.response?.data?.message || 'Error al crear la publicación');
            }

            setFormData({
                title: '',
                description: '',
                visibility: 'public'
            });
            setMediaFile(null);
            setMediaPreview(null);
            setIsOpen(false);

            if (onPublicationAdded) {
                onPublicationAdded();
            }
            
            triggerGlobalRefresh();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            visibility: 'public'
        });
        setMediaFile(null);
        setMediaPreview(null);
        setError('');
    };

    const handleClose = () => {
        setIsOpen(false);
        resetForm();
    };

    return (
        <div className="add-publication-container">
            {!isOpen ? (
                <button 
                    className="add-publication-trigger"
                    onClick={() => setIsOpen(true)}
                >
                    <Plus size={20} />
                    Crear Publicación
                </button>
            ) : (
                <div className="add-publication-form-container">
                    <div className="form-header">
                        <h3>Crear Nueva Publicación</h3>
                        <button 
                            className="close-button"
                            onClick={handleClose}
                            type="button"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="add-publication-form">
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="title">Título *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Escribe el título de tu publicación"
                                maxLength={200}
                                required
                            />
                            <small>{formData.title.length}/200 caracteres</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Descripción *</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="¿Qué quieres compartir?"
                                maxLength={1000}
                                rows={4}
                                required
                            />
                            <small>{formData.description.length}/1000 caracteres</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="visibility">Visibilidad</label>
                            <select
                                id="visibility"
                                name="visibility"
                                value={formData.visibility}
                                onChange={handleInputChange}
                            >
                                <option value="public">Pública</option>
                                <option value="private">Privada</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="media">Multimedia (opcional)</label>
                            <div className="media-input-container">
                                <input
                                    type="file"
                                    id="media"
                                    accept="image/*,video/*"
                                    onChange={handleMediaChange}
                                    style={{ display: 'none' }}
                                />
                                <button
                                    type="button"
                                    className="media-button"
                                    onClick={() => document.getElementById('media').click()}
                                >
                                    <Image size={20} />
                                    Agregar imagen o video
                                </button>
                            </div>

                            {mediaPreview && (
                                <div className="media-preview">
                                    <div className="media-preview-header">
                                        <span>Vista previa:</span>
                                        <button
                                            type="button"
                                            className="remove-media"
                                            onClick={removeMedia}
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
                                {loading ? <LoadingSpinner size="small" /> : 'Publicar'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};
