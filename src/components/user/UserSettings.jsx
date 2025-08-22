import React, { useState, useEffect } from 'react';
import { User, Save } from 'lucide-react';
import { getUserById, updateUser } from '../../services/api';
import './UserSettings.css';

export const UserSettings = ({ userId }) => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: ''
    });

    const [userData, setUserData] = useState({
        name: '',
        username: '',
        email: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (userId) {
            loadUserData();
        }
    }, [userId]);

    useEffect(() => {
        if (userData.name && userData.name !== formData.name) {
            setFormData({
                name: userData.name || '',
                username: userData.username || '',
                email: userData.email || ''
            });
        }
    }, [userData.name, userData.username, userData.email]);

    const loadUserData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getUserById(userId);
            
            if (response.success) {
                const newUserData = {
                    name: response.user.name || '',
                    username: response.user.username || '',
                    email: response.user.email || '',
                    profilePicture: response.user.profilePicture || ''
                };
                setUserData(newUserData);
            } else {
                setError(response.message || 'Error al cargar datos del usuario');
            }
        } catch (error) {
            setError('Error al cargar datos del usuario');
        } finally {
            setLoading(false);
        }
    };

    const handleFormDataChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isSubmitting) {
            return;
        }
        
        setIsSubmitting(true);
        setMessage('');
        setError(null);
        
        try {
            const response = await updateUser(userId, formData);
            
            if (response.success) {
                setUserData(prev => ({
                    ...prev,
                    ...formData
                }));
                
                try {
                    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                    if (currentUser.user?.uid === userId || currentUser._id === userId) {
                        const updatedUser = {
                            ...currentUser,
                            user: currentUser.user ? {
                                ...currentUser.user,
                                ...formData
                            } : { ...formData, uid: userId },
                            name: formData.name || currentUser.name,
                            username: formData.username || currentUser.username,
                            email: formData.email || currentUser.email
                        };
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                    }
                } catch (localStorageError) {
                    console.warn('Error updating localStorage:', localStorageError);
                }
                
                setMessage('✓ Perfil actualizado correctamente');
            } else {
                const errorMessage = response.message || 'Error al actualizar el perfil';
                setError(errorMessage);
                setMessage('❌ ' + errorMessage);
            }
        } catch (error) {
            setError('Error al actualizar el perfil');
            setMessage('❌ Error al actualizar el perfil');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading && !userData.name) {
        return (
            <div className="user-settings-loading">
                <div>Cargando...</div>
            </div>
        );
    }

    if (error && !userData.name) {
        return (
            <div className="user-settings-error">
                <h3>Error al cargar configuraciones</h3>
                <p>{error}</p>
            </div>
        );
    }

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

                    <div className="form-group">
                        <label className="form-label">
                            <User size={18} />
                            Nombre Completo
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.name}
                            onChange={(e) => handleFormDataChange('name', e.target.value)}
                            placeholder="Tu ompleto"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <User size={18} />
                            Nombre de Usuario
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.username}
                            onChange={(e) => handleFormDataChange('username', e.target.value)}
                            placeholder="Tu nombre de usuario"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            className="form-input"
                            value={formData.email}
                            onChange={(e) => handleFormDataChange('email', e.target.value)}
                            placeholder="Tu email"
                        />
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading || isSubmitting}
                        style={{
                            background: (loading || isSubmitting) ? '#9ca3af' : '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '6px',
                            cursor: (loading || isSubmitting) ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <Save size={18} />
                        {(loading || isSubmitting) ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </form>
            </div>
        </div>
    );
};
