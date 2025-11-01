import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Header from './Header'
import { AuthContext } from '../../context/AuthContext'

// Mock del AuthService para evitar llamadas reales
vi.mock('../../services/auth/AuthService', () => ({
  default: {
    getToken: vi.fn(() => null),
    getCurrentUser: vi.fn(),
    clearSession: vi.fn(),
    loginUser: vi.fn(),
    logoutUser: vi.fn(() => Promise.resolve()),
  },
}))

// Helper para crear valores del contexto
const createAuthContext = (overrides = {}) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
  updateUser: vi.fn(),
  ...overrides,
})

// Helper para renderizar con Router y Context
const renderHeader = (authValues = {}) => {
  const contextValue = createAuthContext(authValues)
  
  return {
    ...render(
      <BrowserRouter>
        <AuthContext.Provider value={contextValue}>
          <Header />
        </AuthContext.Provider>
      </BrowserRouter>
    ),
    contextValue,
  }
}

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Renderizado básico', () => {
    it('renderiza el logo correctamente', () => {
      renderHeader()
      
      expect(screen.getByText('Exquis')).toBeInTheDocument()
      expect(screen.getByText('Historias Colaborativas')).toBeInTheDocument()
    })

    it('el logo apunta a la página principal', () => {
      renderHeader()
      
      const logoLink = screen.getByText('Exquis').closest('a')
      expect(logoLink).toHaveAttribute('href', '/')
    })

    it('muestra el botón de menú móvil', () => {
      renderHeader()
      
      const mobileMenuBtn = screen.getByLabelText('Menú de navegación')
      expect(mobileMenuBtn).toBeInTheDocument()
    })
  })

  describe('Usuario NO autenticado', () => {
    it('muestra los enlaces para usuarios no autenticados', () => {
      renderHeader({ isAuthenticated: false })
      
      const desktopNav = document.querySelector('.nav-desktop')
      expect(within(desktopNav).getByText('Iniciar Sesión')).toBeInTheDocument()
      expect(within(desktopNav).getByText('Registro')).toBeInTheDocument()
    })

    it('NO muestra el menú de usuario autenticado', () => {
      renderHeader({ isAuthenticated: false })
      
      expect(screen.queryByText('Escritorio')).not.toBeInTheDocument()
      expect(screen.queryByText('Historias')).not.toBeInTheDocument()
      expect(screen.queryByText('Escribir')).not.toBeInTheDocument()
    })
  })

  describe('Usuario autenticado', () => {
    const mockUser = {
      username: 'testuser',
      email: 'test@example.com',
      avatar: null,
    }

    it('muestra los enlaces para usuarios autenticados', () => {
      renderHeader({ 
        isAuthenticated: true, 
        user: mockUser 
      })
      
      const desktopNav = document.querySelector('.nav-desktop')
      expect(within(desktopNav).getByText('Escritorio')).toBeInTheDocument()
      expect(within(desktopNav).getByText('Historias')).toBeInTheDocument()
      expect(within(desktopNav).getByText('Escribir')).toBeInTheDocument()
    })

    it('muestra el nombre de usuario', () => {
      renderHeader({ 
        isAuthenticated: true, 
        user: mockUser 
      })
      
      const usernameElements = screen.getAllByText('testuser')
      expect(usernameElements.length).toBeGreaterThan(0)
    })

    it('muestra la primera letra del usuario como avatar cuando no hay imagen', () => {
      renderHeader({ 
        isAuthenticated: true, 
        user: mockUser 
      })
      
      const avatars = screen.getAllByText('T')
      expect(avatars.length).toBeGreaterThan(0)
    })

    it('muestra la imagen del avatar cuando existe', () => {
      const userWithAvatar = {
        ...mockUser,
        avatar: 'https://example.com/avatar.jpg',
      }
      
      renderHeader({ 
        isAuthenticated: true, 
        user: userWithAvatar 
      })
      
      const avatarImgs = screen.getAllByAltText('testuser')
      expect(avatarImgs.length).toBeGreaterThan(0)
      expect(avatarImgs[0]).toHaveAttribute('src', 'https://example.com/avatar.jpg')
    })

    it('NO muestra enlaces de usuario no autenticado', () => {
      renderHeader({ 
        isAuthenticated: true, 
        user: mockUser 
      })
      
      const desktopNav = document.querySelector('.nav-desktop')
      expect(within(desktopNav).queryByText('Iniciar Sesión')).not.toBeInTheDocument()
      expect(within(desktopNav).queryByText('Registro')).not.toBeInTheDocument()
    })
  })

  describe('Dropdown de usuario', () => {
    const mockUser = {
      username: 'testuser',
      email: 'test@example.com',
    }

    it('el dropdown está cerrado inicialmente', () => {
      renderHeader({ 
        isAuthenticated: true, 
        user: mockUser 
      })
      
      const dropdown = document.querySelector('.dropdown')
      expect(dropdown).not.toHaveClass('open')
    })

    it('abre el dropdown al hacer click en el perfil', async () => {
      const user = userEvent.setup()
      renderHeader({ 
        isAuthenticated: true, 
        user: mockUser 
      })
      
      const userButton = screen.getByRole('button', { name: /testuser/i })
      
      await user.click(userButton)
      
      await waitFor(() => {
        const miPerfilLinks = screen.getAllByText('Mi Perfil')
        const dropdownMiPerfil = miPerfilLinks.find(link => 
          link.closest('.dropdown-item')
        )
        expect(dropdownMiPerfil).toBeInTheDocument()
      })
      
      const logoutButtons = screen.getAllByText('Cerrar Sesión')
      expect(logoutButtons.length).toBeGreaterThan(0)
    })

    it('cierra el dropdown al hacer click nuevamente', async () => {
      const user = userEvent.setup()
      renderHeader({ 
        isAuthenticated: true, 
        user: mockUser 
      })
      
      const userButton = screen.getByRole('button', { name: /testuser/i })
      
      await user.click(userButton)
      await waitFor(() => {
        const miPerfilLinks = screen.getAllByText('Mi Perfil')
        const dropdownMiPerfil = miPerfilLinks.find(link => 
          link.closest('.dropdown-item')
        )
        expect(dropdownMiPerfil).toBeInTheDocument()
      })
      
      await user.click(userButton)
      
      await waitFor(() => {
        const dropdown = document.querySelector('.dropdown')
        expect(dropdown).not.toHaveClass('open')
      })
    })

    it('llama a logout cuando se hace click en Cerrar Sesión', async () => {
      const user = userEvent.setup()
      const { contextValue } = renderHeader({ 
        isAuthenticated: true, 
        user: mockUser 
      })
      
      const userButton = screen.getByRole('button', { name: /testuser/i })
      await user.click(userButton)
      
      await waitFor(() => {
        const miPerfilLinks = screen.getAllByText('Mi Perfil')
        const dropdownMiPerfil = miPerfilLinks.find(link => 
          link.closest('.dropdown-item')
        )
        expect(dropdownMiPerfil).toBeInTheDocument()
      })
      
      const logoutButtons = screen.getAllByText('Cerrar Sesión')
      const dropdownLogoutBtn = logoutButtons.find(btn => 
        btn.closest('.dropdown-item')
      )
      
      await user.click(dropdownLogoutBtn)
      
      expect(contextValue.logout).toHaveBeenCalledTimes(1)
    })

    it('tiene los atributos ARIA correctos', () => {
      const mockUser = { username: 'testuser', email: 'test@example.com' }
      renderHeader({ 
        isAuthenticated: true, 
        user: mockUser 
      })
      
      const userButton = screen.getByRole('button', { name: /testuser/i })
      
      expect(userButton).toHaveAttribute('aria-haspopup', 'true')
      expect(userButton).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('Menú móvil', () => {
    const mockUser = {
      username: 'testuser',
      email: 'test@example.com',
    }

    it('está cerrado inicialmente', () => {
      renderHeader({ isAuthenticated: false })
      
      const mobileNav = document.querySelector('.nav-mobile')
      expect(mobileNav).not.toHaveClass('open')
    })

    it('abre el menú móvil al hacer click en el botón hamburguesa', async () => {
      const user = userEvent.setup()
      renderHeader({ isAuthenticated: false })
      
      const mobileMenuBtn = screen.getByLabelText('Menú de navegación')
      await user.click(mobileMenuBtn)
      
      const mobileNav = document.querySelector('.nav-mobile')
      expect(mobileNav).toHaveClass('open')
    })

    it('muestra el overlay cuando el menú está abierto', async () => {
      const user = userEvent.setup()
      renderHeader({ isAuthenticated: false })
      
      const mobileMenuBtn = screen.getByLabelText('Menú de navegación')
      await user.click(mobileMenuBtn)
      
      const overlay = document.querySelector('.mobile-menu-overlay')
      expect(overlay).toBeInTheDocument()
    })

    it('cierra el menú al hacer click en el overlay', async () => {
      const user = userEvent.setup()
      renderHeader({ isAuthenticated: false })
      
      const mobileMenuBtn = screen.getByLabelText('Menú de navegación')
      await user.click(mobileMenuBtn)
      
      const overlay = document.querySelector('.mobile-menu-overlay')
      await user.click(overlay)
      
      await waitFor(() => {
        expect(document.querySelector('.mobile-menu-overlay')).not.toBeInTheDocument()
      })
    })

    it('muestra información del usuario en menú móvil cuando está autenticado', async () => {
      const user = userEvent.setup()
      renderHeader({ 
        isAuthenticated: true, 
        user: mockUser 
      })
      
      const mobileMenuBtn = screen.getByLabelText('Menú de navegación')
      await user.click(mobileMenuBtn)
      
      await waitFor(() => {
        expect(screen.getByText('test@example.com')).toBeInTheDocument()
      })
    })

    it('cierra sesión desde el menú móvil', async () => {
      const user = userEvent.setup()
      const { contextValue } = renderHeader({ 
        isAuthenticated: true, 
        user: mockUser 
      })
      
      const mobileMenuBtn = screen.getByLabelText('Menú de navegación')
      await user.click(mobileMenuBtn)
      
      const logoutButtons = screen.getAllByText('Cerrar Sesión')
      const mobileLogoutBtn = logoutButtons.find(btn => 
        btn.closest('.mobile-logout-btn')
      )
      
      await user.click(mobileLogoutBtn)
      
      expect(contextValue.logout).toHaveBeenCalledTimes(1)
    })

    it('muestra enlaces correctos para usuario no autenticado en móvil', async () => {
      const user = userEvent.setup()
      renderHeader({ isAuthenticated: false })
      
      const mobileMenuBtn = screen.getByLabelText('Menú de navegación')
      await user.click(mobileMenuBtn)
      
      await waitFor(() => {
        const mobileNav = document.querySelector('.nav-mobile.open')
        expect(mobileNav).toBeInTheDocument()
      })
      
      const mobileNav = document.querySelector('.nav-mobile')
      
      expect(within(mobileNav).getByText(/Inicio/i)).toBeInTheDocument()
      expect(within(mobileNav).getByText(/Iniciar Sesión/i)).toBeInTheDocument()
      expect(within(mobileNav).getByText(/Crear Cuenta/i)).toBeInTheDocument()
    })
  })

  describe('Detección de scroll', () => {
    it('añade clase "scrolled" cuando se hace scroll hacia abajo', async () => {
      renderHeader()
      
      const header = document.querySelector('.header')
      expect(header).not.toHaveClass('scrolled')
      
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true })
      window.dispatchEvent(new Event('scroll'))
      
      await waitFor(() => {
        expect(header).toHaveClass('scrolled')
      })
    })

    it('no añade clase "scrolled" cuando el scroll es menor a 20', async () => {
      renderHeader()
      
      const header = document.querySelector('.header')
      
      Object.defineProperty(window, 'scrollY', { value: 10, writable: true })
      window.dispatchEvent(new Event('scroll'))
      
      await waitFor(() => {
        expect(header).not.toHaveClass('scrolled')
      })
    })
  })

  describe('Navegación', () => {
    it('marca el enlace activo correctamente', () => {
      renderHeader({ 
        isAuthenticated: true, 
        user: { username: 'test', email: 'test@test.com' } 
      })
      
      const desktopNav = document.querySelector('.nav-desktop')
      const escritorioLink = within(desktopNav).getByText('Escritorio').closest('a')
      expect(escritorioLink).toHaveClass('active')
    })
  })
})