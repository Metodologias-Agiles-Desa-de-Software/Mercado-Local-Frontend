import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerAdminUser } from '../services/api';
import Swal from 'sweetalert2';
import { KeyRound, User, Mail, Lock } from 'lucide-react';

export const AdminRegisterPage: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminSecretCode, setAdminSecretCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await registerAdminUser({ nombre, email, password, adminSecretCode });
      Swal.fire({
        icon: 'success',
        title: '¡Administrador Registrado!',
        text: 'Tu cuenta de administrador ha sido creada. Ahora puedes iniciar sesión.',
        showConfirmButton: false,
        timer: 2500,
      });
      navigate('/login');
    } catch (error: any) {
      Swal.fire(
        'Error',
        error.response?.data?.message || 'Error en el registro de administrador.',
        'error'
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800">Registro de Administrador</h1>
        <p className="text-center text-sm text-gray-500">
          Crea la cuenta principal para gestionar la tienda.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nombre</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                required 
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nombre del dueño"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Código Secreto de Administrador</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={adminSecretCode}
                onChange={(e) => setAdminSecretCode(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingresa el código secreto"
              />
            </div>
          </div>
          <button type="submit" className="w-full py-3 px-4 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105">
            Crear Cuenta de Administrador
          </button>
        </form>
      </div>
    </div>
  );
};