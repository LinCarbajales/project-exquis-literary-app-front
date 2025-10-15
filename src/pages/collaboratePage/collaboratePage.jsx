import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CollaboratePage.css';
import Collaboration from '../../components/collaboration/Collaboration';
import Button from '../../components/Button/Button';

const CollaboratePage = () => {
  const navigate = useNavigate();

  const [collaborationText, setCollaborationText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60);

  const [collaborationData] = useState({
    collaborationNumber: 4,
    totalCollaborations: 10,
    previousCollaboration: {
      username: 'MariaLiteraria',
      text: 'El reloj marcaba las tres de la madrugada cuando escuché el primer aullido.'
    },
    currentUsername: 'TuUsuario'
  });

  const isFirstCollaboration = !collaborationData.previousCollaboration;
  const charCount = collaborationText.length;
  const isValidLength = charCount >= 40 && charCount <= 260;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAbandon();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidLength) return;

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('¡Colaboración enviada con éxito!');
      navigate('/stories');
    } catch (error) {
      console.error('Error al enviar colaboración:', error);
      alert('Error al enviar la colaboración. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAbandon = () => {
    const confirmAbandon = window.confirm(
      '¿Estás seguro de que quieres abandonar? Tu colaboración quedará disponible para otras personas.'
    );

    if (confirmAbandon) {
      navigate('/participate');
    }
  };

  return (
    <div className="collaborate-page">
      <div className="collaborate-container">

        {/* Información de la historia (solo temporizador ahora) */}
        <div className="collaborate-info">
          <div className="timer-badge">
            <span className="timer-icon">⏱️</span>
            {formatTime(timeRemaining)}
          </div>
        </div>

        {/* Instrucciones */}
        <div className="collaborate-instructions">
          <p className="instruction-main">
            Escribe una colaboración de entre 40 y 260 caracteres. ¡Usa tu imaginación!
          </p>
          {isFirstCollaboration ? (
            <p className="instruction-detail">Es el comienzo de una nueva historia.</p>
          ) : (
            <>
              <p className="instruction-detail">
                Puedes apoyarte en la anterior colaboración escrita para esta historia. Es la única que verás.
              </p>
              <p className="instruction-detail">
                Tienes un máximo de 30 minutos para escribir tu colaboración
              </p>
            </>
          )}
        </div>

        {/* Área de colaboraciones */}
        <div className="collaborations-area">
          {!isFirstCollaboration && (
            <div className="previous-collaboration-wrapper">
              <Collaboration
                username={collaborationData.previousCollaboration.username}
                text={collaborationData.previousCollaboration.text}
                isPrevious={true}
                showSeparator={true}
              />
            </div>
          )}

          {collaborationText && (
            <div className="new-collaboration-preview">
              <Collaboration
                username={collaborationData.currentUsername}
                text={collaborationText}
                isPrevious={false}
                showSeparator={false}
              />
            </div>
          )}
        </div>

        {/* Número de colaboración (nuevo bloque) */}
        <div className="collaboration-number-banner">
          Esta es la colaboración número {collaborationData.collaborationNumber} de una historia de {collaborationData.totalCollaborations}.
        </div>

        {/* Formulario */}
        <form className="collaborate-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <textarea
              className="collaborate-textarea"
              value={collaborationText}
              onChange={(e) => setCollaborationText(e.target.value)}
              placeholder={isFirstCollaboration ? "Inicia una nueva historia..." : "Continúa la historia..."}
              maxLength={260}
              disabled={isSubmitting}
            />
            <div className="char-counter">
              <span className={charCount < 40 || charCount > 260 ? 'invalid' : 'valid'}>
                {charCount} / 260 caracteres
              </span>
              {charCount < 40 && charCount > 0 && (
                <span className="counter-hint">Mínimo 40 caracteres</span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="tertiary"
              size="medium"
              onClick={handleAbandon}
              disabled={isSubmitting}
            >
              Abandonar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="medium"
              disabled={!isValidLength || isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Colaboración'}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CollaboratePage;
