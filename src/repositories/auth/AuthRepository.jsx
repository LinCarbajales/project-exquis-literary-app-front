class AuthRepository {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }
  
  // 🔹 Iniciar sesión con JWT
  async login(credentials) {
    // Enviamos las credenciales como JSON en el body
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST', // Cambiado de GET a POST
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      })
    });

    if (!response.ok) {
      throw new Error(`Error al iniciar sesión (${response.status})`);
    }

    // El backend debe devolver { token: "...", user: {...} }
    const data = await response.json();
    
    // Guardamos el token JWT en localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    
    // Guardamos también el ID del usuario
    if (data.user && data.user.id_user) {
      localStorage.setItem('userId', data.user.id_user);
    }

    return data.user;
  }

  // 🔹 Cerrar sesión
  async logout() {
    // Obtenemos el token para enviarlo en el header
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseUrl}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Enviamos el token
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Error al cerrar sesión');
    }

    // Eliminamos el token y userId del localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');

    // Verificamos si la respuesta tiene JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json();
    } else {
      return;
    }
  }

  // 🔹 Método auxiliar: obtener el token actual
  getToken() {
    return localStorage.getItem('authToken');
  }

  // 🔹 Método auxiliar: verificar si hay sesión activa
  isAuthenticated() {
    return !!this.getToken();
  }
}

export default AuthRepository;