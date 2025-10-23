import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { assignStory, createCollaboration, unlockStory } from '../../services/api';
import './CollaboratePage.css';
import Collaboration from '../../components/collaboration/Collaboration';
import Button from '../../components/Button/Button';

const CollaboratePage = () => {
  const navigate = useNavigate();
  const hasRequestedStory = useRef(false);

  const [story, setStory] = useState(null);
  const [previousCollaboration, setPreviousCollaboration] = useState(null);
  const [collaborationText, setCollaborationText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60);
  const [error, setError] = useState(null);

  // 🔹 1. Al cargar la página, pedir una historia libre (solo UNA vez)
  useEffect(() => {
    if (hasRequestedStory.current) return;
    hasRequestedStory.current = true;

    const fetchStory = async () => {
      try {
        console.log('📡 Solicitando historia...');
        const storyData = await assignStory();
        console.log('✅ Historia asignada:', storyData);
        setStory(storyData);

        if (storyData.previousCollaboration) {
          setPreviousCollaboration(storyData.previousCollaboration);
        }
      } catch (error) {
        console.error("❌ Error al asignar historia:", error);
        const errorMsg = error.response?.data?.message || error.message;
        setError(errorMsg);
        alert(`Error: ${errorMsg}`);
        navigate("/");
      }
    };

    fetchStory();
  }, [navigate]);

  // 🔹 2. Función estable para abandonar (con useCallback)
  const handleAbandon = useCallback(async (showConfirm = true) => {
    if (showConfirm) {
      const confirmAbandon = window.confirm(
        "¿Seguro que deseas abandonar? La historia se desbloqueará para otros usuarios."
      );
      if (!confirmAbandon) return;
    }

    if (story) {
      try {
        console.log('🔓 Abandonando historia:', story.storyId);
        await unlockStory(story.storyId);
        console.log('✅ Historia desbloqueada al abandonar');
      } catch (err) {
        console.error("❌ Error al desbloquear historia:", err);
      }
    }
    navigate("/");
  }, [story, navigate]);

  // 🔹 3. Temporizador (30 min)
  useEffect(() => {
    if (!story) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          alert("⏰ Tiempo agotado. La historia se desbloqueará.");
          handleAbandon(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [story, handleAbandon]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 🔹 4. Enviar colaboración
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (collaborationText.length < 40 || collaborationText.length > 260) {
      alert("La colaboración debe tener entre 40 y 260 caracteres.");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('📤 Enviando colaboración para historia:', story.storyId);
      
      await createCollaboration(story.storyId, collaborationText);
      console.log('✅ Colaboración enviada');
      
      console.log('🔓 Desbloqueando historia:', story.storyId);
      await unlockStory(story.storyId);
      console.log('✅ Historia desbloqueada');
      
      alert("¡Colaboración enviada con éxito!");
      navigate("/");
    } catch (error) {
      console.error("❌ Error al enviar colaboración:", error);
      console.error("Response:", error.response?.data);
      console.error("Status:", error.response?.status);
      
      const errorMsg = error.response?.data?.message || error.message;
      alert(`Error: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔹 5. Loading state
  if (error) {
    return (
      <div className="collaborate-page">
        <div className="collaborate-container">
          <p className="error-message">❌ {error}</p>
          <Button onClick={() => navigate("/")}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="collaborate-page">
        <div className="collaborate-container">
          <p>⏳ Cargando historia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="collaborate-page">
      <div className="collaborate-container">
        {/* Temporizador */}
        <div className="collaborate-info">
          <div className="timer-badge">
            ⏱️ {formatTime(timeRemaining)}
          </div>
        </div>

        {/* Instrucciones */}
        <div className="collaborate-instructions">
          <p className="instruction-main">
            Escribe una colaboración de entre 40 y 260 caracteres. ¡Usa tu imaginación!
          </p>
          <p className="instruction-detail">
            Tienes un máximo de 30 minutos para escribir tu colaboración.
          </p>
        </div>

        {/* Colaboración previa */}
        {previousCollaboration && (
          <div className="previous-collaboration-wrapper">
            <Collaboration
              username={previousCollaboration.username}
              text={previousCollaboration.text}
              isPrevious={true}
              showSeparator={true}
            />
          </div>
        )}

        {/* Número de colaboración */}
        <div className="collaboration-number-banner">
          Colaboración {story.currentCollaborationNumber} de {story.extension}
        </div>

        {/* Formulario */}
        <form className="collaborate-form" onSubmit={handleSubmit}>
          <textarea
            className="collaborate-textarea"
            value={collaborationText}
            onChange={(e) => setCollaborationText(e.target.value)}
            placeholder="Escribe tu colaboración..."
            maxLength={260}
            disabled={isSubmitting}
          />
          <div className="char-counter">
            {collaborationText.length} / 260 caracteres
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="tertiary"
              onClick={() => handleAbandon(true)}
              disabled={isSubmitting}
            >
              Abandonar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || collaborationText.length < 40}
            >
              {isSubmitting ? "Enviando..." : "Enviar Colaboración"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollaboratePage;