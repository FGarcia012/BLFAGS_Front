import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { UserSettings } from '../../components/user/UserSettings';
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
            <div className="container">
                <UserSettings userId={targetUserId} />
            </div>
        </div>
    );
};

export default UserSettingsPage;
