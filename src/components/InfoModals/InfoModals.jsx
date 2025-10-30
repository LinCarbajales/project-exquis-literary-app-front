// src/components/InfoModals/InfoModals.jsx
import React, { useState } from 'react';
import './InfoModals.css';

const InfoModals = () => {
  const [activeModal, setActiveModal] = useState(null);

  const closeModal = () => setActiveModal(null);

  return (
    <>
      {/* Enlaces visibles en el footer: ¡ELIMINADA la lista <ul>! */}
      {/* El contenedor .footer-nav-simple (en Footer.jsx) gestionará ahora la distribución. */}
      <button className="meta-link" onClick={() => setActiveModal('about')}>Acerca de</button>
      <button className="meta-link" onClick={() => setActiveModal('how')}>¿Cómo funciona?</button>
      <a href="/contact" className="meta-link">Contacto</a>

      {/* Modal: Acerca de */}
      {activeModal === 'about' && (
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

      {/* Modal: Cómo funciona */}
      {activeModal === 'how' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-icon">📜</span>
              <h2>¿Cómo funciona?</h2>
            </div>
            <div className="modal-body">
              <ol>
                <li><strong>Regístrate</strong> con tu seudónimo y tus datos.</li>
                <li>Elige la opción de escribir para que se te asigne tu parte en historia.</li>
                <li>Escribe una colaboración y envíala.</li>
                <li>Cuando la historia esté completa, pasa a ser pública para su lectura.</li>
              </ol>
              <p>
                .
              </p>
            </div>
            <button className="modal-close" onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoModals;