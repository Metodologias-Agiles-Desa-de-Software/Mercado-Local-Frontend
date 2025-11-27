import React, { useRef } from 'react';
import Swal from 'sweetalert2';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Heart } from 'lucide-react';
import type { Product } from '../context/CartContext';
import { Link } from 'react-router-dom';

const LOW_STOCK_THRESHOLD = 5;

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist, isAuthenticated } = useAuth();
  const imageRef = useRef<HTMLImageElement>(null);
  const isWishlisted = wishlist.has(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) return;

    const productImage = imageRef.current;
    const cartIcon = document.getElementById('cart-icon-container');
    if (!productImage || !cartIcon) {
        addToCart(product);
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: '¡Agregado!', showConfirmButton: false, timer: 1500 });
        return;
    };

    const imgClone = productImage.cloneNode(true) as HTMLImageElement;
    const rect = productImage.getBoundingClientRect();
    imgClone.style.position = 'fixed';
    imgClone.style.left = `${rect.left}px`;
    imgClone.style.top = `${rect.top}px`;
    imgClone.style.width = `${rect.width}px`;
    imgClone.style.height = `${rect.height}px`;
    imgClone.style.objectFit = 'contain';
    imgClone.style.pointerEvents = 'none';
    imgClone.style.zIndex = '1000';
    imgClone.style.transition = 'all 0.6s ease-in-out';
    document.body.appendChild(imgClone);

    const cartRect = cartIcon.getBoundingClientRect();
    const endX = cartRect.left + cartRect.width / 2 - rect.width / 2;
    const endY = cartRect.top + cartRect.height / 2 - rect.height / 2;

    setTimeout(() => {
        imgClone.style.left = `${endX}px`;
        imgClone.style.top = `${endY}px`;
        imgClone.style.transform = 'scale(0.2)';
        imgClone.style.opacity = '0';
    }, 50);

    setTimeout(() => {
        document.body.removeChild(imgClone);
        addToCart(product);
        Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: '¡Agregado!', showConfirmButton: false, timer: 1500 });
    }, 650);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD;

  if (!product?._id) return null;

  return (
    <Link to={`/producto/${product._id}`} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 flex flex-col relative group">
        <div className="relative">
            {isAuthenticated && (
                <button onClick={handleWishlistToggle} className="absolute top-3 right-3 z-20 p-2 bg-white/70 rounded-full backdrop-blur-sm hover:bg-white transition-all duration-200 transform hover:scale-110" aria-label="Añadir a la lista de deseos">
                    <Heart size={20} className={`transition-all ${isWishlisted ? 'text-red-500' : 'text-gray-500'}`} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
            )}
            {isLowStock && !isOutOfStock && (<div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full z-10">Pocas unidades</div>)}
            {isOutOfStock && (<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10"><span className="text-white text-lg font-bold bg-red-600 px-4 py-2 rounded-md">AGOTADO</span></div>)}
            <div className="h-52 w-full bg-gray-50 flex items-center justify-center p-2">
                <img ref={imageRef} src={product.imagen || 'https://placehold.co/400x300'} alt={product.nombre} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"/>
            </div>
        </div>
        <div className="p-5 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-gray-800 truncate">{product.nombre}</h3>
            <p className="text-sm text-gray-500 uppercase">{typeof product.categoria === 'object' ? product.categoria.nombre : 'Sin Categoría'}</p>
            <p className="text-gray-600 mt-2 text-sm flex-grow min-h-[40px]">{product.descripcion}</p>
        </div>
        <div className="p-5 pt-0 mt-auto flex justify-between items-center">
            <span className="text-2xl font-bold text-emerald-600">₡{product.precio.toLocaleString('es-CR')}</span>
            {isOutOfStock ? (
                <div className="bg-red-600 text-white font-bold py-2 px-4 rounded-full text-sm">Agotado</div>
            ) : (
                <button onClick={handleAddToCart} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2 z-20">
                    Añadir <ShoppingCart className="w-5 h-5" />
                </button>
            )}
        </div>
    </Link>
  );
};