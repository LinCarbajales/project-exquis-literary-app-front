import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import '../register/Register'; // Reutiliza los estilos del registro
import authService from '../../services/auth/AuthService';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSubmitError('');

    try {
      const user = await authService.loginUser(data);
      if (user) {
        navigate('/'); // redirige al home o al dashboard
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      // Mensajes de error más específicos
      if (error.message.includes('401')) {
        setSubmitError('Credenciales incorrectas');
      } else if (error.message.includes('403')) {
        setSubmitError('Acceso denegado');
      } else if (error.message.includes('500')) {
        setSubmitError('Error del servidor. Inténtalo más tarde');
      } else {
        setSubmitError(error.message || 'Error al iniciar sesión');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Cabecera decorativa */}
        <div className="register-header">
          <div className="register-decoration">
            <span className="quill-icon">🖋️</span>
          </div>
          <h1 className="register-title">Inicia sesión</h1>
          <p className="register-subtitle">
            Retoma tus historias inconclusas en Exquis
          </p>
        </div>

        {/* Formulario */}
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          {/* Error general */}
          {submitError && (
            <div className="register-error-general">
              <span className="error-icon">⚠️</span>
              {submitError}
            </div>
          )}

          {/* Datos de inicio de sesión */}
          <section className="register-section">
            <h2 className="register-section-title">Datos de acceso</h2>

            <div className="register-row login-centered">
              <div className="register-field">
                <label className="register-label">
                  Correo electrónico <span className="required">*</span>
                </label>
                <input
                  type="email"
                  disabled={isLoading}
                  placeholder="tu@email.com"
                  {...register('email', {
                    required: 'El email es obligatorio',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email no válido'
                    }
                  })}
                  className={`register-input ${errors.email ? 'register-input-error' : ''}`}
                />
                {errors.email && <p className="register-error">{errors.email.message}</p>}
              </div>
            </div>

            <div className="register-row login-centered">
              <div className="register-field">
                <label className="register-label">
                  Contraseña <span className="required">*</span>
                </label>
                <input
                  type="password"
                  disabled={isLoading}
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'La contraseña es obligatoria',
                    minLength: { value: 8, message: 'Mínimo 8 caracteres' }
                  })}
                  className={`register-input ${errors.password ? 'register-input-error' : ''}`}
                />
                {errors.password && <p className="register-error">{errors.password.message}</p>}
              </div>
            </div>
          </section>

          {/* Botón de envío */}
          <div className="register-actions">
            <button
              type="submit"
              disabled={isLoading}
              className={`register-button ${isLoading ? 'register-button-loading' : ''}`}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <span className="button-icon">✨</span>
                  Entrar
                </>
              )}
            </button>
          </div>

          {/* Link a registro */}
          <div className="register-footer">
            <p>
              ¿Aún no tienes cuenta?{' '}
              <Link to="/register" className="register-link-primary">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;