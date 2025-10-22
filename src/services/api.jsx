import axios from 'axios';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔹 INTERCEPTOR DE REQUEST: Añade el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token enviado:', token.substring(0, 20) + '...');
    } else {
      console.warn('⚠️ No hay token en localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 INTERCEPTOR DE RESPONSE: Maneja errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('❌ Error de respuesta:', error.response.status);
      if (error.response.status === 401) {
        console.error('🔒 Token inválido o expirado. Redirigiendo al login...');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      if (error.response.status === 403) {
        console.error('🚫 Acceso denegado');
      }
    } else if (error.request) {
      console.error('📡 No hay respuesta del servidor');
    } else {
      console.error('⚠️ Error:', error.message);
    }
    return Promise.reject(error);
  }
);

//
// 🔹 FUNCIONES DE LA API
//

// 🧱 Historias
export const assignStory = async () => {
  try {
    const response = await api.post('/stories/assign');
    console.log('✅ Historia asignada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error asignando historia:', error);
    throw error;
  }
};

export const unlockStory = async (storyId) => {
  try {
    console.log('🔓 Desbloqueando historia:', storyId);
    const response = await api.post(`/stories/unlock/${storyId}`);
    console.log('✅ Historia desbloqueada');
    return response.data;
  } catch (error) {
    console.error('❌ Error desbloqueando historia:', error);
    throw error;
  }
};

// ✍️ Colaboraciones
export const createCollaboration = async (storyId, text) => {
  try {
    console.log('📤 Creando colaboración:', { storyId, text: text.substring(0, 50) + '...' });
    
    // ✅ El backend espera { text, storyId }
    const response = await api.post('/collaborations', {
      text: text,
      storyId: storyId
    });
    
    console.log('✅ Colaboración creada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creando colaboración:', error);
    console.error('Detalles:', error.response?.data);
    throw error;
  }
};

// 📜 Obtener colaboración anterior
export const getPreviousCollaboration = async (storyId) => {
  try {
    const response = await api.get(`/collaborations/story/${storyId}/last`);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo la colaboración anterior:', error);
    throw error;
  }
};

// 📊 Obtener todas las colaboraciones de una historia
export const getCollaborationsByStory = async (storyId) => {
  try {
    const response = await api.get(`/collaborations/story/${storyId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo colaboraciones:', error);
    throw error;
  }
};

// 🔍 DEBUG: Ver historias bloqueadas (temporal)
export const getBlockedStories = async () => {
  try {
    const response = await api.get('/stories/blocked');
    console.log('🔒 Historias bloqueadas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error obteniendo historias bloqueadas:', error);
    return [];
  }
};

export default api;