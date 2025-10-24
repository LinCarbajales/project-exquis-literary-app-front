import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCollaborationsByStory } from '../../services/api';
import './StoryDetailPage.css';
import Collaboration from '../../components/collaboration/Collaboration';
import Button from '../../components/Button/Button';

const StoryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [collaborations, setCollaborations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoryCollaborations = async () => {
      try {
        setIsLoading(true);
        const data = await getCollaborationsByStory(id);
        setCollaborations(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar la historia:', err);
        setError('No se pudo cargar la historia');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoryCollaborations();
  }, [id]);

  const handleBack = () => {
    navigate('/stories');
  };

  return (
    <div className="story-detail-page">
      <div className="story-detail-container">
        {/* Header con botón de volver */}
        <div className="story-detail-header">
          <Button variant="secondary" onClick={handleBack}>
            ← Volver a historias
          </Button>
          {!isLoading && !error && (
            <div className="story-info-badge">
              {collaborations.length} colaboraciones
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="loading-state">
            <p>⏳ Cargando historia...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="error-state">
            <p>❌ {error}</p>
            <Button onClick={handleBack}>Volver a historias</Button>
          </div>
        )}

        {/* Collaborations */}
        {!isLoading && !error && collaborations.length > 0 && (
          <div className="collaborations-container">
            <h1 className="story-title">Cadáver exquisito</h1>
            
            <div className="collaborations-list">
              {collaborations.map((collaboration, index) => (
                <Collaboration
                    key={collaboration.id}
                    username={collaboration.user?.username || 'Anónimo'}
                    text={collaboration.text}
                    orderNumber={collaboration.orderNumber}
                    showSeparator={index < collaborations.length - 1}
                    isPrevious={false}
                />
              ))}
            </div>

            <div className="story-end-mark">
              <span>✦ Fin de la historia ✦</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && collaborations.length === 0 && (
          <div className="empty-state">
            <p>Esta historia no tiene colaboraciones aún.</p>
            <Button onClick={handleBack}>Volver a historias</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryDetailPage;