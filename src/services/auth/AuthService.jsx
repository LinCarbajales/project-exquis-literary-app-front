import AuthRepository from '../../repositories/auth/AuthRepository';

class AuthService {
  constructor() {
    this.authRepository = new AuthRepository();
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }

 
  async loginUser(formData) {
    try {
      if (!formData.email?.trim()) throw new Error('El email es obligatorio');
      if (!formData.password?.trim()) throw new Error('La contraseña es obligatoria');

     
      const credentials = `${formData.email}:${formData.password}`;
      const authToken = `Basic ${btoa(credentials)}`;

   
      await this.authRepository.login({ authToken });


      const user = await this.getCurrentUser();

      if (user) {
        localStorage.setItem('userId', user.id_user);
      }

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
      localStorage.removeItem('userId'); 
      console.log('✅ Logout con éxito');
      return true;
    } catch (error) {
      console.error('❌ Error en AuthService.logoutUser:', error);
      throw error;
    }
  }


  async getCurrentUser() {
    try {
      const response = await fetch(`${this.baseUrl}/users/me`, {
        method: 'GET',
        credentials: 'include', 
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn('⚠️ No se pudo obtener el usuario actual (sesión expirada)');
        return null;
      }

      const user = await response.json();
      return user;
    } catch (error) {
      console.error('❌ Error en AuthService.getCurrentUser:', error);
      return null;
    }
  }
}

const authService = new AuthService();
export default authService;