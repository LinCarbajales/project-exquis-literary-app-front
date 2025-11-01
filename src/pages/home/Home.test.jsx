import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
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
    
    expect(screen.getByText('Exquis')).toBeInTheDocument()
    expect(screen.getByText('Historias Colaborativas')).toBeInTheDocument()
    expect(screen.getByText(
      /Escribe parte de una historia sin conocer nada más que la última línea./i
    )).toBeInTheDocument()
  })

  it('renderiza la pluma y la gota de tinta como elementos decorativos', () => {
    renderWithRouter(<Home />)
    
    expect(screen.getByText('🖋️')).toBeInTheDocument()
    
    const inkDrop = document.querySelector('.hero-ink-drop')
    expect(inkDrop).toBeInTheDocument()
  })

  describe('Botones de acción', () => {
    it('renderiza el botón "Comenzar a Escribir" y apunta a /collaborate', () => {
      renderWithRouter(<Home />)
      
      const writeButton = screen.getByRole('link', { name: /Comenzar a Escribir/i })
      
      expect(writeButton).toBeInTheDocument()
      expect(writeButton).toHaveAttribute('href', '/collaborate')
      expect(writeButton).toHaveClass('btn-primary')
    })

    it('renderiza el botón "Conocer Más" como botón', () => {
      renderWithRouter(<Home />)
      
      const aboutButton = screen.getByRole('button', { name: /Conocer Más/i })
      
      expect(aboutButton).toBeInTheDocument()
      expect(aboutButton).toHaveClass('btn-secondary')
    })
  })

  describe('Modal "Acerca de"', () => {
    it('no muestra el modal inicialmente', () => {
      renderWithRouter(<Home />)
      
      expect(screen.queryByText('Acerca de Exquis')).not.toBeInTheDocument()
    })

    it('abre el modal al hacer clic en "Conocer Más"', () => {
      renderWithRouter(<Home />)
      
      const aboutButton = screen.getByRole('button', { name: /Conocer Más/i })
      fireEvent.click(aboutButton)
      
      expect(screen.getByText('Acerca de Exquis')).toBeInTheDocument()
      expect(screen.getByText(/cadáver exquisito/i)).toBeInTheDocument()
    })

    it('cierra el modal al hacer clic en el botón "Cerrar"', () => {
      renderWithRouter(<Home />)
      
      const aboutButton = screen.getByRole('button', { name: /Conocer Más/i })
      fireEvent.click(aboutButton)
      
      expect(screen.getByText('Acerca de Exquis')).toBeInTheDocument()
      
      const closeButton = screen.getByRole('button', { name: /Cerrar/i })
      fireEvent.click(closeButton)
      
      expect(screen.queryByText('Acerca de Exquis')).not.toBeInTheDocument()
    })

    it('cierra el modal al hacer clic en el overlay', () => {
      renderWithRouter(<Home />)
      
      const aboutButton = screen.getByRole('button', { name: /Conocer Más/i })
      fireEvent.click(aboutButton)
      
      expect(screen.getByText('Acerca de Exquis')).toBeInTheDocument()
      
      const overlay = document.querySelector('.modal-overlay')
      fireEvent.click(overlay)
      
      expect(screen.queryByText('Acerca de Exquis')).not.toBeInTheDocument()
    })
  })

  it('renderiza la ilustración del stack de papeles', () => {
    renderWithRouter(<Home />)
    
    const paperStack = document.querySelector('.hero-illustration .paper-stack')
    expect(paperStack).toBeInTheDocument()
    
    expect(document.querySelector('.paper-stack .paper-1')).toBeInTheDocument()
    expect(document.querySelector('.paper-stack .paper-2')).toBeInTheDocument()
    expect(document.querySelector('.paper-stack .paper-3')).toBeInTheDocument()
  })
})