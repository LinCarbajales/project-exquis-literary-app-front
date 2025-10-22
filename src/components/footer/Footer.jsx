import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = ({ isAuthenticated = false }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-section brand-section">
            <Link to="/" className="footer-logo">
              <span className="logo-main">Exquis</span>
              <div className="logo-decoration">
                <span className="quill">🖋️</span>
              </div>
            </Link>
            <p className="footer-description">
              Una plataforma donde las palabras cobran vida a través de la colaboración. 
              Cada historia es un viaje compartido entre mentes creativas.
            </p>
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

          <div className="footer-section">
            <h4 className="footer-title">Plataforma</h4>
            <ul className="footer-links">
              {isAuthenticated ? (
                <>
                  <li><Link to="/">Escritorio</Link></li>
                  <li><Link to="/stories">Mis Historias</Link></li>
                  <li><Link to="/explore">Explorar</Link></li>
                  <li><Link to="/create">Nueva Historia</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/about">¿Cómo funciona?</Link></li>
                  <li><Link to="/examples">Ejemplos</Link></li>
                  <li><Link to="/register">Crear Cuenta</Link></li>
                  <li><Link to="/login">Iniciar Sesión</Link></li>
                </>
              )}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Comunidad</h4>
            <ul className="footer-links">
              <li><Link to="/guidelines">Normas de la Comunidad</Link></li>
              <li><Link to="/writers">Escritores Destacados</Link></li>
              <li><Link to="/contests">Concursos</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Soporte</h4>
            <ul className="footer-links">
              <li><Link to="/help">Centro de Ayuda</Link></li>
              <li><Link to="/faq">Preguntas Frecuentes</Link></li>
              <li><Link to="/contact">Contacto</Link></li>
              <li><Link to="/feedback">Feedback</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Legal</h4>
            <ul className="footer-links">
              <li><Link to="/terms">Términos de Uso</Link></li>
              <li><Link to="/privacy">Política de Privacidad</Link></li>
              <li><Link to="/cookies">Cookies</Link></li>
              <li><Link to="/copyright">Derechos de Autor</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">
          <div className="newsletter-content">
            <h4 className="newsletter-title">Mantente Inspirado</h4>
            <p className="newsletter-description">
              Recibe historias destacadas y novedades de la comunidad directamente en tu correo.
            </p>
            <form className="newsletter-form">
              <div className="newsletter-input-group">
                <input 
                  type="email" 
                  className="newsletter-input"
                  placeholder="tu@email.com"
                  aria-label="Correo electrónico para newsletter"
                />
                <button type="submit" className="newsletter-btn">
                  Suscribirse
                </button>
              </div>
              <p className="newsletter-privacy">
                No compartimos tu email. Puedes cancelar en cualquier momento.
              </p>
            </form>
          </div>
          <div className="newsletter-decoration">
            <div className="floating-words">
              <span className="word word-1">Crear</span>
              <span className="word word-2">Colaborar</span>
              <span className="word word-3">Inspirar</span>
              <span className="word word-4">Escribir</span>
            </div>
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
            <Link to="/accessibility" className="meta-link">Accesibilidad</Link>
            <Link to="/sitemap" className="meta-link">Mapa del Sitio</Link>
            <span className="meta-divider">•</span>
            <span className="version">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;