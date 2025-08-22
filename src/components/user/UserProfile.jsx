import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useUserProfile } from '../../shared/hooks/useUserProfile';
import { UserInfo } from '../../components/user/UserInfo';
import { UserStats } from '../../components/user/UserStats';
import { PublicationList } from '../../components/publications/PublicationList';
import { AddPublication } from '../../components/publications/AddPublication';
import { PublicationFilter } from '../../components/publications/PublicationFilter';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { debugLog } from '../../shared/utils/debug';
import './UserProfile.css';

export const UserProfile = ({ userId = null }) => {
    const navigate = useNavigate();
    const { userProfile, stats, loading, error, refreshProfile } = useUserProfile(userId);
    const [visibilityFilter, setVisibilityFilter] = useState('all');
    
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    const getCurrentUserId = () => {
        return currentUser.user?.uid || currentUser.user?._id || currentUser._id || currentUser.uid;
    };
    
    const getCurrentUserRole = () => {
        return currentUser.user?.role || currentUser.role;
    };
    
    const currentUserId = getCurrentUserId();
    const isOwnProfile = currentUserId === userProfile?.uid || currentUserId === userProfile?._id;
    const isAdmin = getCurrentUserRole() === 'ADMIN';
    
    const canSeeFilters = isOwnProfile || isAdmin;
    const canCreatePublications = isOwnProfile;

    const filteredPublications = useMemo(() => {
        console.log('🔍 Filtering publications:', {
            totalPublications: stats.publications?.length || 0,
            visibilityFilter,
            isOwnProfile,
            isAdmin,
            publications: stats.publications?.map(pub => ({
                id: pub.pid || pub._id,
                title: pub.title,
                visibility: pub.visibility || 'public'
            }))
        });

        if (!stats.publications) return [];
        
        if (!isOwnProfile && !isAdmin) {
            const publicOnly = stats.publications.filter(pub => 
                pub.visibility === 'public' || !pub.visibility
            );
                        console.log('👀 Showing public only:', publicOnly.length);
            return publicOnly;
        }
        
        switch (visibilityFilter) {
            case 'public':
                const publicFiltered = stats.publications.filter(pub => 
                    pub.visibility === 'public' || !pub.visibility
                );
                debugLog('🌍 Public filtered:', publicFiltered.length);
                return publicFiltered;
            case 'private':
                const privateFiltered = stats.publications.filter(pub => 
                    pub.visibility === 'private'
                );
                debugLog('🔒 Private filtered:', privateFiltered.length);
                return privateFiltered;
            default:
                debugLog('📋 All publications:', stats.publications.length);
                return stats.publications;
        }
    }, [stats.publications, visibilityFilter, isOwnProfile, isAdmin]);

    const publicationsCount = useMemo(() => {
        if (!stats.publications) return { public: 0, private: 0, total: 0 };
        
        const public_ = stats.publications.filter(pub => 
            pub.visibility === 'public' || !pub.visibility
        ).length;
        
        const private_ = stats.publications.filter(pub => 
            pub.visibility === 'private'
        ).length;
        
        const counts = {
            public: public_,
            private: private_,
            total: stats.publications.length
        };
        
        debugLog('📊 Publications count:', counts);
        
        return counts;
    }, [stats.publications]);

    const handlePublicationAdded = () => {
        refreshProfile();
    };

    const handleVisibilityChange = (newFilter) => {
        setVisibilityFilter(newFilter);
    };

    const handleSettingsClick = () => {
        navigate(`/user/${userProfile.uid}/settings`);
    };

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
                <div className="publications-header">
                    <h3 className="publications-title">
                        Publicaciones
                        {isAdmin && !isOwnProfile && (
                            <span className="admin-indicator"> (Vista de Administrador)</span>
                        )}
                    </h3>
                </div>

                {/* Componente para agregar publicaciones - solo visible para el dueño del perfil */}
                <AddPublication 
                    onPublicationAdded={handlePublicationAdded}
                    isOwnProfile={canCreatePublications}
                />

                {/* Filtro de visibilidad - visible para el dueño del perfil o administradores */}
                <PublicationFilter 
                    visibilityFilter={visibilityFilter}
                    onVisibilityChange={handleVisibilityChange}
                    isOwnProfile={canSeeFilters}
                    publicationsCount={publicationsCount}
                    isAdminView={isAdmin && !isOwnProfile}
                />

                {/* Lista de publicaciones filtradas */}
                {filteredPublications.length > 0 ? (
                    <PublicationList 
                        publications={filteredPublications}
                        onPublicationUpdate={refreshProfile}
                    />
                ) : (
                    <div className="no-publications">
                        {!canSeeFilters ? (
                            <p>Este usuario no tiene publicaciones públicas</p>
                        ) : visibilityFilter === 'all' ? (
                            <p>No hay publicaciones para mostrar</p>
                        ) : (
                            <p>No hay publicaciones {visibilityFilter === 'public' ? 'públicas' : 'privadas'} para mostrar</p>
                        )}
                        {canCreatePublications && visibilityFilter === 'all' && (
                            <p className="create-first-publication">¡Crea tu primera publicación usando el botón de arriba!</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
