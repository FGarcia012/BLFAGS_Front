import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Save } from 'lucide-react';
import { updatePassword } from '../../services/api';
import './UserSettings.css';

export const UserPasswordSettings = ({ userId }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: ''
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    const validatePassword = (password) => {
        const requirements = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        return {
            isValid: Object.values(requirements).every(req => req),
            requirements
        };
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }

        if (field === 'newPassword') {
            const validation = validatePassword(value);
            if (value && !validation.isValid) {
                setErrors(prev => ({
                    ...prev,
                    newPassword: 'La contraseña debe tener al menos 8 caracteres, 1 minúscula, 1 mayúscula, 1 número y 1 símbolo'
                }));
            }
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isSubmitting) return;

        // Validaciones
        const newErrors = {};
        
        if (!formData.currentPassword.trim()) {
            newErrors.currentPassword = 'La contraseña actual es obligatoria';
        }

        if (!formData.newPassword.trim()) {
            newErrors.newPassword = 'La nueva contraseña es obligatoria';
        } else {
            const validation = validatePassword(formData.newPassword);
            if (!validation.isValid) {
                newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres, 1 minúscula, 1 mayúscula, 1 número y 1 símbolo';
            }
        }

        if (formData.currentPassword === formData.newPassword) {
            newErrors.newPassword = 'La nueva contraseña debe ser diferente a la actual';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        setMessage('');
        setErrors({});

        try {
            const response = await updatePassword(userId, formData);
            
            if (response.success) {
                setMessage('✓ Contraseña actualizada correctamente');
                setFormData({
                    currentPassword: '',
                    newPassword: ''
                });
                
            } else {
                setMessage('❌ ' + (response.message || 'Error al actualizar la contraseña'));
            }
        } catch (error) {
            setMessage('❌ Error al actualizar la contraseña');
        } finally {
            setIsSubmitting(false);
        }
    };

    const passwordValidation = validatePassword(formData.newPassword);

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
                            <Lock size={18} />
                            Contraseña Actual
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPasswords.current ? "text" : "password"}
                                className={`form-input ${errors.currentPassword ? 'error' : ''}`}
                                value={formData.currentPassword}
                                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                                placeholder="Tu contraseña actual"
                                style={{ paddingRight: '40px' }}
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('current')}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#6b7280'
                                }}
                            >
                                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.currentPassword && (
                            <span style={{ color: '#dc2626', fontSize: '14px' }}>
                                {errors.currentPassword}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            <Lock size={18} />
                            Nueva Contraseña
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPasswords.new ? "text" : "password"}
                                className={`form-input ${errors.newPassword ? 'error' : ''}`}
                                value={formData.newPassword}
                                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                placeholder="Tu nueva contraseña"
                                style={{ paddingRight: '40px' }}
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#6b7280'
                                }}
                            >
                                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <span style={{ color: '#dc2626', fontSize: '14px' }}>
                                {errors.newPassword}
                            </span>
                        )}
                        
                        {/* Indicador de fortaleza de contraseña */}
                        {formData.newPassword && (
                            <div style={{ marginTop: '8px' }}>
                                <div style={{ fontSize: '12px', marginBottom: '4px', color: '#6b7280' }}>
                                    Requisitos de contraseña:
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                    {Object.entries(passwordValidation.requirements).map(([key, met]) => (
                                        <span
                                            key={key}
                                            style={{
                                                fontSize: '11px',
                                                padding: '2px 6px',
                                                borderRadius: '12px',
                                                background: met ? '#dcfce7' : '#fee2e2',
                                                color: met ? '#16a34a' : '#dc2626'
                                            }}
                                        >
                                            {key === 'length' && '8+ caracteres'}
                                            {key === 'lowercase' && 'Minúscula'}
                                            {key === 'uppercase' && 'Mayúscula'}
                                            {key === 'number' && 'Número'}
                                            {key === 'symbol' && 'Símbolo'}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isSubmitting || !passwordValidation.isValid || !formData.currentPassword}
                        style={{
                            background: (isSubmitting || !passwordValidation.isValid || !formData.currentPassword) ? '#9ca3af' : '#dc2626',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '6px',
                            cursor: (isSubmitting || !passwordValidation.isValid || !formData.currentPassword) ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            justifyContent: 'center'
                        }}
                    >
                        <Save size={18} />
                        {isSubmitting ? 'Actualizando...' : 'Cambiar Contraseña'}
                    </button>
                </form>
            </div>
        </div>
    );
};
