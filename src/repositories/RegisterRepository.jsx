class RegisterRepository {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }

  async register(userData) {
    try {
      const response = await fetch(`${this.baseUrl}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // Si falla, lanza un error con el status
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || 
          `Error ${response.status}: ${response.statusText}`
        );
      }

      // Para el 201, devuelve la respuesta completa
      const data = await response.json();
      return {
        success: true,
        status: response.status,
        data: data,
      };
    } catch (error) {
      // Maneja errores de red y otros errores
      throw new Error(
        error.message || 'Error de conexión con el servidor'
      );
    }
  }
}

export default RegisterRepository;