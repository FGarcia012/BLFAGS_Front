import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext.jsx";
import "./Navbar.css";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout: contextLogout, getUserInitials } = useUser();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    contextLogout();
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const handleNavigate = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo y nombre de la app */}
        <div className="navbar-brand" onClick={() => handleNavigate("/")}>
          <div className="navbar-logo">
            <img 
              src="/Logo_BLFAGS.png" 
              alt="BLFAGS Logo" 
              className="logo-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="logo-fallback" style={{ display: 'none' }}>
              <span className="logo-icon">🦊</span>
            </div>
          </div>
          <span className="navbar-title">BLFAGS</span>
        </div>

        {/* Botón hamburguesa solo en móvil */}
        <button
          className="navbar-hamburger"
          aria-label="Abrir menú"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
          <span className="hamburger-bar"></span>
        </button>

        {/* Navegación central (solo desktop) */}
        <div className="navbar-nav">
          <button className="nav-link" onClick={() => handleNavigate("/")}>Inicio</button>
          <button className="nav-link" onClick={() => handleNavigate("/publications")}>Publicaciones</button>
          <button className="nav-link" onClick={() => handleNavigate("/hashtags")}>Hashtags</button>
        </div>

        {/* Menú de usuario (solo desktop) */}
        <div className="navbar-user" ref={dropdownRef}>
          {isAuthenticated && user ? (
            <div className="user-menu">
              <button 
                className="user-button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <div className="user-avatar1">
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt={user.username}
                      className="avatar-image"
                    />
                  ) : (
                    <span className="avatar-fallback">
                      {getUserInitials()}
                    </span>
                  )}
                </div>
                <span className="user-name">Mi Perfil</span>
                <svg 
                  className={`dropdown-arrow ${isProfileMenuOpen ? 'rotated' : ''}`}
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="currentColor"
                >
                  <path d="M4.5 6L8 9.5L11.5 6h-7z"/>
                </svg>
              </button>
              {isProfileMenuOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="user-info1">
                      <p className="user-display-name">{user.name}</p>
                      <p className="user-email">@{user.username}</p>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item"
                    onClick={() => handleNavigate(`/profile/${user.uid}`)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                    </svg>
                    Ver Perfil
                  </button>
                  <button 
                    className="dropdown-item"
                    onClick={() => handleNavigate(`/user/${user.uid}/settings`)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
                    </svg>
                    Configuración
                  </button>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                      <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                    </svg>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons-nav">
              <button 
                className="nav-btn login-nav"
                onClick={() => handleNavigate("/auth")}
              >
                Iniciar Sesión
              </button>
              <button 
                className="nav-btn register-nav"
                onClick={() => handleNavigate("/register")}
              >
                Registrarse
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Menú lateral móvil */}
      <div className={`mobile-menu-drawer${isMobileMenuOpen ? " open" : ""}`}>
        <div className="mobile-menu-content">
          <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>&times;</button>
          <div className="mobile-menu-links">
            <button className="nav-link" onClick={() => handleNavigate("/")}>Inicio</button>
            <button className="nav-link" onClick={() => handleNavigate("/publications")}>Publicaciones</button>
            <button className="nav-link" onClick={() => handleNavigate("/hashtags")}>Hashtags</button>
          </div>
          <div className="mobile-menu-divider"></div>
          {isAuthenticated && user ? (
            <div className="mobile-user-section">
              <div className="user-avatar1" style={{ margin: "0 auto" }}>
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.username} className="avatar-image" />
                ) : (
                  <span className="avatar-fallback">{getUserInitials()}</span>
                )}
              </div>
              <div className="user-display-name" style={{ textAlign: "center", marginTop: 8 }}>{user.name}</div>
              <div className="user-email" style={{ textAlign: "center", marginBottom: 12 }}>@{user.username}</div>
              <button className="dropdown-item" onClick={() => handleNavigate(`/profile/${user.uid}`)}>Ver Perfil</button>
              <button className="dropdown-item" onClick={() => handleNavigate(`/user/${user.uid}/settings`)}>Configuración</button>
              <button className="dropdown-item logout" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          ) : (
            <div className="mobile-auth-buttons">
              <button className="nav-btn login-nav" onClick={() => handleNavigate("/auth")}>Iniciar Sesión</button>
              <button className="nav-btn register-nav" onClick={() => handleNavigate("/register")}>Registrarse</button>
            </div>
          )}
        </div>
        {/* Fondo oscuro al abrir menú */}
        <div className="mobile-menu-backdrop" onClick={() => setIsMobileMenuOpen(false)}></div>
      </div>
    </nav>
  );
};

export default Navbar;
