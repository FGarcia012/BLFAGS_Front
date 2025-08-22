import React from 'react';
import { Eye, EyeOff, Globe } from 'lucide-react';
import './PublicationFilter.css';
import { color } from 'framer-motion';

export const PublicationFilter = ({ 
    visibilityFilter, 
    onVisibilityChange, 
    isOwnProfile = false,
    publicationsCount = { public: 0, private: 0, total: 0 },
    isAdminView = false
}) => {
    
    if (!isOwnProfile) {
        return null;
    }

    const filterOptions = [
        {
            value: 'all',
            label: 'Todas', 
            icon: Globe,
            count: publicationsCount.total,
            color: '#3498db'
        },
        {
            value: 'public',
            label: 'Públicas',
            icon: Eye,
            count: publicationsCount.public,
            color: '#27ae60'
        },
        {
            value: 'private',
            label: 'Privadas',
            icon: EyeOff,
            count: publicationsCount.private,
            color: '#e67e22'
        }
    ];

    return (
        <div className="publication-filter">
            <div className="filter-header">
                <h4>
                    Filtrar publicaciones
                    {isAdminView && (
                        <span className="admin-filter-note"> (Como Admin puedes ver todas)</span>
                    )}
                </h4>
            </div>
            <div className="filter-options">
                {filterOptions.map((option) => {
                    const IconComponent = option.icon;
                    const isActive = visibilityFilter === option.value;
                    
                    return (
                        <button
                            key={option.value}
                            className={`filter-option ${isActive ? 'active' : ''}`}
                            onClick={() => onVisibilityChange(option.value)}
                            style={{
                                '--option-color': option.color
                            }}
                        >
                            <div className="filter-option-content">
                                <IconComponent size={20} />
                                <span className="filter-label">{option.label}</span>
                                <span className="filter-count">({option.count})</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
