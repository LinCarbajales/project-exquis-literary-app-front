class AuthRepository {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
  }

  /**
   * 🔑 Login - Obtiene el token JWT
   */
  async login(credentials) {
    try {
      console.log('📡 Enviando petición de login a:', `${this.baseUrl}/login`);
      
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      console.log('📨 Respuesta del servidor:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Error en login:', errorData);
        throw new Error(`Error ${response.status}: ${errorData || 'Credenciales incorrectas'}`);
      }

      const data = await response.json();
      console.log('✅ Datos recibidos:', data);

      // Guardar el token en localStorage
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        console.log('💾 Token guardado en localStorage');
      } else {
        throw new Error('No se recibió token del servidor');
      }

      // Guardar información del usuario
      if (data.user) {
        localStorage.setItem('userId', data.user.id_user.toString());
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('username', data.user.username);
        console.log('💾 Datos de usuario guardados:', data.user);
      }

      return data;
    } catch (error) {
      console.error('❌ Error en AuthRepository.login:', error);
      throw error;
    }
  }

  /**
   * 🚪 Logout - Elimina el token
   */
  async logout() {
    try {
      const token = this.getToken();

      // Si tienes un endpoint de logout en el backend, llámalo aquí
      if (token) {
        await fetch(`${this.baseUrl}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }).catch(err => console.warn('Error al llamar al logout del backend:', err));
      }

      // Limpiar localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      console.log('🧹 Token eliminado de localStorage');

      return true;
    } catch (error) {
      console.error('❌ Error en AuthRepository.logout:', error);
      // Aunque falle, limpiamos el localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      throw error;
    }
  }

  /**
   * 🔍 Verifica si hay un token guardado
   */
  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  }

  /**
   * 🎫 Obtiene el token del localStorage
   */
  getToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * 👤 Obtiene el userId del localStorage
   */
  getUserId() {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }
}

export default AuthRepository;