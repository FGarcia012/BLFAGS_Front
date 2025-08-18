import React from "react";
import { PublicationList } from "../../components/publications/PublicationList";
import { usePublications } from "../../shared/hooks/usePublications";
import { Navbar } from "../../components/navbar/Navbar";
import "./PublicationsPage.css";

export const PublicationsPage = () => {
  const {
    publications,
    isLoading,
    error,
    refreshPublications
  } = usePublications();

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    const userDetails = localStorage.getItem("user");
    return userDetails && JSON.parse(userDetails)?.token;
  };

  return (
    <div className="publications-page">
      <Navbar />
      <div className="publications-page-container">
        <header className="publications-page-header">
          <h1>Descubre Publicaciones</h1>
          <p>Explora las últimas publicaciones de la comunidad</p>
          
          {/* Mostrar botones de autenticación si no está logueado */}
          {!isAuthenticated() && (
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
          <PublicationList
            publications={publications}
            isLoading={isLoading}
            error={error}
            onRefresh={refreshPublications}
          />
        </main>
      </div>
    </div>
  );
};
