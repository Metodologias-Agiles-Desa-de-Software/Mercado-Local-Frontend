import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getCategories, createCategory, deleteCategory, updateCategory } from '../../services/api';
import type { Category } from '../../context/CartContext';
import { Edit, Trash2, PlusCircle } from 'lucide-react';

export const AdminManageCategories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');

    const fetchCategories = async () => {
        try {
            const res = await getCategories();
            setCategories(res.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        try {
            await createCategory({ nombre: newCategoryName });
            Swal.fire('¡Creada!', 'La nueva categoría ha sido añadida.', 'success');
            setNewCategoryName('');
            fetchCategories();
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.message || 'No se pudo crear la categoría.', 'error');
        }
    };

    const handleDelete = (id: string, name: string) => {
        Swal.fire({
            title: `¿Eliminar "${name}"?`,
            text: "Esto podría afectar a los productos de esta categoría.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, eliminar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteCategory(id);
                    Swal.fire('¡Eliminada!', 'La categoría ha sido eliminada.', 'success');
                    fetchCategories();
                } catch (error) {
                    Swal.fire('Error', 'No se pudo eliminar la categoría.', 'error');
                }
            }
        });
    };

    const handleEdit = (category: Category) => {
        Swal.fire({
            title: 'Editar Nombre de la Categoría',
            input: 'text',
            inputLabel: 'Nuevo nombre',
            inputValue: category.nombre,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Guardar Cambios',
            inputValidator: (value) => {
                if (!value || value.trim() === '') {
                    return '¡El nombre no puede estar vacío!'
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed && result.value) {
                try {
                    await updateCategory(category._id, { nombre: result.value });
                    Swal.fire('¡Actualizada!', 'La categoría ha sido actualizada.', 'success');
                    fetchCategories();
                } catch (error) {
                    Swal.fire('Error', 'No se pudo actualizar la categoría.', 'error');
                }
            }
        });
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestionar Categorías</h2>
            <form onSubmit={handleAdd} className="flex gap-2 mb-6">
                <input 
                    type="text" 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nombre de la nueva categoría"
                    className="flex-grow p-2 border border-gray-300 rounded-md"
                />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"><PlusCircle/></button>
            </form>
            <div className="space-y-2">
                {categories.map(cat => (
                    <div key={cat._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                        <p className="font-semibold text-gray-900">{cat.nombre}</p>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(cat)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"><Edit size={18}/></button>
                            <button onClick={() => handleDelete(cat._id, cat.nombre)} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"><Trash2 size={18}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};