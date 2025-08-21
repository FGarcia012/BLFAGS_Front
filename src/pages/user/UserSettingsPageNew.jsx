import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { User, Lock, Camera, Users, Settings } from 'lucide-react';
import { UserSettings } from '../../components/user/UserSettings';
import { UserPasswordSettings } from '../../components/user/UserPasswordSettings';
import { UserPhotoSettings } from '../../components/user/UserPhotoSettings';
import { UserManagement } from '../../components/user/UserManagement';
import { BackButton } from '../../components/BackButton/BackButton';
import { getUserById } from '../../services/api';
import './UserSettingsPageNew.css';

const shootingStarColors = ["#1e40af", "#3b82f6", "#60a5fa"];
const particleColors = ["#1e40af", "#3b82f6", "#60a5fa", "#93c5fd"];

const shootingStarVariants = {
    hidden: { opacity: 0, x: 0, y: 0 },
    visible: (custom) => ({
        opacity: [0, 1, 0],
        x: [0, 120 + custom * 60],
        y: [0, 40 * (custom % 2 === 0 ? 1 : -1), 0],
        transition: {
            duration: 1.5,
            delay: custom * 0.6,
            repeat: Infinity,
            ease: "easeInOut",
        },
    }),
};

const particleVariants = {
    animate: {
        opacity: [0.3, 0.8, 0.3],
        y: [0, -10, 0],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

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
            
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            setCurrentUser(storedUser);
            
            const targetUserId = userId || storedUser._id || storedUser.uid;
            
            if (!targetUserId) {
                return;
            }

            const response = await getUserById(targetUserId);
            if (response.success) {
                console.log('UserSettingsPageNew - Respuesta getUserById:', response);
                console.log('UserSettingsPageNew - Usuario objetivo:', response.user);
                console.log('UserSettingsPageNew - Nombre del usuario objetivo:', response.user?.name);
                
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

    if (!loading && !currentUser?._id && !currentUser?.uid) {
        return <Navigate to="/auth" replace />;
    }

    const canManageUsers = currentUser?.role === 'ADMIN';
    
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
                    <motion.div 
                        className="loading-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="loading-spinner"></div>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            Cargando configuraciones...
                        </motion.p>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="user-settings-page">
            {/* Partículas animadas */}
            {Array(50).fill(0).map((_, i) => {
                const size = Math.random() * 3 + 1;
                const color = particleColors[i % particleColors.length];
                const top = Math.random() * 100;
                const left = Math.random() * 100;
                return (
                    <motion.div
                        key={`particle-${i}`}
                        className="absolute rounded-full"
                        style={{
                            top: `${top}%`,
                            left: `${left}%`,
                            width: size,
                            height: size,
                            backgroundColor: color,
                            filter: `drop-shadow(0 0 6px ${color})`,
                        }}
                        variants={particleVariants}
                        animate="animate"
                        initial={{ opacity: 0.3, y: 0 }}
                        transition={{
                            duration: 4 + Math.random() * 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.1,
                        }}
                    />
                );
            })}

            {/* Estrellas fugaces */}
            {[...Array(15)].map((_, i) => {
                const color = shootingStarColors[i % shootingStarColors.length];
                return (
                    <motion.div
                        key={`shooting-star-${i}`}
                        custom={i}
                        className="absolute rounded-lg blur-sm"
                        style={{
                            top: `${Math.random() * 80 + 10}%`,
                            left: `${Math.random() * 50}%`,
                            width: 6 + Math.random() * 10,
                            height: 1.5 + Math.random() * 2,
                            rotate: 45,
                            backgroundColor: color,
                            opacity: 0,
                            filter: `drop-shadow(0 0 12px ${color})`,
                        }}
                        variants={shootingStarVariants}
                        initial="hidden"
                        animate="visible"
                    />
                );
            })}

            {/* Botón de volver a publicaciones */}
            <motion.div 
                className="back-button-container"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <BackButton 
                    to="/publications" 
                    text="Volver a Publicaciones" 
                    icon="publications" 
                    variant="success"
                />
            </motion.div>

            <div className="container">
                <motion.div 
                    className="settings-container"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {/* Header */}
                    <motion.div 
                        className="settings-header"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
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
                    </motion.div>

                    {/* Navegación por pestañas */}
                    <div className="tabs-container">
                        <div className="tabs-nav">
                            {tabs.map((tab, index) => (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </motion.button>
                            ))}
                        </div>

                        {/* Contenido de la pestaña activa */}
                        <motion.div 
                            className="tab-content"
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {tabs.find(tab => tab.id === activeTab)?.component}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default UserSettingsPageNew;
