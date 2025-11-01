import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import StoriesPage from './StoriesPage';
import * as api from '../../services/api';

// Mock del módulo de API
vi.mock('../../services/api', () => ({
  getCompletedStories: vi.fn(),
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

// Helper para renderizar con Router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

// Datos de prueba
const mockStories = [
  {
    id: 1,
    createdAt: '2024-01-15T10:30:00Z',
    totalCollaborations: 5,
    firstCollaboration: {
      text: 'Había una vez un viajero que llegó a una ciudad desconocida...',
      user: {
        username: 'escritor1',
      },
    },
  },
  {
    id: 2,
    createdAt: '2024-02-20T14:45:00Z',
    totalCollaborations: 8,
    firstCollaboration: {
      text: 'En un bosque oscuro, una luz brillante apareció de repente...',
      user: {
        username: 'escritor2',
      },
    },
  },
  {
    id: 3,
    createdAt: '2024-03-10T08:15:00Z',
    totalCollaborations: 3,
    firstCollaboration: {
      text: 'El reloj marcaba las doce cuando todo comenzó a cambiar...',
      user: null, // Usuario anónimo
    },
  },
];

describe('StoriesPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderizado básico', () => {
    it('renderiza el título y subtítulo correctamente', async () => {
      api.getCompletedStories.mockResolvedValue([]);
      
      renderWithRouter(<StoriesPage />);
      
      expect(screen.getByText('Historias Completadas')).toBeInTheDocument();
      expect(screen.getByText(/Descubre las historias colectivas/i)).toBeInTheDocument();
    });
  });

  describe('Estado de carga', () => {
    it('muestra el estado de carga mientras obtiene las historias', () => {
      api.getCompletedStories.mockImplementation(() => new Promise(() => {}));
      
      renderWithRouter(<StoriesPage />);
      
      expect(screen.getByText(/Cargando historias/i)).toBeInTheDocument();
    });

    it('oculta el estado de carga después de cargar las historias', async () => {
      api.getCompletedStories.mockResolvedValue(mockStories);
      
      renderWithRouter(<StoriesPage />);
      
      await waitFor(() => {
        expect(screen.queryByText(/Cargando historias/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Manejo de errores', () => {
    it('muestra mensaje de error cuando falla la carga', async () => {
      api.getCompletedStories.mockRejectedValue(new Error('Error de red'));
      
      renderWithRouter(<StoriesPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/No se pudieron cargar las historias/i)).toBeInTheDocument();
      });
    });

    it('no muestra historias cuando hay un error', async () => {
      api.getCompletedStories.mockRejectedValue(new Error('Error'));
      
      renderWithRouter(<StoriesPage />);
      
      await waitFor(() => {
        expect(screen.queryByText(/colaboraciones/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Visualización de historias', () => {
    it('renderiza todas las historias recibidas', async () => {
      api.getCompletedStories.mockResolvedValue(mockStories);
      
      renderWithRouter(<StoriesPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/Había una vez un viajero/i)).toBeInTheDocument();
        expect(screen.getByText(/En un bosque oscuro/i)).toBeInTheDocument();
        expect(screen.getByText(/El reloj marcaba las doce/i)).toBeInTheDocument();
      });
    });

    it('muestra el nombre de usuario del primer colaborador', async () => {
      api.getCompletedStories.mockResolvedValue(mockStories);
      
      renderWithRouter(<StoriesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('@escritor1')).toBeInTheDocument();
        expect(screen.getByText('@escritor2')).toBeInTheDocument();
      });
    });

    it('muestra "Anónimo" cuando no hay usuario', async () => {
      api.getCompletedStories.mockResolvedValue(mockStories);
      
      renderWithRouter(<StoriesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('@Anónimo')).toBeInTheDocument();
      });
    });

    it('muestra el número de colaboraciones de cada historia', async () => {
      api.getCompletedStories.mockResolvedValue(mockStories);
      
      renderWithRouter(<StoriesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('5 colaboraciones')).toBeInTheDocument();
        expect(screen.getByText('8 colaboraciones')).toBeInTheDocument();
        expect(screen.getByText('3 colaboraciones')).toBeInTheDocument();
      });
    });

    it('formatea correctamente las fechas', async () => {
      api.getCompletedStories.mockResolvedValue([mockStories[0]]);
      
      renderWithRouter(<StoriesPage />);
      
      await waitFor(() => {
        // La fecha debe estar formateada en español
        const dateElements = screen.getAllByText(/enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre/i);
        expect(dateElements.length).toBeGreaterThan(0);
      });
    });

    it('muestra el enlace "Leer historia completa"', async () => {
      api.getCompletedStories.mockResolvedValue(mockStories);
      
      renderWithRouter(<StoriesPage />);
      
      await waitFor(() => {
        const readMoreLinks = screen.getAllByText(/Leer historia completa/i);
        expect(readMoreLinks.length).toBe(mockStories.length);
      });
    });
  });

  describe('Estado vacío', () => {
    it('muestra mensaje cuando no hay historias', async () => {
      api.getCompletedStories.mockResolvedValue([]);
      
      renderWithRouter(<StoriesPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/Aún no hay historias completadas/i)).toBeInTheDocument();
      });
    });

    it('no muestra el feed de historias cuando está vacío', async () => {
      api.getCompletedStories.mockResolvedValue([]);
      
      renderWithRouter(<StoriesPage />);
      
      await waitFor(() => {
        expect(screen.queryByText(/colaboraciones/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Navegación', () => {
    it('navega a la historia cuando se hace clic en una tarjeta', async () => {
      const user = userEvent.setup();
      api.getCompletedStories.mockResolvedValue(mockStories);
      
      renderWithRouter(<StoriesPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/Había una vez un viajero/i)).toBeInTheDocument();
      });
      
      const storyCard = screen.getByText(/Había una vez un viajero/i).closest('.story-card');
      await user.click(storyCard);
      
      expect(mockNavigate).toHaveBeenCalledWith('/stories/1');
    });

    it('navega con el ID correcto para cada historia', async () => {
      const user = userEvent.setup();
      api.getCompletedStories.mockResolvedValue(mockStories);
      
      renderWithRouter(<StoriesPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/En un bosque oscuro/i)).toBeInTheDocument();
      });
      
      const secondStoryCard = screen.getByText(/En un bosque oscuro/i).closest('.story-card');
      await user.click(secondStoryCard);
      
      expect(mockNavigate).toHaveBeenCalledWith('/stories/2');
    });
  });

  describe('Estructura CSS', () => {
    it('tiene la estructura de clases CSS correcta', async () => {
      api.getCompletedStories.mockResolvedValue(mockStories);
      
      renderWithRouter(<StoriesPage />);
      
      await waitFor(() => {
        expect(document.querySelector('.stories-page')).toBeInTheDocument();
        expect(document.querySelector('.stories-container')).toBeInTheDocument();
        expect(document.querySelector('.stories-header')).toBeInTheDocument();
        expect(document.querySelector('.stories-feed')).toBeInTheDocument();
      });
    });

    it('cada historia tiene la estructura correcta', async () => {
      api.getCompletedStories.mockResolvedValue([mockStories[0]]);
      
      renderWithRouter(<StoriesPage />);
      
      await waitFor(() => {
        expect(document.querySelector('.story-card')).toBeInTheDocument();
        expect(document.querySelector('.story-header')).toBeInTheDocument();
        expect(document.querySelector('.collaboration-text')).toBeInTheDocument();
        expect(document.querySelector('.story-footer')).toBeInTheDocument();
      });
    });
  });

  describe('Manejo de texto sin colaboración', () => {
    it('muestra texto por defecto cuando no hay colaboración', async () => {
      const storyWithoutText = [{
        id: 1,
        createdAt: '2024-01-15T10:30:00Z',
        totalCollaborations: 2,
        firstCollaboration: {
          text: null,
          user: { username: 'test' },
        },
      }];
      
      api.getCompletedStories.mockResolvedValue(storyWithoutText);
      
      renderWithRouter(<StoriesPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Sin texto disponible')).toBeInTheDocument();
      });
    });
  });
});