import React from 'react';
import './UserStats.css';

export const UserStats = ({ stats }) => {
    return (
        <div className="user-stats">
            <div className="stat-item">
                <span className="stat-number">{stats.totalLikes}</span>
                <span className="stat-label">Gustos</span>
            </div>
            <div className="stat-item">
                <span className="stat-number">{stats.totalPublications}</span>
                <span className="stat-label">Publicaciones</span>
            </div>
        </div>
    );
};
