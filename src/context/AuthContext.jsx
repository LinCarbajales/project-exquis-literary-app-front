// AuthContext.jsx
import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext'; // Importamos desde el nuevo archivo
import authService from '../services/auth/AuthService';

// Provider del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Inicializar el estado de autenticación al cargar la app
  useEffect(() => {
    const initAuth = () => {
      // Verificar si hay token en localStorage
      const hasToken = authService.isAuthenticated();
      
      if (hasToken) {
        // Obtener info del usuario del localStorage
        const userInfo = authService.getUserInfo();
        
        if (userInfo) {
          setUser(userInfo);
          setIsAuthenticated(true);
          console.log('✅ Usuario autenticado:', userInfo);
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // 🔹 Login: actualiza el estado y el localStorage
  const login = async (credentials) => {
    try {
      const result = await authService.loginUser(credentials);
      
      if (result && result.token) {
        // Obtener la info del usuario del localStorage (ya guardada por AuthRepository)
        const userInfo = authService.getUserInfo();
        
        setUser(userInfo);
        setIsAuthenticated(true);
        console.log('✅ Login exitoso en AuthContext:', userInfo);
        
        return result;
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw error;
    }
  };

  // 🔹 Logout: limpia el estado y el localStorage
  const logout = async () => {
    try {
      await authService.logoutUser();
      setUser(null);
      setIsAuthenticated(false);
      console.log('✅ Logout exitoso en AuthContext');
    } catch (error) {
      console.error('❌ Error en logout:', error);
      // Aunque falle, limpiamos el estado
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // 🔹 Actualizar info del usuario (después de editar perfil)
  const updateUser = (newUserData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...newUserData,
    }));
    
    // Actualizar también en localStorage
    if (newUserData.email) {
      localStorage.setItem('userEmail', newUserData.email);
    }
    if (newUserData.username) {
      localStorage.setItem('username', newUserData.username);
    }
    
    console.log('✅ Usuario actualizado en AuthContext:', newUserData);
  };

  // Valor del contexto
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  };

  // Si está cargando, puedes mostrar un loader
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem',
        color: '#666'
      }}>
        Cargando...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};