import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { UserSettings } from '../../components/user/UserSettings';
import { BackButton } from '../../components/BackButton/BackButton';
import './UserSettingsPage.css';

export const UserSettingsPage = () => {
    const { userId } = useParams();
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    const targetUserId = userId || currentUser._id || currentUser.uid;

    if (!targetUserId) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <div className="user-settings-page">
            {/* Botón de volver a publicaciones */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 100 }}>
                <BackButton 
                    to="/publications" 
                    text="Volver a Publicaciones" 
                    icon="publications" 
                    variant="success"
                />
            </div>
            
            <div className="container">
                <UserSettings userId={targetUserId} />
            </div>
        </div>
    );
};

export default UserSettingsPage;
