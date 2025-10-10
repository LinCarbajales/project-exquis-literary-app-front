import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/auth/AuthService';

/**
 * Componente que protege rutas que requieren autenticación
 * Si no hay token, redirige al login
 */
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    console.warn('⚠️ Intento de acceso sin autenticación, redirigiendo al login');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

// 📝 EJEMPLO DE USO EN App.jsx o Routes.jsx:
/*
import ProtectedRoute from './components/ProtectedRoute';

<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  
  <Route 
    path="/user-area" 
    element={
      <ProtectedRoute>
        <UserArea />
      </ProtectedRoute>
    } 
  />
  
  <Route 
    path="/create-story" 
    element={
      <ProtectedRoute>
        <CreateStory />
      </ProtectedRoute>
    } 
  />
</Routes>
*/