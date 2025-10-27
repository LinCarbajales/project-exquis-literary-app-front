import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        
        <div className="footer-main-simple"> 
          
          {/* 1. Sección de la Marca y Sociales */}
          <div className="footer-section brand-section">
            <Link to="/" className="footer-logo">
              <span className="logo-main">Exquis</span>
              <div className="logo-decoration">
                <span className="quill">🖋️</span>
              </div>
            </Link>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Twitter">
                <span>🐦</span>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <span>📷</span>
              </a>
              <a href="#" className="social-link" aria-label="GitHub">
                <span>💻</span>
              </a>
            </div>
          </div>

          {/* 2. Sección de Navegación Simplificada y Distribuida */}
          <div className="footer-section footer-nav-simple"> 
            <ul className="footer-links">
              {/* Enlaces distribuidos */}
              <li><Link to="/about">Acerca de</Link></li> 
              <li><Link to="/how-it-works">¿Cómo funciona?</Link></li>
              <li><Link to="/contact">Contacto</Link></li>
            </ul>
          </div>
        </div>
        
      </div>

      {/* Barra inferior */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="footer-copyright">
            <p>&copy; {currentYear} Exquis. Proyecto de bootcamp con ❤️</p>
          </div>
          <div className="footer-meta">
            <Link to="/terms" className="meta-link">Términos de Uso</Link>
            <Link to="/privacy" className="meta-link">Política de Privacidad</Link>
            <span className="meta-divider">•</span>
            <span className="version">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;