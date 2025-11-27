import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { createProduct, getCategories } from '../../services/api';
import type { Category } from '../../context/CartContext';
import { UploadCloud } from 'lucide-react';

export const AdminAddProduct: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState(0);
    const [categoria, setCategoria] = useState('');
    const [stock, setStock] = useState(0);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategories();
                setCategories(res.data);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadImage = async (): Promise<string | null> => {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            console.error("Cloudinary .env variables are not set!");
            Swal.fire('Error de Configuración', 'Las credenciales de Cloudinary no están definidas. Revisa tu archivo .env y reinicia el servidor.', 'error');
            return null;
        }

        if (!imageFile) return null;
        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', uploadPreset);

        try {
            const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
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
        if (!categoria || !imageFile) {
            Swal.fire('Atención', 'Debes seleccionar una categoría y una imagen.', 'warning');
            return;
        }

        const imageUrl = await uploadImage();
        if (!imageUrl) return;

        const productData = { nombre, descripcion, precio, categoria, stock, imagen: imageUrl };

        try {
            await createProduct(productData);
            Swal.fire('¡Éxito!', 'Producto creado correctamente.', 'success');
            setNombre(''); setDescripcion(''); setPrecio(0); setCategoria(''); setStock(0);
            setImageFile(null); setImagePreview(null);
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.message || 'No se pudo crear el producto.', 'error');
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Añadir un Nuevo Producto</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Categoría</label>
                        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} required className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm">
                            <option value="" disabled>Selecciona...</option>
                            {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.nombre}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required rows={3} className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Precio (₡)</label>
                        <input type="number" value={precio} onChange={(e) => setPrecio(Number(e.target.value))} required className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Stock</label>
                        <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} required className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm"/>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Imagen del Producto</label>
                    <div className="mt-1 flex items-center gap-4 p-4 border-2 border-dashed border-gray-300 rounded-md">
                        <div className="w-24 h-24 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Vista previa" className="w-full h-full object-cover"/>
                            ) : (
                                <UploadCloud className="w-8 h-8 text-gray-400"/>
                            )}
                        </div>
                        <label htmlFor="file-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                            <span>Seleccionar archivo</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*"/>
                        </label>
                    </div>
                </div>
                <button type="submit" disabled={isUploading} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors">
                    {isUploading ? 'Subiendo imagen...' : 'Guardar Producto'}
                </button>
            </form>
        </div>
    );
};