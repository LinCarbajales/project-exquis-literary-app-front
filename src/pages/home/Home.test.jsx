import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Home from './Home'

// Helper para renderizar con Router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza el título principal y el subtítulo', () => {
    renderWithRouter(<Home />)
    
    // Título principal
    expect(screen.getByText('Exquis')).toBeInTheDocument()
    
    // Subtítulo del logo
    expect(screen.getByText('Historias Colaborativas')).toBeInTheDocument()
    
    // Subtítulo del hero
    expect(screen.getByText(
      /Escribe parte de una historia sin conocer nada más que la última línea./i
    )).toBeInTheDocument()
  })

  it('renderiza la pluma y la gota de tinta como elementos decorativos', () => {
    renderWithRouter(<Home />)
    
    // Icono de la pluma
    expect(screen.getByText('🖋️')).toBeInTheDocument()
    
    // Verifica que existe la clase de la gota de tinta
    const inkDrop = document.querySelector('.hero-ink-drop')
    expect(inkDrop).toBeInTheDocument()
  })

  describe('Botones de acción (Hero Actions)', () => {
    it('renderiza el botón "Comenzar a Escribir" y apunta a /collaborate', () => {
      renderWithRouter(<Home />)
      
      const writeButton = screen.getByRole('link', { name: /Comenzar a Escribir/i })
      
      expect(writeButton).toBeInTheDocument()
      expect(writeButton).toHaveAttribute('href', '/collaborate')
      // ✅ CORRECCIÓN: Verifica la clase específica del variant (btn-primary)
      expect(writeButton).toHaveClass('btn-primary')
    })

    it('renderiza el botón "Conocer Más" y apunta a /about', () => {
      renderWithRouter(<Home />)
      
      const aboutButton = screen.getByRole('link', { name: /Conocer Más/i })
      
      expect(aboutButton).toBeInTheDocument()
      expect(aboutButton).toHaveAttribute('href', '/about')
      // ✅ CORRECCIÓN: Verifica la clase específica del variant (btn-secondary)
      expect(aboutButton).toHaveClass('btn-secondary')
    })
  })

  it('renderiza la ilustración del stack de papeles', () => {
    renderWithRouter(<Home />)
    
    const paperStack = document.querySelector('.hero-illustration .paper-stack')
    expect(paperStack).toBeInTheDocument()
    
    // Opcional: Verificar que las capas de papel están presentes
    expect(document.querySelector('.paper-stack .paper-1')).toBeInTheDocument()
    expect(document.querySelector('.paper-stack .paper-2')).toBeInTheDocument()
    expect(document.querySelector('.paper-stack .paper-3')).toBeInTheDocument()
  })
})