import React from 'react';
import './Footer.css';
import InfoModals from '../InfoModals/InfoModals';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main-simple"> 
          <div className="footer-section brand-section">
            <a href="/" className="footer-logo">
              <span className="logo-main">Exquis</span>
              <div className="logo-decoration">
                <span className="quill">🖋️</span>
              </div>
            </a>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Twitter"><span>🐦</span></a>
              <a href="#" className="social-link" aria-label="Instagram"><span>📷</span></a>
              <a href="#" className="social-link" aria-label="GitHub"><span>💻</span></a>
            </div>
          </div>

          {/* Reemplazamos los enlaces directos por el componente InfoModals */}
          <div className="footer-section footer-nav-simple"> 
            <InfoModals />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="footer-copyright">
            <p>&copy; {currentYear} Exquis. Proyecto de bootcamp con ❤️</p>
          </div>
          <div className="footer-meta">
            <a href="/terms" className="meta-link">Términos de Uso</a>
            <a href="/privacy" className="meta-link">Política de Privacidad</a>
            <span className="meta-divider">•</span>
            <span className="version">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
