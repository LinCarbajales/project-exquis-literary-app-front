// src/pages/AdminPanel/AdminPanel.jsx (Simplificado)

import React, { useState, useEffect, useCallback } from 'react';
import './AdminPanel.css';
import Button from '../../components/Button/Button';
import {
  getAllUsers,
  deleteUser,
} from '../../services/api'; // Solo necesitamos usuarios
import authService from '../../services/auth/AuthService';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  // ℹ️ Verificación de administrador (debe estar protegido en el backend)
  useEffect(() => {
    if (!authService.isAuthenticated()) {
        navigate('/login');
        return;
    }
  }, [navigate]);


  // 🔹 Función para cargar solo usuarios
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Cargar Usuarios
      const usersData = await getAllUsers();
      setUsers(usersData);
      
      setMessage('Lista de usuarios cargada correctamente.');
    } catch (err) {
      console.error('❌ Error al cargar datos de administración:', err);
      if (err.response?.status === 403) {
        setError('Acceso denegado. Solo administradores pueden ver este panel.');
      } else {
        setError('No se pudieron cargar los usuarios. Revisa la consola.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 🔹 Función para eliminar usuario
  const handleDeleteUser = async (userId, username) => {
    // CORRECCIÓN: Usar user.id_user si UserResponseDTO usa ese campo
    const idToDelete = userId || username; // Usamos el ID recibido del front

    if (!window.confirm(`¿Estás seguro de que quieres eliminar al usuario @${username}?`)) {
      return;
    }

    try {
      await deleteUser(idToDelete);
      setMessage(`Usuario @${username} eliminado correctamente.`);
      // Actualizar la lista de usuarios
      setUsers(prevUsers => prevUsers.filter(user => user.id_user !== idToDelete));
      
      // Limpiar mensaje después de 5 segundos
      setTimeout(() => setMessage(''), 5000); 

    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      setError(`Error al eliminar al usuario @${username}.`);
      setTimeout(() => setError(''), 5000); 
    }
  };

  // ⚠️ NOTA: Se eliminó handleDeleteStory y la dependencia getCompletedStories

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <span className="quill-icon">👑</span>
          <h1 className="admin-title">Panel de Administración</h1>
          <p className="admin-subtitle">
            Gestión de usuarios
          </p>
        </div>

        {/* Mensajes de Estado */}
        {isLoading && (
          <div className="admin-status loading-state">
            <p>⏳ Cargando usuarios...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="admin-status error-state">
            <p>❌ {error}</p>
          </div>
        )}
        
        {message && !error && !isLoading && (
            <div className="admin-status success-state">
                <p>✅ {message}</p>
            </div>
        )}
        
        {/* --------------------- Sección de Usuarios --------------------- */}
        {!isLoading && !error && (
          <section className="admin-section">
            <h2 className="admin-section-title">Usuarios Registrados ({users.length})</h2>
            <div className="users-list">
              {users.length === 0 ? (
                <div className="empty-state">
                  <p className="empty-text">No hay usuarios registrados.</p>
                </div>
              ) : (
                users.map((user) => (
                  // Usamos 'user.id_user' para que coincida con tu DTO de backend
                  <div key={user.id_user} className="user-admin-item"> 
                    <div className="user-info-text">
                        <span className="user-info-username">@{user.username}</span> 
                        <span className="user-info-email">({user.email})</span>
                        <span className="user-info-id">ID: {user.id_user}</span>
                    </div>
                    {/* Botón de eliminación */}
                    <Button
                      type="button"
                      variant="danger"
                      size="small"
                      icon="🗑️"
                      // Pasamos user.id_user al manejador
                      onClick={() => handleDeleteUser(user.id_user, user.username)}
                    >
                      Eliminar
                    </Button>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;