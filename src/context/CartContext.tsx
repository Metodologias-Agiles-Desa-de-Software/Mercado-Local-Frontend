import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface Category {
  _id: string;
  nombre: string;
}

export interface Product {
    _id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    categoria: Category | string;
    imagen: string;
    stock: number;
    isFeatured?: boolean;
    calificacionPromedio?: number;
    numeroDeResenas?: number;
}

export interface CartItem extends Product {
  cantidad: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartItemCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        try {
            const localData = sessionStorage.getItem('cart');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            return [];
        }
    });

    useEffect(() => {
        sessionStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product: Product) => {
        setCartItems(prevItems => {
            const itemExists = prevItems.find(item => item._id === product._id);
            if (itemExists) {
                return prevItems.map(item =>
                    item._id === product._id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }
            return [...prevItems, { ...product, cantidad: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        setCartItems(
            prevItems =>
                prevItems
                    .map(item =>
                        item._id === productId ? { ...item, cantidad: quantity } : item
                    )
                    .filter(item => item.cantidad > 0)
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartItemCount = cartItems.reduce((count, item) => count + item.cantidad, 0);
    const cartTotal = cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartItemCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
};