import React, { useState } from 'react';
import './Home.css';
import Button from '../../components/Button/Button';

const Home = () => {
  const [showAboutModal, setShowAboutModal] = useState(false);

  const handleKnowMore = (e) => {
    e.preventDefault();
    setShowAboutModal(true);
  };

  const closeModal = () => setShowAboutModal(false);

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
                onClick={handleKnowMore}
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

      {/* Modal: Acerca de */}
      {showAboutModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-icon">🖋️</span>
              <h2>Acerca de Exquis</h2>
            </div>
            <div className="modal-body">
              <p>
                <strong>Exquis</strong> es la versión digital del cadáver exquisito, 
                un juego popularizado por los escritores surrealistas, en el que varias personas colaboran 
                para la creación de una historia.
              </p>
              <p>
                La gracia reside en que cuando vas a escribir tú parte, tú solo puedes leer la colaboración 
                anterior a la tuya, y la tuya será la única que lea la siguiente persona.
              </p>
              <p>
                De este modo, se acabará creando una historia inconexa y caótica, extraña o divertida.
              </p>
            </div>
            <button className="modal-close" onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;