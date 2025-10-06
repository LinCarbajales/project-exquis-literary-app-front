import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import './StoryParticipate.css';

const StoryParticipate = () => {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Detectar si es una historia nueva (sin storyId o con parámetro new)
  const isNewStory = !storyId || location.pathname.includes('/new');
  
  // Estados
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [contribution, setContribution] = useState({ 
    title: '',
    genre: '',
    line1: '', 
    line2: '' 
  });
  const [errors, setErrors] = useState({});
  const [charCount, setCharCount] = useState({ 
    title: 0,
    line1: 0, 
    line2: 0 
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  
  // Referencias
  const titleRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  
  // Límites de caracteres
  const MAX_CHARS = 150;
  const MAX_TITLE_CHARS = 80;
  
  // Géneros disponibles
  const GENRES = [
    'Misterio', 
    'Fantasía', 
    'Ciencia Ficción', 
    'Romance', 
    'Terror', 
    'Aventura',
    'Drama',
    'Comedia',
    'Histórica',
    'Otro'
  ];
  
  // Usuario mock
  const user = {
    id: 1,
    username: 'EscritoraMisteriosa',
    avatar: null
  };

  // Cargar datos de la historia (solo si existe)
  useEffect(() => {
    const fetchStory = async () => {
      setLoading(true);
      
      if (isNewStory) {
        // Para historia nueva, no hay nada que cargar
        setStory(null);
        setLoading(false);
        return;
      }
      
      // Simulación de carga para historia existente
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStory = {
        id: storyId,
        title: 'El Misterio del Bosque Encantado',
        status: 'in_progress',
        currentLine: 7,
        maxLines: 20,
        participants: [
          { id: 1, username: 'PoetaUrbano', avatar: null },
          { id: 2, username: 'CuentacuentosNocturno', avatar: null },
          { id: 3, username: 'DreamerWriter', avatar: null }
        ],
        lastLine: 'Los árboles susurraban secretos antiguos mientras la niebla se alzaba desde el suelo del bosque.',
        previousAuthor: {
          id: 3,
          username: 'DreamerWriter',
          avatar: null
        },
        createdAt: '2024-09-20T10:30:00Z',
        timeLimit: 24,
        nextDeadline: new Date(Date.now() + 18 * 60 * 60 * 1000),
        genre: 'Misterio',
        isParticipant: false
      };
      
      setStory(mockStory);
      
      // Calcular tiempo restante
      if (mockStory.nextDeadline) {
        const updateTimer = () => {
          const now = new Date().getTime();
          const deadline = new Date(mockStory.nextDeadline).getTime();
          const difference = deadline - now;
          
          if (difference > 0) {
            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            setTimeLeft({ hours, minutes });
          } else {
            setTimeLeft({ hours: 0, minutes: 0 });
          }
        };
        
        updateTimer();
        const timer = setInterval(updateTimer, 60000);
        
        return () => clearInterval(timer);
      }
      
      setLoading(false);
    };

    fetchStory();
  }, [storyId, isNewStory]);

  // Manejar cambios en el texto
  const handleInputChange = (field, value) => {
    const maxChars = field === 'title' ? MAX_TITLE_CHARS : MAX_CHARS;
    
    if (value.length <= maxChars) {
      setContribution(prev => ({
        ...prev,
        [field]: value
      }));
      
      if (field === 'title' || field === 'line1' || field === 'line2') {
        setCharCount(prev => ({
          ...prev,
          [field]: value.length
        }));
      }
      
      // Limpiar errores al escribir
      if (errors[field]) {
        setErrors(prev => ({
          ...prev,
          [field]: ''
        }));
      }
    }
  };

  // Validar contribución
  const validateContribution = () => {
    const newErrors = {};
    
    // Validaciones específicas para nueva historia
    if (isNewStory) {
      if (!contribution.title.trim()) {
        newErrors.title = 'El título es obligatorio';
      } else if (contribution.title.trim().length < 5) {
        newErrors.title = 'El título debe tener al menos 5 caracteres';
      }
      
      if (!contribution.genre) {
        newErrors.genre = 'Selecciona un género';
      }
    }
    
    // Validaciones comunes para ambos casos
    if (!contribution.line1.trim()) {
      newErrors.line1 = 'La primera línea es obligatoria';
    } else if (contribution.line1.trim().length < 10) {
      newErrors.line1 = 'La línea debe tener al menos 10 caracteres';
    }
    
    if (!contribution.line2.trim()) {
      newErrors.line2 = 'La segunda línea es obligatoria';
    } else if (contribution.line2.trim().length < 10) {
      newErrors.line2 = 'La línea debe tener al menos 10 caracteres';
    }
    
    return newErrors;
  };

  // Enviar contribución
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateContribution();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setSubmitting(true);
    
    try {
      console.log(isNewStory ? 'Creando nueva historia:' : 'Enviando contribución:', {
        storyId,
        contribution,
        userId: user.id
      });
      
      // Simulación de envío
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccess(true);
      
      // Redirigir después de unos segundos
      setTimeout(() => {
        if (isNewStory) {
          navigate('/dashboard');
        } else {
          navigate(`/story/${storyId}/complete`);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error al enviar:', error);
      setErrors({ 
        general: isNewStory 
          ? 'Error al crear la historia. Inténtalo de nuevo.' 
          : 'Error al enviar la contribución. Inténtalo de nuevo.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-focus
  useEffect(() => {
    if (!loading) {
      if (isNewStory && titleRef.current) {
        titleRef.current.focus();
      } else if (!isNewStory && line1Ref.current) {
        line1Ref.current.focus();
      }
    }
  }, [loading, isNewStory]);

  if (loading && !isNewStory) {
    return (
      <>
        <div className="story-participate-container">
          <div className="loading-state">
            <div className="loading-spinner-large"></div>
            <p>Cargando historia...</p>
          </div>
        </div>
        
      </>
    );
  }

  if (!story && !isNewStory && !loading) {
    return (
      <>
        <div className="story-participate-container">
          <div className="error-state">
            <h2>Historia no encontrada</h2>
            <p>La historia que buscas no existe o ya no está disponible.</p>
            <Link to="/dashboard" className="btn btn-primary">
              Volver al escritorio
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      
      
      <div className="story-participate-container">
        <main className="participate-content">
          {/* Cabecera */}
          <div className="story-header">
            <div className="breadcrumb">
              <Link to="/dashboard">Escritorio</Link>
              <span className="separator">›</span>
              {isNewStory ? (
                <span className="current">Nueva Historia</span>
              ) : (
                <>
                  <Link to="/stories">Historias</Link>
                  <span className="separator">›</span>
                  <span className="current">{story.title}</span>
                </>
              )}
            </div>
            
            {isNewStory ? (
              <div className="story-info new-story">
                <div className="new-story-icon">✨</div>
                <h1 className="story-title">Comienza una Nueva Historia</h1>
                <p className="story-description">
                  Sé el primero en escribir. Crea un título intrigante y escribe las dos primeras líneas 
                  que darán comienzo a una historia colaborativa única.
                </p>
              </div>
            ) : (
              <div className="story-info">
                <h1 className="story-title">{story.title}</h1>
                <div className="story-meta">
                  <span className="genre-badge">{story.genre}</span>
                  <span className="progress-info">
                    Línea {story.currentLine} de {story.maxLines}
                  </span>
                  {timeLeft && (
                    <span className="time-left">
                      ⏰ {timeLeft.hours}h {timeLeft.minutes}m restantes
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Progreso (solo para historias existentes) */}
          {!isNewStory && (
            <div className="progress-section">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(story.currentLine / story.maxLines) * 100}%` }}
                ></div>
              </div>
              <div className="participants-row">
                <div className="participants-label">Participantes:</div>
                <div className="participants-list">
                  {story.participants.map(participant => (
                    <div key={participant.id} className="participant-avatar" title={participant.username}>
                      {participant.avatar ? (
                        <img src={participant.avatar} alt={participant.username} />
                      ) : (
                        <div className="avatar-placeholder">
                          {participant.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Última línea (solo para historias existentes) */}
          {!isNewStory && (
            <div className="last-line-section">
              <div className="last-line-header">
                <h3>Continúa la historia desde aquí:</h3>
                <div className="last-author">
                  Escrito por{' '}
                  <Link to={`/profile/${story.previousAuthor.id}`} className="author-link">
                    {story.previousAuthor.username}
                  </Link>
                </div>
              </div>
              
              <div className="last-line-container">
                <div className="line-number">Línea {story.currentLine}</div>
                <div className="last-line-text">
                  "{story.lastLine}"
                </div>
                <div className="continuation-hint">
                  <span className="dots">...</span>
                  <span className="hint-text">¿Qué sucede después?</span>
                </div>
              </div>
            </div>
          )}

          {/* Formulario */}
          {showSuccess ? (
            <div className="success-section">
              <div className="success-animation">✨</div>
              <h3>
                {isNewStory ? '¡Historia creada!' : '¡Contribución enviada!'}
              </h3>
              <p>
                {isNewStory 
                  ? 'Tu historia ha sido publicada. ¡Esperamos que otros escritores se unan pronto!'
                  : 'Tu parte de la historia ha sido añadida con éxito. Redirigiendo...'
                }
              </p>
            </div>
          ) : (
            <div className="contribution-section">
              <form onSubmit={handleSubmit} className="contribution-form">
                <div className="form-header">
                  <h3>
                    {isNewStory ? 'Escribe el comienzo:' : 'Tus dos líneas:'}
                  </h3>
                  <p className="instruction">
                    {isNewStory 
                      ? 'Crea un título atractivo y escribe las dos primeras líneas de tu historia.'
                      : 'Recuerda: Solo puedes ver la última línea. ¡Deja volar tu imaginación!'
                    }
                  </p>
                </div>

                {errors.general && (
                  <div className="error-message general-error">
                    {errors.general}
                  </div>
                )}

                {/* Campos específicos para nueva historia */}
                {isNewStory && (
                  <>
                    <div className="new-story-fields">
                      <div className="line-input-group">
                        <label htmlFor="title" className="line-label">
                          Título de la Historia
                        </label>
                        <div className="textarea-container">
                          <input
                            ref={titleRef}
                            type="text"
                            id="title"
                            value={contribution.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className={`line-input title-input ${errors.title ? 'error' : ''}`}
                            placeholder="Un título intrigante que invite a participar..."
                            disabled={submitting}
                          />
                          <div className="char-counter">
                            <span className={charCount.title > MAX_TITLE_CHARS * 0.9 ? 'warning' : ''}>
                              {charCount.title}/{MAX_TITLE_CHARS}
                            </span>
                          </div>
                        </div>
                        {errors.title && (
                          <span className="error-message">{errors.title}</span>
                        )}
                      </div>

                      <div className="line-input-group">
                        <label htmlFor="genre" className="line-label">
                          Género
                        </label>
                        <select
                          id="genre"
                          value={contribution.genre}
                          onChange={(e) => handleInputChange('genre', e.target.value)}
                          className={`genre-select ${errors.genre ? 'error' : ''}`}
                          disabled={submitting}
                        >
                          <option value="">Selecciona un género...</option>
                          {GENRES.map(genre => (
                            <option key={genre} value={genre}>{genre}</option>
                          ))}
                        </select>
                        {errors.genre && (
                          <span className="error-message">{errors.genre}</span>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Campos comunes para ambos casos */}
                <div className="lines-container">
                  <div className="line-input-group">
                    <label htmlFor="line1" className="line-label">
                      {isNewStory ? 'Primera línea' : `Línea ${story?.currentLine + 1 || 1}`}
                    </label>
                    <div className="textarea-container">
                      <textarea
                        ref={line1Ref}
                        id="line1"
                        value={contribution.line1}
                        onChange={(e) => handleInputChange('line1', e.target.value)}
                        className={`line-input ${errors.line1 ? 'error' : ''}`}
                        placeholder={
                          isNewStory 
                            ? "Érase una vez..." 
                            : "Continúa la historia con tu primera línea..."
                        }
                        rows="2"
                        disabled={submitting}
                      />
                      <div className="char-counter">
                        <span className={charCount.line1 > MAX_CHARS * 0.9 ? 'warning' : ''}>
                          {charCount.line1}/{MAX_CHARS}
                        </span>
                      </div>
                    </div>
                    {errors.line1 && (
                      <span className="error-message">{errors.line1}</span>
                    )}
                  </div>

                  <div className="line-input-group">
                    <label htmlFor="line2" className="line-label">
                      {isNewStory ? 'Segunda línea' : `Línea ${story?.currentLine + 2 || 2}`}
                    </label>
                    <div className="textarea-container">
                      <textarea
                        ref={line2Ref}
                        id="line2"
                        value={contribution.line2}
                        onChange={(e) => handleInputChange('line2', e.target.value)}
                        className={`line-input ${errors.line2 ? 'error' : ''}`}
                        placeholder={
                          isNewStory 
                            ? "Y entonces..." 
                            : "Y completa con tu segunda línea..."
                        }
                        rows="2"
                        disabled={submitting}
                      />
                      <div className="char-counter">
                        <span className={charCount.line2 > MAX_CHARS * 0.9 ? 'warning' : ''}>
                          {charCount.line2}/{MAX_CHARS}
                        </span>
                      </div>
                    </div>
                    {errors.line2 && (
                      <span className="error-message">{errors.line2}</span>
                    )}
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate(-1)}
                    disabled={submitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-primary ${submitting ? 'loading' : ''}`}
                    disabled={submitting || !contribution.line1.trim() || !contribution.line2.trim()}
                  >
                    {submitting ? (
                      <>
                        <span className="loading-spinner"></span>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <span className="submit-icon">✍️</span>
                        {isNewStory ? 'Crear Historia' : 'Añadir mi contribución'}
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Tips */}
              <div className="writing-tips">
                <h4>💡 Tips para escribir:</h4>
                <ul>
                  {isNewStory ? (
                    <>
                      <li>Elige un título que despierte la curiosidad</li>
                      <li>Establece un tono y atmósfera desde el inicio</li>
                      <li>Introduce elementos intrigantes o misteriosos</li>
                      <li>Deja espacio para que otros desarrollen la historia</li>
                    </>
                  ) : (
                    <>
                      <li>Mantén el tono y estilo de la línea anterior</li>
                      <li>Añade tensión, misterio o un giro inesperado</li>
                      <li>Piensa en cómo tu contribución puede inspirar al siguiente escritor</li>
                      <li>¡Sé creativo pero coherente con la historia!</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default StoryParticipate;