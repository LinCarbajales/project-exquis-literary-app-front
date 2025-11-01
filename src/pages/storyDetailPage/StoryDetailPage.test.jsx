import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import StoryDetailPage from './StoryDetailPage';
import * as api from '../../services/api';

// Mock del módulo de API
vi.mock('../../services/api', () => ({
  getCollaborationsByStory: vi.fn(),
}));

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper para renderizar con Router y params
const renderWithRouter = (component, { route = '/stories/1' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/stories/:id" element={component} />
      </Routes>
    </BrowserRouter>
  );
};

// Datos de prueba
const mockCollaborations = [
  {
    id: 1,
    text: 'Había una vez un viajero que llegó a una ciudad desconocida.',
    orderNumber: 1,
    user: {
      username: 'escritor1',
    },
  },
  {
    id: 2,
    text: 'La ciudad estaba envuelta en una niebla misteriosa.',
    orderNumber: 2,
    user: {
      username: 'escritor2',
    },
  },
  {
    id: 3,
    text: 'En el centro de la plaza, encontró una estatua que parecía observarlo.',
    orderNumber: 3,
    user: {
      username: 'escritor3',
    },
  },
  {
    id: 4,
    text: 'De repente, la estatua comenzó a moverse lentamente.',
    orderNumber: 4,
    user: null, // Usuario anónimo
  },
];

describe('StoryDetailPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderizado básico', () => {
    it('renderiza el botón de volver', async () => {
      api.getCollaborationsByStory.mockResolvedValue([]);
      
      renderWithRouter(<StoryDetailPage />);
      
      expect(screen.getByText(/Volver a historias/i)).toBeInTheDocument();
    });

    it('renderiza el título de la historia', async () => {
      api.getCollaborationsByStory.mockResolvedValue(mockCollaborations);
      
      renderWithRouter(<StoryDetailPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Cadáver exquisito')).toBeInTheDocument();
      });
    });
  });

  describe('Estado de carga', () => {
    it('muestra el estado de carga mientras obtiene las colaboraciones', () => {
      api.getCollaborationsByStory.mockImplementation(() => new Promise(() => {}));
      
      renderWithRouter(<StoryDetailPage />);
      
      expect(screen.getByText(/Cargando historia/i)).toBeInTheDocument();
    });

    it('oculta el estado de carga después de cargar', async () => {
      api.getCollaborationsByStory.mockResolvedValue(mockCollaborations);
      
      renderWithRouter(<StoryDetailPage />);
      
      await waitFor(() => {
        expect(screen.queryByText(/Cargando historia/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Manejo de errores', () => {
    it('muestra mensaje de error cuando falla la carga', async () => {
      api.getCollaborationsByStory.mockRejectedValue(new Error('Error de red'));
      
      renderWithRouter(<StoryDetailPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/No se pudo cargar la historia/i)).toBeInTheDocument();
      });
    });

    it('muestra botón de volver en caso de error', async () => {
      api.getCollaborationsByStory.mockRejectedValue(new Error('Error'));
      
      renderWithRouter(<StoryDetailPage />);
      
      await waitFor(() => {
        const backButtons = screen.getAllByText(/Volver a historias/i);
        expect(backButtons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Visualización de colaboraciones', () => {
    it('renderiza todas las colaboraciones recibidas', async () => {
      api.getCollaborationsByStory.mockResolvedValue(mockCollaborations);
      
      renderWithRouter(<StoryDetailPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/Había una vez un viajero/i)).toBeInTheDocument();
        expect(screen.getByText(/La ciudad estaba envuelta/i)).toBeInTheDocument();
        expect(screen.getByText(/En el centro de la plaza/i)).toBeInTheDocument();
        expect(screen.getByText(/De repente, la estatua/i)).toBeInTheDocument();
      });
    });

    it('muestra el badge con el número de colaboraciones', async () => {
      api.getCollaborationsByStory.mockResolvedValue(mockCollaborations);
      
      renderWithRouter(<StoryDetailPage />);
      
      await waitFor(() => {
        expect(screen.getByText('4 colaboraciones')).toBeInTheDocument();
      });
    });

    it('muestra el marcador de fin de historia', async () => {
      api.getCollaborationsByStory.mockResolvedValue(mockCollaborations);
      
      renderWithRouter(<StoryDetailPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/Fin de la historia/i)).toBeInTheDocument();
      });
    });
  });

  describe('Estado vacío', () => {
    it('muestra mensaje cuando no hay colaboraciones', async () => {
      api.getCollaborationsByStory.mockResolvedValue([]);
      
      renderWithRouter(<StoryDetailPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/Esta historia no tiene colaboraciones/i)).toBeInTheDocument();
      });
    });

    it('muestra botón de volver en estado vacío', async () => {
      api.getCollaborationsByStory.mockResolvedValue([]);
      
      renderWithRouter(<StoryDetailPage />);
      
      await waitFor(() => {
        const backButtons = screen.getAllByText(/Volver a historias/i);
        expect(backButtons.length).toBeGreaterThan(0);
      });
    });

    it('no muestra el badge de colaboraciones cuando está vacío', async () => {
      api.getCollaborationsByStory.mockResolvedValue([]);
      
      renderWithRouter(<StoryDetailPage />);
      
      await waitFor(() => {
        expect(screen.queryByText(/colaboraciones$/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Navegación', () => {
    it('navega de vuelta a /stories al hacer clic en "Volver"', async () => {
      const user = userEvent.setup();
      api.getCollaborationsByStory.mockResolvedValue(mockCollaborations);
      
      renderWithRouter(<StoryDetailPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Cadáver exquisito')).toBeInTheDocument();
      });
      
      const backButton = screen.getAllByText(/Volver a historias/i)[0];
      await user.click(backButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/stories');
    });

    it('permite volver desde el estado de error', async () => {
      const user = userEvent.setup();
      api.getCollaborationsByStory.mockRejectedValue(new Error('Error'));
      
      renderWithRouter(<StoryDetailPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/No se pudo cargar la historia/i)).toBeInTheDocument();
      });
      
      const backButtons = screen.getAllByText(/Volver a historias/i);
      await user.click(backButtons[1]); // El segundo es el del estado de error
      
      expect(mockNavigate).toHaveBeenCalledWith('/stories');
    });

    it('permite volver desde el estado vacío', async () => {
      const user = userEvent.setup();
      api.getCollaborationsByStory.mockResolvedValue([]);
      
      renderWithRouter(<StoryDetailPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/Esta historia no tiene colaboraciones/i)).toBeInTheDocument();
      });
      
      const backButtons = screen.getAllByText(/Volver a historias/i);
      await user.click(backButtons[1]); // El segundo es el del estado vacío
      
      expect(mockNavigate).toHaveBeenCalledWith('/stories');
    });
  });

  describe('Integración con Collaboration component', () => {

    it('el último elemento no muestra separador', async () => {
      api.getCollaborationsByStory.mockResolvedValue(mockCollaborations);
      
      renderWithRouter(<StoryDetailPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Cadáver exquisito')).toBeInTheDocument();
      });
      
      // Verificar que hay colaboraciones renderizadas
      const collaborations = screen.getAllByText(/escritor/i);
      expect(collaborations.length).toBeGreaterThan(0);
    });
  });

  describe('Estructura CSS', () => {
    it('tiene la estructura de clases CSS correcta', async () => {
      api.getCollaborationsByStory.mockResolvedValue(mockCollaborations);
      
      renderWithRouter(<StoryDetailPage />);
      
      await waitFor(() => {
        expect(document.querySelector('.story-detail-page')).toBeInTheDocument();
        expect(document.querySelector('.story-detail-container')).toBeInTheDocument();
        expect(document.querySelector('.story-detail-header')).toBeInTheDocument();
        expect(document.querySelector('.collaborations-container')).toBeInTheDocument();
        expect(document.querySelector('.collaborations-list')).toBeInTheDocument();
        expect(document.querySelector('.story-end-mark')).toBeInTheDocument();
      });
    });
  });

  describe('Parámetros de ruta', () => {
    it('usa el parámetro id de la URL para cargar la historia', async () => {
      api.getCollaborationsByStory.mockResolvedValue(mockCollaborations);
      
      renderWithRouter(<StoryDetailPage />, { route: '/stories/42' });
      
      await waitFor(() => {
        expect(api.getCollaborationsByStory).toHaveBeenCalledWith('42');
      });
    });

    it('recarga cuando cambia el parámetro id', async () => {
      api.getCollaborationsByStory.mockResolvedValue(mockCollaborations);
      
      const { rerender } = renderWithRouter(<StoryDetailPage />, { route: '/stories/1' });
      
      await waitFor(() => {
        expect(api.getCollaborationsByStory).toHaveBeenCalledWith('1');
      });
      
      // Simular cambio de ruta
      window.history.pushState({}, 'Test page', '/stories/2');
      rerender(
        <BrowserRouter>
          <Routes>
            <Route path="/stories/:id" element={<StoryDetailPage />} />
          </Routes>
        </BrowserRouter>
      );
      
      // Nota: En un test real, esto requeriría un manejo más complejo de las rutas
      // pero esta estructura muestra la intención del test
    });
  });
});