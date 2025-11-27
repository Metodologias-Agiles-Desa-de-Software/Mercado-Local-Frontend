import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile, changePassword } from '../services/api';
import Swal from 'sweetalert2';
import { User, Lock, Save } from 'lucide-react';

export const ProfilePage: React.FC = () => {
    const { user, login } = useAuth();
    const [nombre, setNombre] = useState(user?.nombre || '');
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleNameUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (nombre.trim() === user?.nombre) return;
        try {
            const res = await updateUserProfile({ nombre });
            const updatedUser = res.data.user;
            const token = sessionStorage.getItem('token');
            if (token) {
                login(token, updatedUser);
            }
            Swal.fire('¡Éxito!', 'Tu nombre ha sido actualizado.', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar tu nombre.', 'error');
        }
    };

    const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            Swal.fire('Error', 'Las nuevas contraseñas no coinciden.', 'error');
            return;
        }
        if (newPassword.length < 6) {
            Swal.fire('Error', 'La nueva contraseña debe tener al menos 6 caracteres.', 'error');
            return;
        }
        try {
            await changePassword({ currentPassword, newPassword });
            Swal.fire('¡Éxito!', 'Tu contraseña ha sido cambiada.', 'success');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.message || 'No se pudo cambiar la contraseña.', 'error');
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-6 max-w-2xl">
            <h1 className="text-2xl md:text-3xl font-bold my-6 md:my-8 text-gray-800">Mi Perfil</h1>
            
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md mb-8 border border-gray-200">
                <h2 className="text-xl font-semibold mb-6 text-gray-900 flex items-center gap-3"><User className="text-blue-500"/>Datos Personales</h2>
                <form onSubmit={handleNameUpdate} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
                        <input type="email" id="email" value={user?.email || ''} disabled className="mt-1 block w-full p-2 bg-gray-100 border-gray-300 rounded-md cursor-not-allowed"/>
                    </div>
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-600">Nombre</label>
                        <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2">
                            <Save size={18}/> Guardar Nombre
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold mb-6 text-gray-900 flex items-center gap-3"><Lock className="text-blue-500"/>Cambiar Contraseña</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Contraseña Actual</label>
                        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Nueva Contraseña</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Confirmar Nueva Contraseña</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2">
                            <Save size={18}/> Cambiar Contraseña
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};