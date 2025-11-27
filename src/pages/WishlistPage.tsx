import React, { useState, useEffect } from 'react';
import { getWishlist } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import type { Product } from '../context/CartContext';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WishlistPage: React.FC = () => {
    const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const res = await getWishlist();
                setWishlistProducts(res.data);
            } catch (error) {
                console.error("Failed to fetch wishlist", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold my-8 text-gray-800">Mi Lista de Deseos</h1>
            {wishlistProducts.length === 0 ? (
                <div className="text-center bg-white p-12 rounded-lg shadow">
                    <Heart size={48} className="mx-auto text-gray-400" />
                    <h2 className="mt-4 text-xl font-semibold text-gray-700">Tu lista de deseos está vacía</h2>
                    <p className="text-gray-500 mt-2">Haz clic en el corazón de los productos que te gusten para guardarlos aquí.</p>
                    <Link to="/" className="mt-6 inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">
                        Explorar Productos
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {wishlistProducts.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};