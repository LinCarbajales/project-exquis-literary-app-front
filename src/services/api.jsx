import axios from 'axios';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // Ajusta según tu endpoint
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔹 INTERCEPTOR DE REQUEST: Añade el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      // Añadir el token al header Authorization
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token enviado:', token.substring(0, 20) + '...');
    } else {
      console.warn('⚠️ No hay token en localStorage');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🔹 INTERCEPTOR DE RESPONSE: Maneja errores globalmente
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente la devolvemos
    return response;
  },
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      console.error('❌ Error de respuesta:', error.response.status);
      
      // Si es 401 (no autorizado), redirigir al login
      if (error.response.status === 401) {
        console.error('🔒 Token inválido o expirado. Redirigiendo al login...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // Si es 403 (prohibido)
      if (error.response.status === 403) {
        console.error('🚫 Acceso denegado');
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('📡 No hay respuesta del servidor');
    } else {
      // Algo pasó al configurar la petición
      console.error('⚠️ Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;