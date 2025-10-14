import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  
  // Referencias para detectar clics fuera
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Detectar scroll para cambiar apariencia del header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
  }, [location.pathname]);

  // Cerrar dropdowns al hacer clic fuera de ellos
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Cerrar dropdown de usuario si se hace clic fuera
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
      
      // Cerrar menú móvil si se hace clic fuera (solo en el overlay)
      if (isMenuOpen && !mobileMenuRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    console.log('🚪 Cerrando sesión...');
    await logout();
    navigate('/');
    setIsUserDropdownOpen(false);
    setIsMenuOpen(false);
  };

  // Función combinada para logout en móvil
  const handleMobileLogout = () => {
    handleLogout();
    closeMobileMenu();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const closeUserDropdown = () => {
    setIsUserDropdownOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
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
              <div className="user-menu" ref={dropdownRef}>
                <button 
                  className={`user-profile ${isUserDropdownOpen ? 'active' : ''}`}
                  onClick={toggleUserDropdown}
                  aria-haspopup="true"
                  aria-expanded={isUserDropdownOpen}
                >
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
                </button>
                <div className={`dropdown ${isUserDropdownOpen ? 'open' : ''}`}>
                  <div className="dropdown-content">
                    <Link 
                      to="/userarea" 
                      className="dropdown-item"
                      onClick={closeUserDropdown}
                    >
                      <span>👤</span> Mi Perfil
                    </Link>
                    <Link 
                      to="/settings" 
                      className="dropdown-item"
                      onClick={closeUserDropdown}
                    >
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

      {/* Menú móvil - CORREGIDO: sin doble onClick */}
      <nav className={`nav-mobile ${isMenuOpen ? 'open' : ''}`} ref={mobileMenuRef}>
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
                <Link to="/dashboard" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <span>🏠</span> Escritorio
                </Link>
                <Link to="/stories" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <span>📚</span> Historias
                </Link>
                <Link to="/explore" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <span>🔍</span> Explorar
                </Link>
                <Link to="/userarea" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <span>👤</span> Mi Perfil
                </Link>
                <Link to="/settings" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <span>⚙️</span> Configuración
                </Link>
              </div>
              
              {/* BOTÓN CORREGIDO: solo un onClick */}
              <button onClick={handleMobileLogout} className="mobile-logout-btn">
                <span>🚪</span> Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <div className="nav-mobile-links">
                <Link to="/" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <span>🏠</span> Inicio
                </Link>
                <Link to="/about" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <span>❓</span> ¿Cómo funciona?
                </Link>
                <Link to="/examples" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <span>📖</span> Ejemplos
                </Link>
                <Link to="/login" className="mobile-nav-link" onClick={closeMobileMenu}>
                  <span>🔑</span> Iniciar Sesión
                </Link>
              </div>
              
              <Link to="/register" className="mobile-register-btn" onClick={closeMobileMenu}>
                Crear Cuenta
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Overlay para cerrar menú móvil */}
      {isMenuOpen && (
        <div 
          className="mobile-menu-overlay" 
          onClick={closeMobileMenu}
        ></div>
      )}
    </header>
  );
};

export default Header;