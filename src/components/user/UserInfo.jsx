import React from 'react';
import './UserInfo.css';

export const UserInfo = ({ user }) => {
    console.log('UserInfo - Usuario completo:', user);
    console.log('UserInfo - Nombre del usuario:', user?.name);
    
    const getProfileImageUrl = (profilePicture) => {
        if (!profilePicture) return '/default-avatar.png';
        return `${profilePicture}`;
    };

    return (
        <div className="user-info1">
            <div className="user-avatar">
                <img 
                    src={getProfileImageUrl(user.profilePicture)} 
                    alt={`${user.name} profile`}
                    onError={(e) => {
                        e.target.src = '/default-avatar.png';
                    }}
                />
            </div>
            <div className="user-details">
                <h2 className="user-name1">{user.name}</h2>
                <p className="user-username">@{user.username}</p>
                <p className="user-email">{user.email}</p>
            </div>
        </div>
    );
};
