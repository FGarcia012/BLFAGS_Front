import React from 'react';
import { Shield, Eye, EyeOff, Globe, Users } from 'lucide-react';
import './AdminPublications.css';

export const AdminPublications = ({ 
    publications = [], 
    onVisibilityFilter,
    currentFilter = 'all',
    searchTerm = '',
    isLoading = false 
}) => {
    
    const getPublicationStats = () => {
        const total = publications.length;
        const publicPubs = publications.filter(pub => pub.visibility === 'public').length;
        const privatePubs = publications.filter(pub => pub.visibility === 'private').length;
        const users = new Set(publications.map(pub => pub.user?.uid || pub.user?._id)).size;
        
        return { total, publicPubs, privatePubs, users };
    };

    const stats = getPublicationStats();

    const filterOptions = [
        {
            value: 'all',
            label: 'Todas las Publicaciones',
            icon: Globe,
            count: stats.total,
            color: '#3498db',
            description: 'Ver todas las publicaciones del sistema'
        },
        {
            value: 'public',
            label: 'Públicas',
            icon: Eye,
            count: stats.publicPubs,
            color: '#27ae60',
            description: 'Publicaciones visibles para todos'
        },
        {
            value: 'private',
            label: 'Privadas',
            icon: EyeOff,
            count: stats.privatePubs,
            color: '#e67e22',
            description: 'Publicaciones solo visibles para el autor'
        }
    ];

    return (
        <div className="admin-publications">
            <div className="admin-header">
                <div className="admin-title">
                    <Shield className="admin-icon" size={24} />
                    <h2>Panel de Administrador</h2>
                </div>
                <div className="admin-subtitle">
                    Gestión completa de publicaciones del sistema
                </div>
            </div>

            {/* Estadísticas generales */}
            <div className="admin-stats">
                <div className="stat-item">
                    <Globe className="stat-icon" />
                    <div className="stat-info">
                        <span className="stat-number">{stats.total}</span>
                        <span className="stat-label">Total Publicaciones</span>
                    </div>
                </div>
                <div className="stat-item">
                    <Users className="stat-icon" />
                    <div className="stat-info">
                        <span className="stat-number">{stats.users}</span>
                        <span className="stat-label">Usuarios Activos</span>
                    </div>
                </div>
            </div>

            {/* Filtros de visibilidad */}
            <div className="admin-filters">
                <h3>Filtrar por Visibilidad</h3>
                <div className="filter-grid">
                    {filterOptions.map((option) => {
                        const IconComponent = option.icon;
                        const isActive = currentFilter === option.value;
                        
                        return (
                            <button
                                key={option.value}
                                className={`admin-filter-btn ${isActive ? 'active' : ''}`}
                                onClick={() => onVisibilityFilter(option.value)}
                                style={{ '--filter-color': option.color }}
                                disabled={isLoading}
                            >
                                <div className="filter-header">
                                    <IconComponent size={20} />
                                    <span className="filter-count">{option.count}</span>
                                </div>
                                <div className="filter-content">
                                    <h4>{option.label}</h4>
                                    <p>{option.description}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Información de búsqueda actual */}
            {searchTerm && (
                <div className="search-info-admin">
                    <div className="search-results">
                        <span className="results-text">
                            Mostrando resultados para: "<strong>{searchTerm}</strong>"
                        </span>
                        <span className="results-count">
                            {publications.length} {publications.length === 1 ? 'resultado' : 'resultados'}
                        </span>
                    </div>
                </div>
            )}

            {/* Información adicional para administradores */}
            <div className="admin-info">
                <div className="admin-note">
                    <Shield size={16} />
                    <span>
                        Como administrador, puedes ver y gestionar todas las publicaciones, 
                        incluyendo las marcadas como privadas.
                    </span>
                </div>
            </div>
        </div>
    );
};
