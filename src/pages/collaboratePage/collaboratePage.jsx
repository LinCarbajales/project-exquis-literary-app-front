import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { assignStory, createCollaboration, unlockStory } from '../../services/api';
import './CollaboratePage.css';
import Collaboration from '../../components/collaboration/Collaboration';
import Button from '../../components/Button/Button';
import { useToast } from '../../context/useToast';

const CollaboratePage = () => {
  const navigate = useNavigate();
  const hasRequestedStory = useRef(false);
  const { showToast, showConfirm } = useToast();

  const [story, setStory] = useState(null);
  const [previousCollaboration, setPreviousCollaboration] = useState(null);
  const [collaborationText, setCollaborationText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // fallback 30 min
  const [error, setError] = useState(null);

  // 🔹 Solicita historia y sincroniza el timer real desde el backend
  useEffect(() => {
    if (hasRequestedStory.current) return;
    hasRequestedStory.current = true;

    const fetchStory = async () => {
      try {
        console.log('📡 Solicitando historia...');
        const storyData = await assignStory();
        console.log('✅ Historia asignada:', storyData);
        setStory(storyData);

        // 🕒 Usa el tiempo restante real desde backend si existe
        if (storyData.timeRemaining) {
          setTimeRemaining(storyData.timeRemaining);
        } else if (storyData.timeLimit) {
          setTimeRemaining(storyData.timeLimit);
        }

        if (storyData.previousCollaboration) {
          setPreviousCollaboration(storyData.previousCollaboration);
        }
      } catch (error) {
        console.error("❌ Error al asignar historia:", error);
        const errorMsg = error.response?.data?.message || error.message;
        setError(errorMsg);
        showToast(`Error: ${errorMsg}`, 'error', 4000);
        navigate("/");
      }
    };

    fetchStory();
  }, [navigate, showToast]);

  // 🔹 Función para abandonar historia manual o automático
  const handleAbandon = useCallback(async (showConfirmDialog = true) => {
    if (showConfirmDialog) {
      const confirmed = await showConfirm(
        "¿Seguro que deseas abandonar? La historia se desbloqueará para otros usuarios."
      );
      if (!confirmed) return;
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
  }, [story, navigate, showConfirm]);

  // 🔹 Timer que cuenta hacia atrás y expulsa al expirar
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (!story || hasTimedOut) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setHasTimedOut(true);
          
          // Solo mostrar el toast una vez
          if (!toastShownRef.current) {
            toastShownRef.current = true;
            showToast("⏰ Tiempo agotado.", 'warning', 3000);
            setTimeout(() => handleAbandon(false), 3000);
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [story, handleAbandon, showToast, hasTimedOut]);

  // 🔹 Formatea minutos y segundos
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 🔹 Envío de colaboración
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (collaborationText.length < 40 || collaborationText.length > 260) {
      showToast("La colaboración debe tener entre 40 y 260 caracteres.", 'warning', 3000);
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

      showToast("¡Colaboración enviada con éxito!", 'success', 2500);
      setTimeout(() => navigate("/"), 2500);
    } catch (error) {
      console.error("❌ Error al enviar colaboración:", error);
      const errorMsg = error.response?.data?.message || error.message;
      showToast(`Error: ${errorMsg}`, 'error', 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔹 Renderizado de estados
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

  // 🔹 Render principal
  return (
    <div className="collaborate-page">
      <div className="collaborate-container">
        <div className="collaborate-info">
          <div className="timer-badge">⏱️ {formatTime(timeRemaining)}</div>
        </div>

        <div className="collaborate-instructions">
          <p className="instruction-main">
            Escribe una colaboración de entre 40 y 260 caracteres. ¡Usa tu imaginación!
          </p>
          <p className="instruction-detail">
            Tienes un máximo de 30 minutos para escribir tu colaboración.
          </p>
        </div>

        {previousCollaboration && (
          <div className="previous-collaboration-wrapper">
            <Collaboration
              username={previousCollaboration.user?.username || 'Anónimo'}
              text={previousCollaboration.text}
              isPrevious={true}
              showSeparator={true}
            />
          </div>
        )}

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
