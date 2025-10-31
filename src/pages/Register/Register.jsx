import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';
import registerService from '../../services/register/RegisterService';
import { useToast } from '../../context/useToast';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const watchPassword = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSubmitError('');

    try {
      const registerData = {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        password: data.password,
      };
      
      const result = await registerService.registerUser(registerData);
      
      if (result.success) {
        // Guardar el email para mostrar en el mensaje
        setRegisteredEmail(data.email);
        setShowVerificationMessage(true);
        
        showToast('¡Cuenta creada! Verifica tu email', 'success', 3000);
      }
      
    } catch (error) {
      console.error('Error en el registro:', error);
      setSubmitError(error.message || 'Error al procesar el registro');
    } finally {
      setIsLoading(false);
    }
  };

  // Si el registro fue exitoso, mostrar pantalla de verificación
  if (showVerificationMessage) {
    return (
      <div className="register-page">
        <div className="register-container verification-container">
          <div className="verification-content">
            <div className="verification-icon">📧</div>
            <h1 className="verification-title">Verifica tu email</h1>
            <p className="verification-text">
              Hemos enviado un correo de verificación a:
            </p>
            <p className="verification-email">{registeredEmail}</p>
            <p className="verification-instructions">
              Por favor, revisa tu bandeja de entrada y haz clic en el enlace 
              de verificación para activar tu cuenta.
            </p>
            
            <div className="verification-tips">
              <p className="verification-tip">
                💡 <strong>Consejo:</strong> Si no ves el correo, revisa tu carpeta de spam.
              </p>
            </div>

            <div className="verification-actions">
              <button
                onClick={() => navigate('/login')}
                className="register-button"
              >
                Ir al inicio de sesión
              </button>
            </div>

            <div className="verification-footer">
              <p>
                ¿No recibiste el email?{' '}
                <Link to={`/resend-verification?email=${registeredEmail}`} className="register-link-primary">
                  Reenviar correo
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <div className="register-decoration">
            <span className="quill-icon">🖋️</span>
          </div>
          <h1 className="register-title">Únete a Exquis</h1>
          <p className="register-subtitle">
            Comienza a escribir historias extrañas e inconexas
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
            <h2 className="register-section-title">Datos personales</h2>
            
            <div className="register-row">
              <div className="register-field">
                <label className="register-label">
                  Seudónimo de Exquis <span className="required">*</span>
                </label>
                <input
                  type="text"
                  disabled={isLoading}
                  placeholder="Firma con este nombre"
                  {...register('username', { 
                    required: 'El seudónimo es obligatorio',
                    minLength: {
                      value: 3,
                      message: 'Mínimo 3 caracteres'
                    },
                    maxLength: {
                      value: 20,
                      message: 'Máximo 20 caracteres'
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: 'Solo letras, números y guiones bajos'
                    }
                  })}
                  className={`register-input ${errors.username ? 'register-input-error' : ''}`}
                />
                {errors.username && (
                  <p className="register-error">{errors.username.message}</p>
                )}
              </div>
            </div>

            <div className="register-row">
              <div className="register-field">
                <label className="register-label">
                  Nombre <span className="required">*</span>
                </label>
                <input
                  type="text"
                  disabled={isLoading}
                  placeholder="Tu nombre"
                  {...register('name', { 
                    required: 'El nombre es obligatorio',
                    minLength: {
                      value: 2,
                      message: 'Mínimo 2 caracteres'
                    }
                  })}
                  className={`register-input ${errors.name ? 'register-input-error' : ''}`}
                />
                {errors.name && (
                  <p className="register-error">{errors.name.message}</p>
                )}
              </div>

              <div className="register-field">
                <label className="register-label">
                  Apellidos <span className="required">*</span>
                </label>
                <input
                  type="text"
                  disabled={isLoading}
                  placeholder="Tus apellidos"
                  {...register('surname', { 
                    required: 'Los apellidos son obligatorios',
                    minLength: {
                      value: 2,
                      message: 'Mínimo 2 caracteres'
                    }
                  })}
                  className={`register-input ${errors.surname ? 'register-input-error' : ''}`}
                />
                {errors.surname && (
                  <p className="register-error">{errors.surname.message}</p>
                )}
              </div>
            </div>
          </section>

          <section className="register-section">
            <h2 className="register-section-title">Datos de Contacto</h2>
            
            <div className="register-row">
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
                {errors.email && (
                  <p className="register-error">{errors.email.message}</p>
                )}
              </div>
            </div>
          </section>

          <section className="register-section">
            <h2 className="register-section-title">Seguridad</h2>
            
            <div className="register-row">
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
                    minLength: {
                      value: 8,
                      message: 'Mínimo 8 caracteres'
                    },
                    validate: {
                      hasUpperCase: (value) => /[A-Z]/.test(value) || 'Debe incluir una mayúscula',
                      hasLowerCase: (value) => /[a-z]/.test(value) || 'Debe incluir una minúscula', 
                      hasNumber: (value) => /\d/.test(value) || 'Debe incluir un número',
                      hasSymbol: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Debe incluir un símbolo'
                    }
                  })}
                  className={`register-input ${errors.password ? 'register-input-error' : ''}`}
                />
                {errors.password && (
                  <p className="register-error">{errors.password.message}</p>
                )}
                <p className="register-hint">
                  Debe contener: mayúscula, minúscula, número y símbolo
                </p>
              </div>

              <div className="register-field">
                <label className="register-label">
                  Confirmar contraseña <span className="required">*</span>
                </label>
                <input
                  type="password"
                  disabled={isLoading}
                  placeholder="••••••••"
                  {...register('confirmPassword', {
                    required: 'Debes confirmar la contraseña',
                    validate: value => value === watchPassword || 'Las contraseñas no coinciden'
                  })}
                  className={`register-input ${errors.confirmPassword ? 'register-input-error' : ''}`}
                />
                {errors.confirmPassword && (
                  <p className="register-error">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
          </section>

          <div className="register-terms">
            <label className="register-checkbox-label">
              <input
                type="checkbox"
                disabled={isLoading}
                {...register('acceptTerms', {
                  required: 'Debes aceptar los términos y condiciones'
                })}
                className="register-checkbox"
              />
              <span>
                Acepto los{' '}
                <Link to="/terms" className="register-link">términos y condiciones</Link>
                {' '}y la{' '}
                <Link to="/privacy" className="register-link">política de privacidad</Link>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="register-error">{errors.acceptTerms.message}</p>
            )}
          </div>

          <div className="register-actions">
            <button
              type="submit"
              disabled={isLoading}
              className={`register-button ${isLoading ? 'register-button-loading' : ''}`}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Registrando...
                </>
              ) : (
                <>
                  <span className="button-icon">✨</span>
                  Crear cuenta
                </>
              )}
            </button>
          </div>

          <div className="register-footer">
            <p>
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="register-link-primary">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;