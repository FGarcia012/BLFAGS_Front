import React, { useState, useMemo } from "react";
import { PublicationList } from "../../components/publications/PublicationList";
import { PublicationSearch } from "../../components/publications/PublicationSearch";
import { AdminPublications } from "../../components/publications/AdminPublications";
import { usePublications } from "../../shared/hooks/usePublications";
import { useUser } from "../../contexts/UserContext";
import { Navbar } from "../../components/navbar/Navbar";
import "./PublicationsPage.css";

export const PublicationsPage = () => {
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const { user, isAuthenticated } = useUser();
  const {
    publications,
    isLoading,
    error,
    searchTerm,
    refreshPublications,
    handleSearch
  } = usePublications();

  const isAdmin = user?.role === 'ADMIN';

  const filteredPublications = useMemo(() => {
    if (!publications || publications.length === 0) return [];
    
    if (visibilityFilter === 'all') {
      return publications;
    }
    
    return publications.filter(pub => pub.visibility === visibilityFilter);
  }, [publications, visibilityFilter]);

  const handleVisibilityFilter = (filter) => {
    setVisibilityFilter(filter);
  };

  return (
    <div className="publications-page">
      <Navbar />
      <div className="publications-page-container">
        <header className="publications-page-header">
          <h1>
            {isAdmin ? 'Gestión de Publicaciones' : 'Descubre Publicaciones'}
          </h1>
          <p>
            {isAdmin 
              ? 'Panel de administración para gestionar todas las publicaciones del sistema'
              : 'Explora las últimas publicaciones de la comunidad'
            }
          </p>
          
          {/* Mostrar botones de autenticación si no está logueado */}
          {!isAuthenticated && (
            <div className="auth-buttons">
              <button 
                onClick={() => window.location.href = '/auth'}
                className="auth-btn login-btn"
              >
                Iniciar Sesión
              </button>
              <button 
                onClick={() => window.location.href = '/register'}
                className="auth-btn register-btn"
              >
                Registrarse
              </button>
            </div>
          )}
        </header>

        <main className="publications-page-content">
          {/* Componente de búsqueda */}
          <PublicationSearch 
            onSearch={handleSearch}
            isLoading={isLoading}
            initialValue={searchTerm}
            placeholder={isAdmin 
              ? "Buscar publicaciones (puedes ver todas como admin)..." 
              : "Buscar publicaciones por título..."
            }
          />

          {/* Panel de administrador si es admin */}
          {isAdmin && (
            <AdminPublications 
              publications={filteredPublications}
              onVisibilityFilter={handleVisibilityFilter}
              currentFilter={visibilityFilter}
              searchTerm={searchTerm}
              isLoading={isLoading}
            />
          )}

          {/* Lista de publicaciones */}
          <PublicationList
            publications={filteredPublications}
            isLoading={isLoading}
            error={error}
            onRefresh={refreshPublications}
          />
        </main>
      </div>
    </div>
  );
};
