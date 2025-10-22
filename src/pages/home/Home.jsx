import React from 'react';
import './Home.css';
import Button from '../../components/Button/Button';

const Home = () => {
  return (
    <div className="home-container">

      <main className="main-content">
        <section className="hero">
          <div className="hero-content">
            <div className="hero-logo">
              <div className="hero-logo-main-wrapper">
                <h1 className="hero-logo-main">Exquis</h1>
                <div className="hero-logo-decoration">
                  <span className="hero-quill">🖋️</span>
                  <div className="hero-ink-drop"></div>
                </div>
              </div>
              <p className="hero-logo-subtitle">Historias Colaborativas</p>
            </div>
            <p className="hero-subtitle">
              Escribe parte de una historia sin conocer nada más que la última línea.
            </p>
            <div className="hero-actions">
              <Button 
                to="/collaborate" 
                variant="primary" 
                size="medium"
                icon="✍️"
              >
                Comenzar a Escribir
              </Button>
              <Button 
                to="/about" 
                variant="secondary" 
                size="medium"
              >
                Conocer Más
              </Button>
            </div>
          </div>
          <div className="hero-illustration">
            <div className="paper-stack">
              <div className="paper paper-1"></div>
              <div className="paper paper-2"></div>
              <div className="paper paper-3"></div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="features-container">
            <h3 className="features-title">¿Cómo Funciona?</h3>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">✍️</div>
                <h4>Escribe</h4>
                <p>Contribuye con dos líneas viendo solo la última línea de quien escribió antes.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🤝</div>
                <h4>Colabora</h4>
                <p>Únete a otros escritores para crear historias únicas e inesperadas.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📖</div>
                <h4>Descubre</h4>
                <p>Lee las historias completas compartidas públicamente.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">👥</div>
                <h4>Conecta</h4>
                <p>Sigue a otros escritores y descubre sus contribuciones creativas.</p>
              </div>
            </div>
          </div>
        </section>

        {/* <section className="cta-section">
          <div className="cta-container">
            <div className="cta-content">
              <h3 className="cta-title">¿Listo para tu Primera Historia?</h3>
              <p className="cta-description">
                Miles de escritores ya han creado historias increíbles. 
                Es tu turno de formar parte de esta comunidad creativa.
              </p>
              <div className="cta-stats">
                <div className="stat">
                  <span className="stat-number">1,247</span>
                  <span className="stat-label">Historias creadas</span>
                </div>
                <div className="stat">
                  <span className="stat-number">5,693</span>
                  <span className="stat-label">Escritores activos</span>
                </div>
                <div className="stat">
                  <span className="stat-number">28,451</span>
                  <span className="stat-label">Líneas escritas</span>
                </div>
              </div>
              <Button 
                to="/register" 
                variant="primary" 
                size="large"
                icon="🚀"
              >
                Unirse a la Comunidad
              </Button>
            </div>
            <div className="cta-illustration">
              <div className="typewriter">
                <div className="typewriter-paper">
                  <div className="typewriter-text">
                    <p className="typing-line">Era una noche tormentosa cuando...</p>
                    <p className="typing-line">...el misterioso extraño llamó a la puerta.</p>
                    <div className="cursor"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}
      </main>

    </div>
  );
};

export default Home;