import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import './UserArea.css';
import Button from '../../components/Button/Button';
import userService from '../../services/user/UserService';
import authService from '../../services/auth/AuthService';

const UserArea = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 🔹 Cargar datos del usuario al montar el componente
  useEffect(() => {
    const fetchUser = async () => {
      // Verificar si hay token
      if (!authService.isAuthenticated()) {
        console.warn('⚠️ No hay token, redirigiendo al login');
        navigate('/login');
        return;
      }

      setIsLoading(true);
      try {
        console.log('📡 Cargando datos del usuario...');
        const currentUser = await userService.getCurrentUser();
        console.log('✅ Datos recibidos:', currentUser);
        
        // Rellenar el formulario con los datos del usuario
        reset({
          username: currentUser.username,
          name: currentUser.name,
          surname: currentUser.surname,
          email: currentUser.email,
          password: '', // Siempre vacío por seguridad
        });
      } catch (error) {
        console.error('❌ Error al cargar datos:', error);
        
        if (error.response?.status === 401 || error.response?.status === 403) {
          setSubmitError('Sesión expirada. Por favor, inicia sesión de nuevo.');
          setTimeout(() => {
            authService.logout();
          }, 2000);
        } else {
          setSubmitError('No se pudieron cargar tus datos. Inténtalo de nuevo.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [reset, navigate]);

  // 🔹 Guardar cambios del usuario
  const onSubmit = async (formData) => {
    setIsLoading(true);
    setSubmitError('');
    setSuccessMessage('');

    try {
      console.log('📤 Enviando actualización:', formData);
      
      // Si la contraseña está vacía, no la enviamos
      const dataToSend = { ...formData };
      if (!dataToSend.password || dataToSend.password.trim() === '') {
        delete dataToSend.password;
      }
      
      const updatedUser = await userService.updateUser(dataToSend);
      console.log('✅ Usuario actualizado:', updatedUser);
      
      setSuccessMessage('Datos actualizados correctamente ✨');
      
      // Si actualizó el email, podría necesitar nuevo login
      // En ese caso, podrías cerrar sesión automáticamente
      
    } catch (error) {
      console.error('❌ Error al actualizar:', error);
      
      if (error.response?.data?.message) {
        setSubmitError(error.response.data.message);
      } else if (error.response?.status === 401) {
        setSubmitError('Sesión expirada. Redirigiendo al login...');
        setTimeout(() => authService.logout(), 2000);
      } else {
        setSubmitError('Error al actualizar los datos. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Eliminar cuenta
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      '¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.'
    );
    
    if (!confirmDelete) return;

    try {
      console.log('🗑️ Eliminando cuenta...');
      await userService.deleteAccount();
      console.log('✅ Cuenta eliminada');
      
      alert('Tu cuenta ha sido eliminada.');
      authService.logout();
      
    } catch (error) {
      console.error('❌ Error al eliminar cuenta:', error);
      alert('Error al eliminar la cuenta. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="userarea-page">
      <div className="userarea-container">
        <div className="userarea-header">
          <span className="quill-icon">🖋️</span>
          <h1 className="userarea-title">Área de Usuario</h1>
          <p className="userarea-subtitle">
            Modifica tus datos o elimina tu cuenta
          </p>
        </div>

        <form className="userarea-form" onSubmit={handleSubmit(onSubmit)}>
          {submitError && <div className="userarea-error">{submitError}</div>}
          {successMessage && (
            <div className="userarea-success">{successMessage}</div>
          )}

          <section className="userarea-section">
            <h2 className="userarea-section-title">Datos personales</h2>

            <div className="userarea-row">
              <div className="userarea-field">
                <label className="userarea-label">Seudónimo</label>
                <input
                  type="text"
                  disabled={isLoading}
                  {...register('username', { required: 'Campo obligatorio' })}
                  className={`userarea-input ${errors.username ? 'userarea-input-error' : ''}`}
                />
                {errors.username && (
                  <p className="userarea-error-text">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>

            <div className="userarea-row">
              <div className="userarea-field">
                <label className="userarea-label">Nombre</label>
                <input
                  type="text"
                  disabled={isLoading}
                  {...register('name', { required: 'Campo obligatorio' })}
                  className={`userarea-input ${errors.name ? 'userarea-input-error' : ''}`}
                />
                {errors.name && (
                  <p className="userarea-error-text">{errors.name.message}</p>
                )}
              </div>

              <div className="userarea-field">
                <label className="userarea-label">Apellidos</label>
                <input
                  type="text"
                  disabled={isLoading}
                  {...register('surname', { required: 'Campo obligatorio' })}
                  className={`userarea-input ${errors.surname ? 'userarea-input-error' : ''}`}
                />
                {errors.surname && (
                  <p className="userarea-error-text">
                    {errors.surname.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="userarea-section">
            <h2 className="userarea-section-title">Datos de contacto</h2>
            <div className="userarea-row">
              <div className="userarea-field">
                <label className="userarea-label">Correo electrónico</label>
                <input
                  type="email"
                  disabled={isLoading}
                  {...register('email', { required: 'Campo obligatorio' })}
                  className={`userarea-input ${errors.email ? 'userarea-input-error' : ''}`}
                />
                {errors.email && (
                  <p className="userarea-error-text">{errors.email.message}</p>
                )}
              </div>
            </div>
          </section>

          <section className="userarea-section">
            <h2 className="userarea-section-title">Seguridad</h2>
            <div className="userarea-row">
              <div className="userarea-field">
                <label className="userarea-label">Nueva contraseña</label>
                <input
                  type="password"
                  disabled={isLoading}
                  placeholder="Dejar vacío para no cambiar"
                  {...register('password')}
                  className="userarea-input"
                />
                <small style={{ color: '#666', fontSize: '0.85rem' }}>
                  Solo completa este campo si quieres cambiar tu contraseña
                </small>
              </div>
            </div>
          </section>

          <div className="userarea-actions">
            <Button
              type="submit"
              variant="primary"
              size="medium"
              loading={isLoading}
              icon="💾"
            >
              Guardar Cambios
            </Button>

            <Button
              type="button"
              variant="danger"
              size="medium"
              onClick={handleDeleteAccount}
              icon="🗑️"
              disabled={isLoading}
            >
              Eliminar Cuenta
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserArea;