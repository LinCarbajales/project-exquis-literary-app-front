import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import emailService from '../../services/email/EmailService';
import './VerifyEmail.css';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const result = await emailService.verifyEmail(token);
        setStatus('success');
        setMessage(result.message || '¡Email verificado correctamente!');
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'El enlace de verificación no es válido o ha expirado');
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token, navigate]);

  return (
    <div className="verify-email-page">
      <div className="verify-email-container">
        {status === 'verifying' && (
          <div className="verify-content">
            <div className="verify-spinner"></div>
            <h1>Verificando tu email...</h1>
            <p>Por favor espera un momento</p>
          </div>
        )}

        {status === 'success' && (
          <div className="verify-content success">
            <div className="verify-icon">✅</div>
            <h1>¡Email verificado!</h1>
            <p>{message}</p>
            <p className="redirect-text">Redirigiendo al inicio de sesión...</p>
            <Link to="/login" className="verify-button">
              Ir al inicio de sesión
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="verify-content error">
            <div className="verify-icon">❌</div>
            <h1>Error en la verificación</h1>
            <p>{message}</p>
            <div className="verify-actions">
              <Link to="/resend-verification" className="verify-button">
                Solicitar nuevo enlace
              </Link>
              <Link to="/register" className="verify-button secondary">
                Volver al registro
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;