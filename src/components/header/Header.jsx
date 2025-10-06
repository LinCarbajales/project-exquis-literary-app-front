import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ user = null, isAuthenticated = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Detectar scroll para cambiar apariencia del header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    // Aquí iría la lógica de logout
    console.log('Cerrando sesión...');
    // logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-content">
        {/* Logo */}
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="logo-container">
          <div className="logo">
            <span className="logo-main">Exquis</span>
            <div className="logo-decoration">
              <span className="quill">🖋️</span>
              <div className="ink-drop"></div>
            </div>
          </div>
          <span className="logo-subtitle">Historias Colaborativas</span>
        </Link>

        {/* Navegación desktop */}
        <nav className="nav-desktop">
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              >
                Escritorio
              </Link>
              <Link 
                to="/stories" 
                className={`nav-link ${location.pathname === '/stories' ? 'active' : ''}`}
              >
                Historias
              </Link>
              <Link 
                to="/explore" 
                className={`nav-link ${location.pathname === '/explore' ? 'active' : ''}`}
              >
                Explorar
              </Link>
              
              {/* Menú de usuario */}
              <div className="user-menu">
                <Link to={`/profile/${user?.id || 'me'}`} className="user-profile">
                  <div className="user-avatar">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.username} />
                    ) : (
                      <div className="avatar-placeholder">
                        {(user?.username || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="username">{user?.username || 'Usuario'}</span>
                </Link>
                <div className="dropdown">
                  <div className="dropdown-content">
                    <Link to={`/profile/${user?.id || 'me'}`} className="dropdown-item">
                      <span>👤</span> Mi Perfil
                    </Link>
                    <Link to="/settings" className="dropdown-item">
                      <span>⚙️</span> Configuración
                    </Link>
                    <hr className="dropdown-divider" />
                    <button onClick={handleLogout} className="dropdown-item logout">
                      <span>🚪</span> Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/about" className="nav-link">
                ¿Cómo funciona?
              </Link>
              <Link to="/examples" className="nav-link">
                Ejemplos
              </Link>
              <Link to="/login" className="nav-link">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="nav-link nav-link-primary">
                Registro
              </Link>
            </>
          )}
        </nav>

        {/* Botón menú móvil */}
        <button 
          className={`mobile-menu-btn ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Menú de navegación"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Menú móvil */}
      <nav className={`nav-mobile ${isMenuOpen ? 'open' : ''}`}>
        <div className="nav-mobile-content">
          {isAuthenticated ? (
            <>
              <div className="mobile-user-info">
                <div className="user-avatar large">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} />
                  ) : (
                    <div className="avatar-placeholder">
                      {(user?.username || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="user-details">
                  <span className="username">{user?.username || 'Usuario'}</span>
                  <span className="user-email">{user?.email}</span>
                </div>
              </div>
              
              <div className="nav-mobile-links">
                <Link to="/dashboard" className="mobile-nav-link">
                  <span>🏠</span> Escritorio
                </Link>
                <Link to="/stories" className="mobile-nav-link">
                  <span>📚</span> Historias
                </Link>
                <Link to="/explore" className="mobile-nav-link">
                  <span>🔍</span> Explorar
                </Link>
                <Link to={`/profile/${user?.id || 'me'}`} className="mobile-nav-link">
                  <span>👤</span> Mi Perfil
                </Link>
                <Link to="/settings" className="mobile-nav-link">
                  <span>⚙️</span> Configuración
                </Link>
              </div>
              
              <button onClick={handleLogout} className="mobile-logout-btn">
                <span>🚪</span> Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <div className="nav-mobile-links">
                <Link to="/" className="mobile-nav-link">
                  <span>🏠</span> Inicio
                </Link>
                <Link to="/about" className="mobile-nav-link">
                  <span>❓</span> ¿Cómo funciona?
                </Link>
                <Link to="/examples" className="mobile-nav-link">
                  <span>📖</span> Ejemplos
                </Link>
                <Link to="/login" className="mobile-nav-link">
                  <span>🔑</span> Iniciar Sesión
                </Link>
              </div>
              
              <Link to="/register" className="mobile-register-btn">
                Crear Cuenta
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Overlay para cerrar menú móvil */}
      {isMenuOpen && <div className="mobile-menu-overlay" onClick={toggleMenu}></div>}
    </header>
  );
};

export default Header;