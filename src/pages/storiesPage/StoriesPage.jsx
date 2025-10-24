import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompletedStories } from '../../services/api';
import './StoriesPage.css';

const StoriesPage = () => {
  const navigate = useNavigate();
  
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompletedStories = async () => {
      try {
        setIsLoading(true);
        const data = await getCompletedStories();
        setStories(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar historias:', err);
        setError('No se pudieron cargar las historias completadas');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompletedStories();
  }, []);

  const handleStoryClick = (storyId) => {
    navigate(`/stories/${storyId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  return (
    <div className="stories-page">
      <div className="stories-container">
        {/* Header */}
        <div className="stories-header">
          <h1 className="stories-title">Historias Completadas</h1>
          <p className="stories-subtitle">
            Descubre las historias colectivas que han sido finalizadas por nuestra comunidad
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="loading-state">
            <p>⏳ Cargando historias...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="error-state">
            <p>❌ {error}</p>
          </div>
        )}

        {/* Stories Feed */}
        {!isLoading && !error && stories.length > 0 && (
          <div className="stories-feed">
            {stories.map((story) => (
              <div
                key={story.id}
                className="story-card"
                onClick={() => handleStoryClick(story.id)}
              >
                {/* Story Header */}
                <div className="story-header">
                  <div className="user-info">
                    <span className="username">@{story.firstCollaboration?.user?.username || 'Anónimo'}</span>
                    <span className="dot">•</span>
                    <span className="date">{formatDate(story.createdAt)}</span>
                  </div>
                  <div className="collaborations-badge">
                    {story.totalCollaborations} colaboraciones
                  </div>
                </div>

                {/* Collaboration Text */}
                <p className="collaboration-text">
                  {story.firstCollaboration?.text || 'Sin texto disponible'}
                </p>

                {/* Story Footer */}
                <div className="story-footer">
                  <span className="read-more">Leer historia completa →</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State - mostrar cuando no hay historias */}
        {!isLoading && !error && stories.length === 0 && (
          <div className="empty-state">
            <p className="empty-text">
              Aún no hay historias completadas. ¡Sé el primero en colaborar!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoriesPage;