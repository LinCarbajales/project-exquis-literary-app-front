import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

const Button = ({ 
  children,
  variant = 'primary', // 'primary', 'secondary', 'tertiary'
  size = 'medium', // 'small', 'medium', 'large'
  type = 'button', // 'button', 'submit', 'reset'
  to = null, // Si se proporciona, renderiza un Link
  href = null, // Si se proporciona, renderiza un <a>
  onClick = null,
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left', // 'left', 'right'
  fullWidth = false,
  className = '',
  ...props
}) => {
  
  // Determinar las clases CSS
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    loading && 'btn-loading',
    disabled && 'btn-disabled',
    fullWidth && 'btn-full-width',
    className
  ].filter(Boolean).join(' ');

  // Contenido del botón
  const content = (
    <>
      {loading && <span className="btn-spinner"></span>}
      {!loading && icon && iconPosition === 'left' && (
        <span className="btn-icon btn-icon-left">{icon}</span>
      )}
      <span className="btn-text">{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className="btn-icon btn-icon-right">{icon}</span>
      )}
    </>
  );

  // Renderizar como Link (React Router)
  if (to && !disabled) {
    return (
      <Link 
        to={to} 
        className={classes}
        {...props}
      >
        {content}
      </Link>
    );
  }

  // Renderizar como enlace externo
  if (href && !disabled) {
    return (
      <a 
        href={href}
        className={classes}
        target={props.target || '_blank'}
        rel={props.rel || 'noopener noreferrer'}
        {...props}
      >
        {content}
      </a>
    );
  }

  // Renderizar como botón normal
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;