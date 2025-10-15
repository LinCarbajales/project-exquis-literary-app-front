import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import '../register/Register.css';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // ← Usar el contexto

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSubmitError('');

    try {
      console.log('🔐 Intentando login...');
      
      // Usar el login del contexto en lugar de authService directamente
      const result = await login(data);
      
      if (result && result.token) {
        console.log('✅ Login exitoso, redirigiendo...');
        navigate('/'); // redirige al home
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      
      const errorMessage = error.message || '';
      
      if (errorMessage.includes('401') || errorMessage.includes('Credenciales')) {
        setSubmitError('Credenciales incorrectas. Verifica tu email y contraseña.');
      } else if (errorMessage.includes('403')) {
        setSubmitError('Acceso denegado. Contacta con el administrador.');
      } else if (errorMessage.includes('500')) {
        setSubmitError('Error del servidor. Inténtalo más tarde.');
      } else if (errorMessage.includes('Network') || errorMessage.includes('Failed to fetch')) {
        setSubmitError('No se pudo conectar con el servidor. Verifica tu conexión.');
      } else {
        setSubmitError(errorMessage || 'Error al iniciar sesión. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <div className="register-decoration">
            <span className="quill-icon">🖋️</span>
          </div>
          <h1 className="register-title">Inicia sesión</h1>
          <p className="register-subtitle">
            Retoma tus historias inconclusas en Exquis
          </p>
        </div>

        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          {submitError && (
            <div className="register-error-general">
              <span className="error-icon">⚠️</span>
              {submitError}
            </div>
          )}

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