import React from 'react';
import { useUser } from '../../contexts/UserContext';
import './UserInfo.css';

export const UserInfo = ({ user }) => {
    const { getUserInitials } = useUser();
    
    const getDisplayName = () => {
        return user.name || user.username || 'Usuario';
    };

    const getInitials = () => {
        const name = getDisplayName();
        return name.charAt(0).toUpperCase();
    };

    return (
        <div className="user-info1">
            <div className="user-avatar-container">
                {user.profilePicture ? (
                    <img 
                        src={user.profilePicture} 
                        alt={`${getDisplayName()} profile`}
                        className="user-avatar-image"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div 
                    className="user-avatar-fallback" 
                    style={{ display: user.profilePicture ? 'none' : 'flex' }}
                >
                    {getInitials()}
                </div>
            </div>
            <div className="user-details">
                <h2 className="user-name1">{getDisplayName()}</h2>
                <p className="user-username">@{user.username || 'usuario'}</p>
                <p className="user-email">{user.email || 'Email no disponible'}</p>
            </div>
        </div>
    );
};
