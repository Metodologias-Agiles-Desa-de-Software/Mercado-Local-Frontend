import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

interface AdminRouteProps {
  children: React.ReactElement;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.rol !== 'admin') {
    Swal.fire({
      icon: 'error',
      title: 'Acceso Denied',
      text: 'No tienes permisos para acceder a esta página.',
      timer: 2500,
      showConfirmButton: false,
    });
    return <Navigate to="/" replace />;
  }

  return children;
};