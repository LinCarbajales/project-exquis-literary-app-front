import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth/AuthService';

/**
 * Componente que muestra la información del usuario logueado
 * Úsalo en tu Navbar o Header
 */
const UserInfoDisplay = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Obtener info del usuario del localStorage
    const info = authService.getUserInfo();
    setUserInfo(info);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logoutUser();
      //navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (!userInfo) {
    return (
      <div className="user-info-guest">
        <button onClick={() => navigate('/login')}>Iniciar Sesión</button>
      </div>
    );
  }

  return (
    <div className="user-info-logged">
      <span className="user-greeting">
        Hola, <strong>{userInfo.username}</strong>
      </span>
      <button onClick={() => navigate('/user-area')}>
        Mi Perfil
      </button>
      <button onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </div>
  );
};

export default UserInfoDisplay;

/* 
EJEMPLO DE USO EN NAVBAR:

import UserInfoDisplay from './components/UserInfoDisplay';

function Navbar() {
  return (
    <nav>
      <div className="navbar-left">
        <Logo />
        <Menu />
      </div>
      <div className="navbar-right">
        <UserInfoDisplay />
      </div>
    </nav>
  );
}
*/