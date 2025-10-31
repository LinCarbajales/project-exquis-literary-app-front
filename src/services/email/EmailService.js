class EmailService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  }

  /**
   * Reenviar email de verificación
   */
  async resendVerificationEmail(email) {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al reenviar el email');
      }

      return data;
    } catch (error) {
      console.error('Error al reenviar email:', error);
      throw error;
    }
  }

  /**
   * Verificar token de email
   */
  async verifyEmail(token) {
    try {
      const response = await fetch(`${this.baseURL}/api/auth/verify-email/${token}`, {
        method: 'GET',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al verificar el email');
      }

      return data;
    } catch (error) {
      console.error('Error al verificar email:', error);
      throw error;
    }
  }
}

const emailService = new EmailService();
export default emailService;