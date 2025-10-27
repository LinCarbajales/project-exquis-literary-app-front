import AuthRepository from '../../repositories/auth/AuthRepository';

class AuthService {
  constructor() {
    this.authRepository = new AuthRepository();
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
  }

  // 🔹 Iniciar sesión con Basic Auth -> obtener JWT -> obtener usuario
  async loginUser(formData) {
    try {
      if (!formData.email?.trim()) throw new Error('El email es obligatorio');
      if (!formData.password?.trim()) throw new Error('La contraseña es obligatoria');

      console.log('🔐 Intentando login para:', formData.email);

      // Login a través del repositorio
      const user = await this.authRepository.login({
        email: formData.email,
        password: formData.password,
      });

      console.log('✅ Login exitoso. Usuario obtenido:', user);

      // Guardar datos relevantes (si no los maneja el repository)
      if (user && user.id_user) {
        localStorage.setItem('userId', user.id_user);
      }

      return user;
    } catch (error) {
      console.error('❌ Error en AuthService.loginUser:', error);
      throw error;
    }
  }

  // 🔹 Cerrar sesión
  async logoutUser() {
    try {
      console.log('🚪 Cerrando sesión...');
      await this.authRepository.logout();
      console.log('✅ Logout con éxito');
      return true;
    } catch (error) {
      console.error('❌ Error en AuthService.logoutUser:', error);
      throw error;
    }
  }

  // 🔹 Obtener el usuario actual (a partir del JWT almacenado)
  async getCurrentUser() {
    try {
      const token = this.getToken();

      if (!token) {
        console.warn('⚠️ No hay token disponible en localStorage');
        return null;
      }

      console.log('📡 Obteniendo usuario actual...');

      const response = await fetch(`${this.baseUrl}/users/me`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.warn('⚠️ Error al obtener usuario actual:', response.status);
        if (response.status === 401 || response.status === 403) {
          this.clearSession();
        }
        return null;
      }

      const user = await response.json();
      console.log('✅ Usuario actual obtenido:', user);
      return user;
    } catch (error) {
      console.error('❌ Error en AuthService.getCurrentUser:', error);
      return null;
    }
  }

  // 🔹 Verificar si el usuario está autenticado
  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  }

  // 🔹 Obtener token JWT
  getToken() {
    return localStorage.getItem('token'); // usamos "token" para mantener compatibilidad
  }

  // 🔹 Obtener userId
  getUserId() {
    return localStorage.getItem('userId');
  }

  // 🔹 Limpiar sesión completa
  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  // 🔹 (Opcional) Obtener info completa guardada
  getUserInfo() {
    return {
      userId: this.getUserId(),
      token: this.getToken(),
    };
  }
}

const authService = new AuthService();
export default authService;
