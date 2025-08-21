import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useUserProfile } from '../../shared/hooks/useUserProfile';
import { UserInfo } from '../../components/user/UserInfo';
import { UserStats } from '../../components/user/UserStats';
import { PublicationList } from '../../components/publications/PublicationList';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import './UserProfile.css';

export const UserProfile = ({ userId = null }) => {
    const navigate = useNavigate();
    const { userProfile, stats, loading, error, refreshProfile } = useUserProfile(userId);
    
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const isOwnProfile = currentUser.user?.uid === userProfile?.uid;

    if (loading) {
        return (
            <div className="user-profile-loading">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="user-profile-error">
                <h3>Error al cargar el perfil</h3>
                <p>{error}</p>
                <button onClick={refreshProfile} className="retry-button">
                    Intentar de nuevo
                </button>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="user-profile-error">
                <h3>Usuario no encontrado</h3>
            </div>
        );
    }

    const handleSettingsClick = () => {
        navigate(`/user/${userProfile.uid}/settings`);
    };

    return (
        <div className="user-profile">
            <div className="user-profile-header">
                <div className="profile-header-content">
                    <UserInfo user={userProfile} />
                    {isOwnProfile && (
                        <button 
                            className="settings-button"
                            onClick={handleSettingsClick}
                            title="Configuración de perfil"
                        >
                            <Settings size={20} />
                            Configuración
                        </button>
                    )}
                </div>
                <UserStats stats={stats} />
            </div>
            
            <div className="user-publications">
                <h3 className="publications-title">Publicaciones</h3>
                {stats.publications.length > 0 ? (
                    <PublicationList 
                        publications={stats.publications}
                        onPublicationUpdate={refreshProfile}
                    />
                ) : (
                    <div className="no-publications">
                        <p>No hay publicaciones para mostrar</p>
                    </div>
                )}
            </div>
        </div>
    );
};
