import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InfoModals from './InfoModals';

describe('InfoModals Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Enlaces visibles', () => {
    it('renderiza los tres enlaces: Acerca de, ¿Cómo funciona? y Contacto', () => {
      render(<InfoModals />);
      
      expect(screen.getByRole('button', { name: /Acerca de/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /¿Cómo funciona?/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Contacto/i })).toBeInTheDocument();
    });

    it('el enlace de Contacto tiene el href correcto con mailto', () => {
      render(<InfoModals />);
      
      const contactLink = screen.getByRole('link', { name: /Contacto/i });
      expect(contactLink).toHaveAttribute('href', 'mailto:programacionplaceholder@gmail.com');
    });

    it('los botones tienen la clase CSS correcta', () => {
      render(<InfoModals />);
      
      const aboutButton = screen.getByRole('button', { name: /Acerca de/i });
      const howButton = screen.getByRole('button', { name: /¿Cómo funciona?/i });
      
      expect(aboutButton).toHaveClass('meta-link');
      expect(howButton).toHaveClass('meta-link');
    });
  });

  describe('Modal "Acerca de"', () => {
    it('no muestra el modal inicialmente', () => {
      render(<InfoModals />);
      
      expect(screen.queryByText('Acerca de Exquis')).not.toBeInTheDocument();
    });

    it('abre el modal al hacer clic en "Acerca de"', () => {
      render(<InfoModals />);
      
      const aboutButton = screen.getByRole('button', { name: /Acerca de/i });
      fireEvent.click(aboutButton);
      
      expect(screen.getByText('Acerca de Exquis')).toBeInTheDocument();
      expect(screen.getByText(/cadáver exquisito/i)).toBeInTheDocument();
      expect(screen.getByText(/escritores surrealistas/i)).toBeInTheDocument();
    });

    it('muestra el icono correcto en el header del modal', () => {
      render(<InfoModals />);
      
      const aboutButton = screen.getByRole('button', { name: /Acerca de/i });
      fireEvent.click(aboutButton);
      
      const modalIcon = document.querySelector('.modal-icon');
      expect(modalIcon).toHaveTextContent('🖋️');
    });

    it('cierra el modal al hacer clic en "Cerrar"', () => {
      render(<InfoModals />);
      
      const aboutButton = screen.getByRole('button', { name: /Acerca de/i });
      fireEvent.click(aboutButton);
      
      expect(screen.getByText('Acerca de Exquis')).toBeInTheDocument();
      
      const closeButton = screen.getByRole('button', { name: /Cerrar/i });
      fireEvent.click(closeButton);
      
      expect(screen.queryByText('Acerca de Exquis')).not.toBeInTheDocument();
    });

    it('cierra el modal al hacer clic en el overlay', () => {
      render(<InfoModals />);
      
      const aboutButton = screen.getByRole('button', { name: /Acerca de/i });
      fireEvent.click(aboutButton);
      
      const overlay = document.querySelector('.modal-overlay');
      fireEvent.click(overlay);
      
      expect(screen.queryByText('Acerca de Exquis')).not.toBeInTheDocument();
    });

    it('no cierra el modal al hacer clic dentro del contenido', () => {
      render(<InfoModals />);
      
      const aboutButton = screen.getByRole('button', { name: /Acerca de/i });
      fireEvent.click(aboutButton);
      
      const modalContent = document.querySelector('.modal-content');
      fireEvent.click(modalContent);
      
      expect(screen.getByText('Acerca de Exquis')).toBeInTheDocument();
    });

    it('el botón cerrar tiene la clase modal-close', () => {
      render(<InfoModals />);
      
      const aboutButton = screen.getByRole('button', { name: /Acerca de/i });
      fireEvent.click(aboutButton);
      
      const closeButton = screen.getByRole('button', { name: /Cerrar/i });
      expect(closeButton).toHaveClass('modal-close');
    });
  });

  describe('Modal "¿Cómo funciona?"', () => {
    it('no muestra el modal inicialmente', () => {
      render(<InfoModals />);
      
      expect(screen.queryByRole('heading', { name: /¿Cómo funciona?/i })).not.toBeInTheDocument();
    });

    it('abre el modal al hacer clic en "¿Cómo funciona?"', () => {
      render(<InfoModals />);
      
      const howButton = screen.getByRole('button', { name: /¿Cómo funciona?/i });
      fireEvent.click(howButton);
      
      expect(screen.getByRole('heading', { name: /¿Cómo funciona?/i })).toBeInTheDocument();
      expect(screen.getByText(/Regístrate/i)).toBeInTheDocument();
      expect(screen.getByText(/Elige la opción de escribir/i)).toBeInTheDocument();
    });

    it('muestra el icono correcto en el header del modal', () => {
      render(<InfoModals />);
      
      const howButton = screen.getByRole('button', { name: /¿Cómo funciona?/i });
      fireEvent.click(howButton);
      
      const modalIcon = document.querySelector('.modal-icon');
      expect(modalIcon).toHaveTextContent('📜');
    });

    it('muestra una lista ordenada con los pasos', () => {
      render(<InfoModals />);
      
      const howButton = screen.getByRole('button', { name: /¿Cómo funciona?/i });
      fireEvent.click(howButton);
      
      const orderedList = screen.getByRole('list');
      expect(orderedList).toBeInTheDocument();
      expect(orderedList.tagName).toBe('OL');
    });

    it('cierra el modal al hacer clic en "Cerrar"', () => {
      render(<InfoModals />);
      
      const howButton = screen.getByRole('button', { name: /¿Cómo funciona?/i });
      fireEvent.click(howButton);
      
      const closeButton = screen.getByRole('button', { name: /Cerrar/i });
      fireEvent.click(closeButton);
      
      expect(screen.queryByRole('heading', { name: /¿Cómo funciona?/i })).not.toBeInTheDocument();
    });
  });

  describe('Navegación entre modales', () => {
    it('solo un modal puede estar abierto a la vez', () => {
      render(<InfoModals />);
      
      const aboutButton = screen.getByRole('button', { name: /Acerca de/i });
      fireEvent.click(aboutButton);
      expect(screen.getByRole('heading', { name: /Acerca de Exquis/i })).toBeInTheDocument();
      
      const closeButton = screen.getByRole('button', { name: /Cerrar/i });
      fireEvent.click(closeButton);
      
      const howButton = screen.getByRole('button', { name: /¿Cómo funciona?/i });
      fireEvent.click(howButton);
      
      expect(screen.queryByRole('heading', { name: /Acerca de Exquis/i })).not.toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /¿Cómo funciona?/i })).toBeInTheDocument();
    });
  });
});