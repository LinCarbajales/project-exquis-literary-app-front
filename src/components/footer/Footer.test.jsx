import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Footer from './Footer'

// Helper para renderizar con Router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Footer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Logo y branding', () => {
    it('renderiza el logo con el texto "Exquis"', () => {
      renderWithRouter(<Footer />)
      
      const logo = screen.getByText('Exquis')
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveClass('logo-main')
    })

    it('el logo es un enlace que apunta a la página principal', () => {
      renderWithRouter(<Footer />)
      
      const logoLink = screen.getByRole('link', { name: /Exquis/i })
      expect(logoLink).toHaveAttribute('href', '/')
    })

    it('renderiza el icono de la pluma decorativa', () => {
      renderWithRouter(<Footer />)
      
      const quill = screen.getByText('🖋️')
      expect(quill).toBeInTheDocument()
      expect(quill).toHaveClass('quill')
    })

    it('no renderiza enlaces a redes sociales', () => {
      renderWithRouter(<Footer />)
      
      const socialLinks = document.querySelector('.social-links')
      expect(socialLinks).not.toBeInTheDocument()
    })
  })

  describe('InfoModals component', () => {
    it('renderiza el componente InfoModals con sus enlaces', () => {
      renderWithRouter(<Footer />)
      
      expect(screen.getByRole('button', { name: /Acerca de/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /¿Cómo funciona?/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Contacto/i })).toBeInTheDocument()
    })

    it('el enlace de Contacto tiene el href correcto con mailto', () => {
      renderWithRouter(<Footer />)
      
      const contactLink = screen.getByRole('link', { name: /Contacto/i })
      expect(contactLink).toHaveAttribute('href', 'mailto:programacionplaceholder@gmail.com')
    })
  })

  describe('Footer Bottom', () => {
    it('renderiza el copyright con el año actual', () => {
      renderWithRouter(<Footer />)
      
      const currentYear = new Date().getFullYear()
      expect(screen.getByText(`© ${currentYear} Exquis - Plataforma de escritura colaborativa`)).toBeInTheDocument()
    })

    it('renderiza el número de versión', () => {
      renderWithRouter(<Footer />)
      
      expect(screen.getByText('v1.0.0')).toBeInTheDocument()
    })

    it('no renderiza enlaces de Términos de Uso ni Política de Privacidad', () => {
      renderWithRouter(<Footer />)
      
      expect(screen.queryByText('Términos de Uso')).not.toBeInTheDocument()
      expect(screen.queryByText('Política de Privacidad')).not.toBeInTheDocument()
    })

    it('no renderiza el separador meta-divider', () => {
      renderWithRouter(<Footer />)
      
      const divider = document.querySelector('.meta-divider')
      expect(divider).not.toBeInTheDocument()
    })
  })

  describe('Estructura CSS', () => {
    it('tiene la estructura CSS correcta', () => {
      renderWithRouter(<Footer />)
      
      expect(document.querySelector('.footer')).toBeInTheDocument()
      expect(document.querySelector('.footer-content')).toBeInTheDocument()
      expect(document.querySelector('.footer-main-simple')).toBeInTheDocument()
      expect(document.querySelector('.brand-section')).toBeInTheDocument()
      expect(document.querySelector('.footer-nav-simple')).toBeInTheDocument()
      expect(document.querySelector('.footer-bottom')).toBeInTheDocument()
      expect(document.querySelector('.footer-bottom-content')).toBeInTheDocument()
      expect(document.querySelector('.footer-copyright')).toBeInTheDocument()
      expect(document.querySelector('.footer-meta')).toBeInTheDocument()
    })
  })
})