import React, { useState } from 'react';
import { Trash2, AlertTriangle, Shield, Eye, EyeOff } from 'lucide-react';
import { deleteUser } from '../../services/api';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './UserSettings.css';

export const UserAccountSettings = ({ userId }) => {
    const navigate = useNavigate();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [step, setStep] = useState(1); // 1: Warning, 2: Confirmation, 3: Password

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isOwnAccount = !userId || userId === currentUser._id || userId === currentUser.uid;
    const isAdmin = currentUser?.role === 'ADMIN';

    const handleStartDeletion = () => {
        setShowConfirmation(true);
        setStep(1);
    };

    const handleConfirm = () => {
        if (confirmationText.toLowerCase() === 'eliminar') {
            if (isOwnAccount && !isAdmin) {
                setStep(3); 
            } else {
                performDeletion(); 
            }
        } else {
            toast.error('Debes escribir exactamente "eliminar" para continuar');
        }
    };

    const performDeletion = async () => {
        setIsDeleting(true);
        
        try {
            const targetUserId = userId || currentUser._id || currentUser.uid;
            const response = await deleteUser(targetUserId);
            
            if (response.success) {
                toast.success('Cuenta eliminada correctamente');
                
                if (isOwnAccount) {
                    localStorage.removeItem('user');
                    navigate('/auth', { replace: true });
                } else {
                    navigate('/settings', { replace: true });
                }
            } else {
                toast.error(response.message || 'Error al eliminar la cuenta');
            }
        } catch (error) {
            toast.error('Error al eliminar la cuenta');
            console.error('Error:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const resetModal = () => {
        setShowConfirmation(false);
        setConfirmationText('');
        setPassword('');
        setStep(1);
    };

    if (!showConfirmation) {
        return (
            <div className="user-settings">
                <div className="danger-zone">
                    <div className="danger-warning">
                        <AlertTriangle size={24} color="#dc2626" />
                        <div>
                            <h3>Zona de Peligro</h3>
                            <p>
                                Esta acción {isOwnAccount ? 'desactivará tu cuenta' : 'desactivará la cuenta del usuario'}. 
                                {isOwnAccount ? ' Perderás acceso a tu perfil y todas tus publicaciones.' : ' El usuario perderá acceso a su perfil.'}
                            </p>
                        </div>
                    </div>

                    <div className="danger-details">
                        <h4>¿Qué sucederá?</h4>
                        <ul>
                            <li>La cuenta será marcada como inactiva</li>
                            <li>Se perderá el acceso al perfil</li>
                            <li>Las publicaciones permanecerán en el sistema</li>
                            <li>Los datos no se eliminarán permanentemente</li>
                            {isAdmin && <li>Como admin, puedes reactivar la cuenta más tarde</li>}
                        </ul>
                    </div>

                    <button
                        onClick={handleStartDeletion}
                        className="delete-account-button"
                        disabled={isDeleting}
                    >
                        <Trash2 size={18} />
                        {isOwnAccount ? 'Eliminar mi cuenta' : 'Eliminar cuenta'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="user-settings">
            <div className="modal-overlay">
                <div className="confirmation-modal">
                    {step === 1 && (
                        <>
                            <div className="modal-header">
                                <AlertTriangle size={32} color="#dc2626" />
                                <h3>¿Estás completamente seguro?</h3>
                            </div>
                            
                            <div className="modal-content">
                                <p>
                                    Esta acción {isOwnAccount ? 'desactivará tu cuenta' : 'desactivará la cuenta del usuario'}. 
                                    Aunque los datos no se eliminarán permanentemente, 
                                    {isOwnAccount ? ' perderás acceso inmediato a tu perfil.' : ' el usuario perderá acceso a su perfil.'}
                                </p>
                                
                                <div className="confirmation-input">
                                    <label>
                                        Para confirmar, escribe <strong>"eliminar"</strong> en el campo de abajo:
                                    </label>
                                    <input
                                        type="text"
                                        value={confirmationText}
                                        onChange={(e) => setConfirmationText(e.target.value)}
                                        placeholder="eliminar"
                                        className="form-input"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button onClick={resetModal} className="cancel-button">
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handleConfirm}
                                    className="confirm-delete-button"
                                    disabled={confirmationText.toLowerCase() !== 'eliminar'}
                                >
                                    Continuar
                                </button>
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <div className="modal-header">
                                <Shield size={32} color="#dc2626" />
                                <h3>Verificación de Seguridad</h3>
                            </div>
                            
                            <div className="modal-content">
                                <p>
                                    Por seguridad, ingresa tu contraseña actual para confirmar la eliminación:
                                </p>
                                
                                <div className="password-input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Tu contraseña actual"
                                        className="form-input"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="password-toggle"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button onClick={resetModal} className="cancel-button">
                                    Cancelar
                                </button>
                                <button 
                                    onClick={performDeletion}
                                    className="confirm-delete-button"
                                    disabled={!password.trim() || isDeleting}
                                >
                                    {isDeleting ? (
                                        <>
                                            <LoadingSpinner size="small" />
                                            Eliminando...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 size={18} />
                                            Eliminar cuenta
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
