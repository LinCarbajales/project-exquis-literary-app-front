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
      </main>

    </div>
  );
};

export default Home;