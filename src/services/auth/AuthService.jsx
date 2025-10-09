import AuthRepository from '../../repositories/auth/AuthRepository';

class AuthService {
  constructor() {
    this.authRepository = new AuthRepository();
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }

  // 🔹 Iniciar sesión con JWT
  async loginUser(formData) {
    try {
      // Validaciones básicas
      if (!formData.email?.trim()) throw new Error('El email es obligatorio');
      if (!formData.password?.trim()) throw new Error('La contraseña es obligatoria');

      // Llamamos al repository con las credenciales
      // Ya no creamos el Basic Auth, enviamos directamente email y password
      const user = await this.authRepository.login({
        email: formData.email,
        password: formData.password
      });

      console.log('✅ Login con éxito:', user);
      return user;
    } catch (error) {
      console.error('❌ Error en AuthService.loginUser:', error);
      throw error;
    }
  }

  // 🔹 Cerrar sesión
  async logoutUser() {
    try {
      await this.authRepository.logout();
      console.log('✅ Logout con éxito');
      return true;
    } catch (error) {
      console.error('❌ Error en AuthService.logoutUser:', error);
      throw error;
    }
  }

  // 🔹 Obtener el usuario actual (con JWT)
  async getCurrentUser() {
    try {
      // Obtenemos el token del localStorage
      const token = this.authRepository.getToken();
      
      if (!token) {
        console.warn('⚠️ No hay token de autenticación');
        return null;
      }

      const response = await fetch(`${this.baseUrl}/users/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`, // Enviamos el token JWT
        },
      });

      if (!response.ok) {
        console.warn('⚠️ No se pudo obtener el usuario actual (sesión expirada o token inválido)');
        // Si el token es inválido, lo eliminamos
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        return null;
      }

      const user = await response.json();
      return user;
    } catch (error) {
      console.error('❌ Error en AuthService.getCurrentUser:', error);
      return null;
    }
  }

  // 🔹 Verificar si el usuario está autenticado
  isAuthenticated() {
    return this.authRepository.isAuthenticated();
  }

  // 🔹 Obtener el token (por si lo necesitas en otros servicios)
  getToken() {
    return this.authRepository.getToken();
  }
}

const authService = new AuthService();
export default authService;