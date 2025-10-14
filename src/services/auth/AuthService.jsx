import AuthRepository from '../../repositories/auth/AuthRepository';

class AuthService {
  constructor() {
    this.authRepository = new AuthRepository();
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
  }

  // 🔹 Iniciar sesión con JWT
  async loginUser(formData) {
    try {
      // Validaciones básicas
      if (!formData.email?.trim()) throw new Error('El email es obligatorio');
      if (!formData.password?.trim()) throw new Error('La contraseña es obligatoria');

      console.log('🔐 Intentando login para:', formData.email);

      // Llamamos al repository con las credenciales
      const data = await this.authRepository.login({
        email: formData.email,
        password: formData.password
      });

      console.log('✅ Login con éxito:', data);
      return data;
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

      console.log('📡 Obteniendo usuario actual...');

      const response = await fetch(`${this.baseUrl}/users/me`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`, // Enviamos el token JWT
        },
      });

      if (!response.ok) {
        console.warn('⚠️ No se pudo obtener el usuario actual (sesión expirada o token inválido)');
        
        // Si el token es inválido (401 o 403), lo eliminamos
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userId');
        }
        
        throw new Error(`Error ${response.status}: No se pudo obtener el usuario`);
      }

      const user = await response.json();
      console.log('✅ Usuario obtenido:', user);
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

  // 🔹 Obtener el userId
  getUserId() {
    return this.authRepository.getUserId();
  }

  // 🔹 Obtener el email del usuario
  getUserEmail() {
    return this.authRepository.getUserEmail();
  }

  // 🔹 Obtener el username
  getUsername() {
    return this.authRepository.getUsername();
  }

  // 🔹 Obtener toda la información del usuario guardada
  getUserInfo() {
    return this.authRepository.getUserInfo();
  }
}

const authService = new AuthService();
export default authService;