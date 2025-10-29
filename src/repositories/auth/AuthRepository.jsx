class AuthRepository {
    constructor() {
        this.baseUrl = import.meta.env.VITE_API_BASE_URL;
    }

async login({ email, password }) {
    // Construir el token Base64 para Basic Auth
    const basicAuth = 'Basic ' + btoa(`${email}:${password}`);

    const response = await fetch(`${this.baseUrl}/login`, {
        method: 'GET',
        headers: {
            'Authorization': basicAuth,
            'Accept': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error(`Error al iniciar sesión (${response.status})`);
    }

    const loginData = await response.json();
    const jwtToken = loginData.token; // ajusta al nombre real del campo
    
    localStorage.setItem('token', jwtToken);

    const userResponse = await fetch(`${this.baseUrl}/users/me`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
        },
    });

    if (!userResponse.ok) {
        throw new Error(`Error al obtener usuario (${userResponse.status})`);
    }

    const user = await userResponse.json();
    localStorage.setItem('userId', user.id_user);

    return user;
}

  async logout() {
    // Obtener el token JWT guardado
    const token = localStorage.getItem('token');

    const response = await fetch(`${this.baseUrl}/logout`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Error al cerrar sesión');
    }

    // Limpiar almacenamiento local
    localStorage.removeItem('userId');
    localStorage.removeItem('token');

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return await response.json();
    } else {
      return;
    }
  }
}

export default AuthRepository;