import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Save, User } from 'lucide-react';
import { updateProfilePicture, getUserById } from '../../services/api';
import './UserSettings.css';

export const UserPhotoSettings = ({ userId, currentProfilePicture, onPhotoUpdate }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; 

    const validateFile = (file) => {
        if (!allowedTypes.includes(file.type)) {
            return 'Solo se permiten archivos JPG, JPEG y PNG';
        }
        if (file.size > maxSize) {
            return 'El archivo no puede ser mayor a 5MB';
        }
        return null;
    };

    const handleFileSelect = (file) => {
        const error = validateFile(file);
        if (error) {
            setMessage('❌ ' + error);
            return;
        }

        setSelectedFile(file);
        setMessage('');
        
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const clearSelection = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setMessage('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedFile || isSubmitting) return;

        setIsSubmitting(true);
        setMessage('');

        try {
            const formData = new FormData();
            formData.append('profilePicture', selectedFile);

            const response = await updateProfilePicture(userId, formData);
            
            if (response.success) {
                setMessage('✓ Foto de perfil actualizada correctamente');
                
                if (onPhotoUpdate && response.user?.profilePicture) {
                    onPhotoUpdate(response.user.profilePicture);
                }
                
                try {
                    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                    if (currentUser.user?.uid === userId || currentUser._id === userId) {
                        const updatedUser = {
                            ...currentUser,
                            user: currentUser.user ? {
                                ...currentUser.user,
                                profilePicture: response.user.profilePicture
                            } : { profilePicture: response.user.profilePicture },
                            profilePicture: response.user.profilePicture
                        };
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                    }
                } catch (localStorageError) {
                    console.warn('Error updating localStorage:', localStorageError);
                }
                
                clearSelection();
            } else {
                setMessage('❌ ' + (response.message || 'Error al actualizar la foto de perfil'));
            }
        } catch (error) {
            setMessage('❌ Error al actualizar la foto de perfil');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getProfilePictureUrl = () => {
        if (previewUrl) return previewUrl;
        if (currentProfilePicture) {
            if (currentProfilePicture.startsWith('http')) {
                return currentProfilePicture;
            }
            return `http://localhost:3020/${currentProfilePicture}`;
        }
        return null;
    };

    return (
        <div className="user-settings">
            <div className="settings-content">
                <form className="settings-form" onSubmit={handleSubmit}>
                    {message && (
                        <div style={{
                            padding: '12px',
                            marginBottom: '16px',
                            borderRadius: '6px',
                            background: message.includes('✓') ? '#dcfce7' : '#fee2e2',
                            color: message.includes('✓') ? '#16a34a' : '#dc2626',
                            border: `1px solid ${message.includes('✓') ? '#bbf7d0' : '#fecaca'}`
                        }}>
                            {message}
                        </div>
                    )}

                    {/* Foto actual */}
                    <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            margin: '0 auto 12px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            background: '#f3f4f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '3px solid #e5e7eb'
                        }}>
                            {getProfilePictureUrl() ? (
                                <img 
                                    src={getProfilePictureUrl()} 
                                    alt="Foto de perfil" 
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            ) : (
                                <User size={48} color="#9ca3af" />
                            )}
                        </div>
                        <p style={{ color: '#6b7280', fontSize: '14px' }}>
                            {previewUrl ? 'Nueva foto seleccionada' : 'Foto actual'}
                        </p>
                    </div>

                    {/* Zona de arrastrar y soltar */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            border: `2px dashed ${dragOver ? '#3b82f6' : '#d1d5db'}`,
                            borderRadius: '8px',
                            padding: '40px 20px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: dragOver ? '#f0f9ff' : '#fafafa',
                            transition: 'all 0.2s',
                            marginBottom: '16px'
                        }}
                    >
                        <Upload size={32} color={dragOver ? '#3b82f6' : '#9ca3af'} style={{ margin: '0 auto 12px' }} />
                        <p style={{ margin: '0 0 8px', color: '#374151', fontWeight: '500' }}>
                            Arrastra una imagen aquí o haz clic para seleccionar
                        </p>
                        <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                            JPG, JPEG, PNG (máx. 5MB)
                        </p>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleFileInputChange}
                        style={{ display: 'none' }}
                    />

                    {/* Archivo seleccionado */}
                    {selectedFile && (
                        <div style={{
                            background: '#f9fafb',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            padding: '12px',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Camera size={20} color="#6b7280" />
                                <div>
                                    <p style={{ margin: 0, fontWeight: '500', color: '#374151' }}>
                                        {selectedFile.name}
                                    </p>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
                                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={clearSelection}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    borderRadius: '4px',
                                    color: '#6b7280'
                                }}
                            >
                                <X size={18} />
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={!selectedFile || isSubmitting}
                        style={{
                            background: (!selectedFile || isSubmitting) ? '#9ca3af' : '#10b981',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '6px',
                            cursor: (!selectedFile || isSubmitting) ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            justifyContent: 'center'
                        }}
                    >
                        <Save size={18} />
                        {isSubmitting ? 'Actualizando...' : 'Actualizar Foto'}
                    </button>
                </form>
            </div>
        </div>
    );
};
