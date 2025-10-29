import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Collaboration from './Collaboration'; // Ajusta la ruta si es necesario

describe('Collaboration Component', () => {
  const defaultProps = {
    username: 'TestUser',
    text: 'Esta es una colaboración de prueba.',
  };

  it('renderiza el nombre de usuario y el texto de la colaboración', () => {
    render(<Collaboration {...defaultProps} />);
    
    expect(screen.getByText('@TestUser')).toBeInTheDocument();
    expect(screen.getByText('Esta es una colaboración de prueba.')).toBeInTheDocument();
  });

  it('muestra el icono de avatar por defecto (🖋️)', () => {
    render(<Collaboration {...defaultProps} />);
    
    expect(screen.getByText('🖋️')).toBeInTheDocument();
  });

  it('aplica la clase de estilo "collaboration-previous" cuando isPrevious es true', () => {
    const { container } = render(<Collaboration {...defaultProps} isPrevious={true} />);
    
    // El primer hijo es el div con la clase 'collaboration'
    expect(container.firstChild).toHaveClass('collaboration-previous');
  });

  it('NO aplica la clase de estilo "collaboration-previous" por defecto', () => {
    const { container } = render(<Collaboration {...defaultProps} />);
    
    expect(container.firstChild).not.toHaveClass('collaboration-previous');
  });

  it('muestra el separador por defecto', () => {
    const { container } = render(<Collaboration {...defaultProps} />);
    
    // El separador es un div con la clase 'collaboration-separator'
    expect(container.querySelector('.collaboration-separator')).toBeInTheDocument();
  });

  it('NO muestra el separador cuando showSeparator es false', () => {
    const { container } = render(<Collaboration {...defaultProps} showSeparator={false} />);
    
    expect(container.querySelector('.collaboration-separator')).not.toBeInTheDocument();
  });
});