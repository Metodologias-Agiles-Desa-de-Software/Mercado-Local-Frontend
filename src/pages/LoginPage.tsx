import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';
import Swal from 'sweetalert2';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await loginUser({ email, password });
            login(res.data.token, res.data.user);
            
            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido de vuelta!',
                timer: 1500,
                showConfirmButton: false
            });
            navigate('/');
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.message || 'Error al iniciar sesión', 'error');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md p-6 sm:p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center">Iniciar Sesión</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Contraseña</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <button type="submit" className="w-full py-2 px-4 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                        Entrar
                    </button>
                </form>
                <p className="text-center text-sm">
                    ¿No tienes una cuenta? <Link to="/register" className="text-blue-600 hover:underline">Regístrate aquí</Link>
                </p>
            </div>
        </div>
    );
};