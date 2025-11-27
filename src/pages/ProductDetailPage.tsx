import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getResenas, createResena } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../context/CartContext';
import Swal from 'sweetalert2';
import { ShoppingCart, AlertTriangle, ChevronLeft, Star, MessageSquare } from 'lucide-react';
import { StarRating } from '../components/StarRating';

interface Resena {
    _id: string;
    nombreUsuario: string;
    calificacion: number;
    comentario: string;
    createdAt: string;
}

const LOW_STOCK_THRESHOLD = 5;

const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

export const ProductDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
    const [resenas, setResenas] = useState<Resena[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        const fetchData = async (productId: string) => {
            setLoading(true);
            setError(null);
            try {
                const [productRes, resenasRes] = await Promise.all([getProductById(productId), getResenas(productId)]);
                if (productRes.data) {
                    setProduct(productRes.data);
                    setResenas(resenasRes.data);
                } else {
                    setError("El producto que buscas no existe.");
                }
            } catch (err) {
                console.error("Failed to fetch product data", err);
                setError("No se pudo cargar la información del producto.");
            } finally {
                setLoading(false);
            }
        };

        if (id && isValidObjectId(id)) {
            fetchData(id);
        } else {
            setError("El identificador del producto no es válido.");
            setLoading(false);
        }
    }, [id]);

    const handleAddToCart = () => {
        if (product && product.stock > 0) {
            addToCart(product);
            Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: '¡Agregado al carrito!', showConfirmButton: false, timer: 1500 });
        }
    };

    const handleResenaSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id) return;
        if (newRating === 0) {
            Swal.fire('Atención', 'Por favor, selecciona una calificación de estrellas.', 'warning');
            return;
        }
        try {
            await createResena(id, { calificacion: newRating, comentario: newComment });
            Swal.fire('¡Gracias!', 'Tu reseña ha sido publicada.', 'success');
            setNewRating(0);
            setNewComment('');
            if (id && isValidObjectId(id)) {
                const [productRes, resenasRes] = await Promise.all([getProductById(id), getResenas(id)]);
                setProduct(productRes.data);
                setResenas(resenasRes.data);
            }
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.message || 'No se pudo publicar tu reseña.', 'error');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-[calc(100vh-200px)]"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div></div>;
    }

    if (error || !product) {
        return (
            <div className="text-center py-20 container mx-auto">
                <h2 className="text-2xl font-bold text-red-600">Producto no encontrado</h2>
                <p className="text-gray-600 mt-2">{error || "Lo sentimos, no pudimos encontrar el producto que buscas."}</p>
                <Link to="/" className="mt-6 inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">
                    Volver a la tienda
                </Link>
            </div>
        );
    }

    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD;

    return (
        <div className="container mx-auto p-6 lg:p-12">
            <Link to="/" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-8"><ChevronLeft size={16} />Volver a la tienda</Link>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                
                <div className="bg-white rounded-lg shadow-lg p-4 lg:sticky lg:top-24">
                    <img src={product.imagen} alt={product.nombre} className="w-full h-auto max-h-[500px] object-contain"/>
                </div>
                
                <div className="space-y-6">
                    <div>
                        <span className="text-sm font-semibold text-blue-600 uppercase">{typeof product.categoria === 'object' ? product.categoria.nombre : ''}</span>
                        <h1 className="text-4xl font-bold text-gray-900 mt-2">{product.nombre}</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <StarRating rating={product.calificacionPromedio || 0} />
                        <span className="text-sm text-gray-500">({product.numeroDeResenas || 0} reseñas)</span>
                    </div>
                    <p className="text-3xl font-bold text-emerald-600">₡{product.precio.toLocaleString('es-CR')}</p>
                    <div className="text-gray-700 leading-relaxed">
                        <h3 className="font-semibold text-lg mb-2">Descripción</h3>
                        <p>{product.descripcion}</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                        {isLowStock && <div className="flex items-center gap-2 text-yellow-700"><AlertTriangle size={20} /><span className="font-semibold">¡Quedan pocas unidades!</span></div>}
                        {isOutOfStock ? <button disabled className="w-full bg-red-600 text-white font-bold py-3 rounded-lg cursor-not-allowed">Agotado</button> : <button onClick={handleAddToCart} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"><ShoppingCart className="inline-block mr-2" />Añadir al Carrito</button>}
                    </div>
                </div>
            </div>
            <div className="mt-16">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"><MessageSquare />Opiniones de Clientes</h2>
                <div className="space-y-6 mb-8">
                    {resenas.length > 0 ? resenas.map(resena => (
                        <div key={resena._id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center justify-between mb-2">
                                <p className="font-bold">{resena.nombreUsuario}</p>
                                <span className="text-xs text-gray-500">{new Date(resena.createdAt).toLocaleDateString('es-CR')}</span>
                            </div>
                            <StarRating rating={resena.calificacion} size={16} />
                            <p className="text-gray-700 mt-3">{resena.comentario}</p>
                        </div>
                    )) : (
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <p className="text-gray-500">Este producto aún no tiene reseñas. ¡Sé el primero en opinar!</p>
                        </div>
                    )}
                </div>
                {isAuthenticated && id && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="font-semibold mb-4">Escribe tu propia reseña</h3>
                        <form onSubmit={handleResenaSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tu calificación:</label>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star key={star} size={28} className={`cursor-pointer ${(hoverRating || newRating) >= star ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" onClick={() => setNewRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}/>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="comentario" className="block text-sm font-medium mb-1">Tu comentario:</label>
                                <textarea id="comentario" rows={4} value={newComment} onChange={(e) => setNewComment(e.target.value)} required className="w-full p-2 border rounded-md" placeholder={`¿Qué te pareció ${product.nombre}?`}/>
                            </div>
                            <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md">Publicar Reseña</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};