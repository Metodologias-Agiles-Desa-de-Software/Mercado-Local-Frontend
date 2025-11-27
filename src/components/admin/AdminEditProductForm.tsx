import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { updateProduct } from '../../services/api';
import type { Product, Category } from '../../context/CartContext';

interface EditProductFormProps {
    product: Product;
    categories: Category[];
    onSuccess: () => void;
}

export const AdminEditProductForm: React.FC<EditProductFormProps> = ({ product, categories, onSuccess }) => {
    const [formData, setFormData] = useState({
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precio,
        categoria: typeof product.categoria === 'object' ? product.categoria._id : product.categoria,
        stock: product.stock,
        imagen: product.imagen,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(product.imagen);
    const [isUploading, setIsUploading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadImage = async (): Promise<string | null> => {
        if (!imageFile) return formData.imagen;
        setIsUploading(true);
        const data = new FormData();
        data.append('file', imageFile);
        data.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        try {
            const res = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, data);
            setIsUploading(false);
            return res.data.secure_url;
        } catch (error: any) {
            console.error('Error uploading image:', error.response?.data);
            setIsUploading(false);
            const errorMessage = error.response?.data?.error?.message || 'No se pudo subir la imagen.';
            Swal.fire('Error de Cloudinary', `Detalle: ${errorMessage}`, 'error');
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newImageUrl = await uploadImage();
        if (!newImageUrl) return;

        try {
            await updateProduct(product._id, {
                ...formData,
                imagen: newImageUrl,
                precio: Number(formData.precio),
                stock: Number(formData.stock),
            });
            Swal.fire('¡Actualizado!', 'El producto ha sido actualizado.', 'success');
            onSuccess();
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el producto.', 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                <input type="text" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
            </div>
            <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea name="descripcion" id="descripcion" value={formData.descripcion} onChange={handleChange} required rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
            </div>
            <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
                <select name="categoria" id="categoria" value={formData.categoria} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.nombre}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="precio" className="block text-sm font-medium text-gray-700">Precio (₡)</label>
                    <input type="number" name="precio" id="precio" value={formData.precio} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
                </div>
                <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                    <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"/>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Imagen del Producto</label>
                <div className="mt-1 flex items-center gap-4">
                    <img src={imagePreview || 'https://placehold.co/100x100'} alt="Vista previa" className="w-24 h-24 object-cover rounded-md"/>
                    <label htmlFor="file-edit-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm">
                        <span>Cambiar imagen</span>
                        <input id="file-edit-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*"/>
                    </label>
                </div>
            </div>
            <div className="pt-2">
                <button type="submit" disabled={isUploading} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                    {isUploading ? 'Subiendo...' : 'Guardar Cambios'}
                </button>
            </div>
        </form>
    );
};