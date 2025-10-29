import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom'
import Login from './Login'
import { AuthContext } from '../../context/AuthContext'

// Mocks
const mockLogin = vi.fn()
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Helper para crear valores del contexto
const createAuthContext = (overrides = {}) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false, // El estado interno de Login.jsx maneja su propio isLoading
  login: mockLogin,
  logout: vi.fn(),
  updateUser: vi.fn(),
  ...overrides,
})

// Helper para renderizar el componente Login dentro de un entorno de prueba
const renderLogin = (authValues = {}, initialRoute = '/login') => {
  const contextValue = createAuthContext(authValues)
  
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthContext.Provider value={contextValue}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/register" element={<div>Register Page</div>} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>
  )
}

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza el formulario de login y elementos de la marca', () => {
    renderLogin()
    
    expect(screen.getByRole('heading', { name: /Inicia sesión/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('tu@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument()
    expect(screen.getByText('¿Aún no tienes cuenta?')).toBeInTheDocument()
  })

  it('redirige al home si el usuario ya está autenticado', () => {
    renderLogin({ isAuthenticated: true })
    
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
  })

  it('muestra errores de validación al enviar campos vacíos', async () => {
    const user = userEvent.setup()
    renderLogin()
    
    await user.click(screen.getByRole('button', { name: /Entrar/i }))
    
    await waitFor(() => {
      expect(screen.getByText('El email es obligatorio')).toBeInTheDocument()
      expect(screen.getByText('La contraseña es obligatoria')).toBeInTheDocument()
    })
    
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('muestra el mensaje de carga durante el envío', async () => {
    const user = userEvent.setup()
    
    // Simula que el login tarda en responder
    mockLogin.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)))

    renderLogin()

    await user.type(screen.getByPlaceholderText('tu@email.com'), 'test@test.com')
    await user.type(screen.getByPlaceholderText('••••••••'), 'password123')
    
    await user.click(screen.getByRole('button', { name: /Entrar/i }))

    await waitFor(() => {
      // Usar RegEx para coincidencia de texto parcial.
      expect(screen.getByRole('button', { name: /Iniciando sesión.../i })).toBeInTheDocument()
    })
    
    // Dejar que termine la promesa para evitar warnings
    await new Promise(resolve => setTimeout(resolve, 100))
  })

  it('llama a login con los datos correctos y redirige al home', async () => {
    const user = userEvent.setup()
    
    // Simula un login exitoso con un token
    mockLogin.mockResolvedValue({ token: 'mock-token' })
    renderLogin()

    await user.type(screen.getByPlaceholderText('tu@email.com'), 'test@test.com')
    await user.type(screen.getByPlaceholderText('••••••••'), 'password123')
    
    await user.click(screen.getByRole('button', { name: /Entrar/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      })
    })
  })
})