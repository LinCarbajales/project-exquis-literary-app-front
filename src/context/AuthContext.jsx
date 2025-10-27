import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import authService from '../services/auth/AuthService';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Inicializar autenticación al cargar la app
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
            console.log('✅ Usuario autenticado al iniciar:', currentUser);
          } else {
            authService.clearSession();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        console.error('❌ Error al inicializar auth:', err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // 🔹 Login
  const login = async (credentials) => {
    try {
      console.log('🟢 Intentando login en AuthContext...');
      const user = await authService.loginUser(credentials);

      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        console.log('✅ Login exitoso en AuthContext:', user);
        return user;
      } else {
        console.warn('⚠️ Login sin usuario devuelto');
        throw new Error('Error al obtener usuario después del login');
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw error;
    }
  };

  // 🔹 Logout
  const logout = async () => {
    try {
      await authService.logoutUser();
    } catch (err) {
      console.error('⚠️ Error en logout:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      authService.clearSession();
      console.log('✅ Logout exitoso');
    }
  };

  // 🔹 Actualizar info de usuario (por ejemplo, al editar perfil)
  const updateUser = (newUserData) => {
    setUser((prev) => ({ ...prev, ...newUserData }));
    console.log('✅ Usuario actualizado en contexto:', newUserData);
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

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.5rem',
          color: '#666',
        }}
      >
        Cargando...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
