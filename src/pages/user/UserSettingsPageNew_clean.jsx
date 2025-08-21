import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { User, Lock, Camera, Users, Settings } from 'lucide-react';
import { UserSettings } from '../../components/user/UserSettings';
import { UserPasswordSettings } from '../../components/user/UserPasswordSettings';
import { UserPhotoSettings } from '../../components/user/UserPhotoSettings';
import { UserManagement } from '../../components/user/UserManagement';
import { BackButton } from '../../components/BackButton/BackButton';
import { getUserById } from '../../services/api';
import './UserSettingsPageNew.css';

const UserSettingsPageNew = () => {
    const { userId } = useParams();
    const [activeTab, setActiveTab] = useState('profile');
    const [currentUser, setCurrentUser] = useState(null);
    const [targetUser, setTargetUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profilePicture, setProfilePicture] = useState('');

    useEffect(() => {
        initializeUser();
    }, [userId]);

    const initializeUser = async () => {
        try {
            setLoading(true);
            
            // Obtener usuario actual del localStorage
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            setCurrentUser(storedUser);
            
            // Determinar el usuario objetivo
            const targetUserId = userId || storedUser._id || storedUser.uid;
            
            if (!targetUserId) {
                return;
            }

            // Cargar datos del usuario objetivo
            const response = await getUserById(targetUserId);
            if (response.success) {
                setTargetUser(response.user);
                setProfilePicture(response.user.profilePicture || '');
            }
        } catch (error) {
            console.error('Error loading user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpdate = (newProfilePicture) => {
        setProfilePicture(newProfilePicture);
        if (targetUser) {
            setTargetUser(prev => ({
                ...prev,
                profilePicture: newProfilePicture
            }));
        }
    };

    // Verificar autenticación
    if (!loading && !currentUser?._id && !currentUser?.uid) {
        return <Navigate to="/auth" replace />;
    }

    // Verificar permisos para gestión de usuarios
    const canManageUsers = currentUser?.role === 'ADMIN';
    
    // Verificar si es el propio usuario o un admin
    const isOwnProfile = !userId || userId === currentUser?._id || userId === currentUser?.uid;
    const canEditProfile = isOwnProfile || canManageUsers;

    if (!canEditProfile) {
        return <Navigate to="/auth" replace />;
    }

    const targetUserId = userId || currentUser._id || currentUser.uid;

    const tabs = [
        {
            id: 'profile',
            label: 'Perfil',
            icon: <User size={18} />,
            component: <UserSettings userId={targetUserId} />
        },
        {
            id: 'password',
            label: 'Contraseña',
            icon: <Lock size={18} />,
            component: <UserPasswordSettings userId={targetUserId} />
        },
        {
            id: 'photo',
            label: 'Foto',
            icon: <Camera size={18} />,
            component: (
                <UserPhotoSettings 
                    userId={targetUserId} 
                    currentProfilePicture={profilePicture}
                    onPhotoUpdate={handlePhotoUpdate}
                />
            )
        }
    ];

    // Añadir pestaña de gestión para administradores
    if (canManageUsers) {
        tabs.push({
            id: 'management',
            label: 'Gestión',
            icon: <Users size={18} />,
            component: <UserManagement />
        });
    }

    if (loading) {
        return (
            <div className="user-settings-page">
                <div className="container">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Cargando configuraciones...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="user-settings-page">
            {/* Botón de volver a publicaciones */}
            <div className="back-button-container">
                <BackButton 
                    to="/publications" 
                    text="Volver a Publicaciones" 
                    icon="publications" 
                    variant="success"
                />
            </div>

            <div className="container">
                <div className="settings-container">
                    {/* Header */}
                    <div className="settings-header">
                        <div className="header-content">
                            <div className="header-icon">
                                <Settings size={28} />
                            </div>
                            <div>
                                <h1 className="header-title">
                                    {isOwnProfile ? 'Mi Perfil' : `Perfil de ${targetUser?.name || 'Usuario'}`}
                                </h1>
                                <p className="header-subtitle">
                                    {isOwnProfile ? 'Administra tu información personal y configuraciones' : 'Gestiona la información del usuario'}
                                </p>
                            </div>
                        </div>
                        
                        {targetUser && (
                            <div className="user-preview">
                                <div className="user-avatar">
                                    {profilePicture ? (
                                        <img 
                                            src={profilePicture.startsWith('http') ? profilePicture : `http://localhost:3020/${profilePicture}`}
                                            alt={targetUser.name}
                                        />
                                    ) : (
                                        <User size={24} />
                                    )}
                                </div>
                                <div className="user-info">
                                    <h3>{targetUser.name}</h3>
                                    <p>@{targetUser.username}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navegación por pestañas */}
                    <div className="tabs-container">
                        <div className="tabs-nav">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Contenido de la pestaña activa */}
                        <div className="tab-content">
                            {tabs.find(tab => tab.id === activeTab)?.component}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSettingsPageNew;
