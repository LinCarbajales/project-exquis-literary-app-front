import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import emailService from '../../services/email/EmailService';
import './ResendVerification.css';

const ResendVerification = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      await emailService.resendVerificationEmail(email);
      setMessage('¡Email enviado! Revisa tu bandeja de entrada.');
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Error al enviar el email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="resend-verification-page">
      <div className="resend-verification-container">
        <div className="resend-header">
          <span className="resend-icon">📧</span>
          <h1>Reenviar verificación</h1>
          <p>Te enviaremos un nuevo enlace de verificación</p>
        </div>

        <form onSubmit={handleSubmit} className="resend-form">
          {message && <div className="resend-success">{message}</div>}
          {error && <div className="resend-error">{error}</div>}

          <div className="resend-field">
            <label className="resend-label">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              disabled={isLoading}
              className="resend-input"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`resend-button ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Enviando...
              </>
            ) : (
              'Enviar email de verificación'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResendVerification;