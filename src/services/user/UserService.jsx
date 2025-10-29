class UserService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
  }

  /**
   * Obtiene el token del localStorage
   */
  getToken() {
    // ✅ Usar 'token' en lugar de 'authToken'
    return localStorage.getItem('token');
  }

  /**
   * Crea los headers con el token de autenticación
   */
  getAuthHeaders() {
    const token = this.getToken();
    
    console.log('🔑 Token disponible:', token ? 'Sí' : 'NO');
    if (token) {
      console.log('🔑 Token (primeros 20 chars):', token.substring(0, 20) + '...');
    }
    
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  /**
   * 👤 Obtiene los datos del usuario autenticado
   */
  async getCurrentUser() {
    try {
      console.log('📡 GET /users/me');
      
      const response = await fetch(`${this.baseUrl}/users/me`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log('📨 Respuesta:', response.status);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('401'); // Para que Login.jsx pueda detectarlo
        }
        throw new Error(`Error ${response.status}: No se pudo obtener el usuario`);
      }

      const data = await response.json();
      console.log('✅ Usuario obtenido:', data);
      return data;
    } catch (error) {
      console.error('❌ Error en getCurrentUser:', error);
      throw error;
    }
  }

  /**
   * ✏️ Actualiza los datos del usuario autenticado
   */
  async updateUser(userData) {
    try {
      console.log('📡 PUT /users/me', userData);

      const response = await fetch(`${this.baseUrl}/users/me`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      console.log('📨 Respuesta:', response.status);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('401');
        }
        
        // Intentar obtener el mensaje de error del backend
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}: No se pudo actualizar el usuario`);
      }

      const data = await response.json();
      console.log('✅ Usuario actualizado:', data);
      return data;
    } catch (error) {
      console.error('❌ Error en updateUser:', error);
      throw error;
    }
  }

  /**
   * 🗑️ Elimina la cuenta del usuario autenticado
   */
  async deleteAccount() {
    try {
      console.log('📡 DELETE /users/me');

      const response = await fetch(`${this.baseUrl}/users/me`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      console.log('📨 Respuesta:', response.status);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('401');
        }
        throw new Error(`Error ${response.status}: No se pudo eliminar la cuenta`);
      }

      console.log('✅ Cuenta eliminada');
      
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('username');
      
      return true;
    } catch (error) {
      console.error('❌ Error en deleteAccount:', error);
      throw error;
    }
  }
}

const userService = new UserService();
export default userService;