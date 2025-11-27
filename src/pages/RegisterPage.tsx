import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import Swal from 'sweetalert2';

export const RegisterPage: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await registerUser({ nombre, email, password });
            Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: 'Ahora puedes iniciar sesión.',
                showConfirmButton: false,
                timer: 2000
            });
            navigate('/login');
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.message || 'Error en el registro', 'error');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center">Crear Cuenta</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium">Nombre</label>
                        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Contraseña</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md"/>
                    </div>
                    <button type="submit" className="w-full py-2 px-4 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                        Registrarse
                    </button>
                </form>
                 <p className="text-center text-sm">
                    ¿Ya tienes una cuenta? <Link to="/login" className="text-blue-600 hover:underline">Inicia sesión</Link>
                </p>
                <div className="text-center mt-4 border-t pt-4">
                    <Link to="/register-admin" className="text-xs text-gray-500 hover:text-blue-600 hover:underline">
                        Registrar como Administrador
                    </Link>
                </div>
            </div>
        </div>
    );
};