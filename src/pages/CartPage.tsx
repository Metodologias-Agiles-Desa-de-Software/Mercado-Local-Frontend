import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';
import Swal from 'sweetalert2';
import { Trash2, Plus, Minus } from 'lucide-react';

export const CartPage: React.FC = () => {
    const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            Swal.fire({
                title: 'Debes iniciar sesión',
                text: "Para continuar con la compra, por favor inicia sesión o regístrate.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ir a Login'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
            return;
        }

        const orderData = {
            items: cartItems.map(item => ({ producto: item._id, cantidad: item.cantidad, precio: item.precio })),
            total: cartTotal,
        };

        try {
            const res = await createOrder(orderData);
            const newOrderId = res.data.order._id;
            navigate(`/checkout/${newOrderId}`);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Hubo un problema al validar tu pedido.';
            Swal.fire({
                icon: 'error',
                title: 'No se puede proceder',
                text: errorMessage,
            });
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-6">
            <h1 className="text-3xl font-bold my-6">Tu Carrito de Compras</h1>
            {cartItems.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-xl text-gray-500">Tu carrito está vacío.</p>
                    <button onClick={() => navigate('/')} className="mt-4 bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">
                        Volver a la tienda
                    </button>
                </div>
            ) : (
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
                    {cartItems.map(item => (
                        <div key={item._id} className="flex flex-col md:flex-row justify-between items-center border-b py-4">
                            <div className="flex items-center space-x-4 mb-4 md:mb-0 w-full md:w-auto">
                                <div className="h-20 w-20 bg-gray-100 flex-shrink-0 rounded-md flex items-center justify-center">
                                    <img 
                                      src={item.imagen} 
                                      alt={item.nombre} 
                                      className="h-full w-full object-contain"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <h2 className="font-bold text-lg">{item.nombre}</h2>
                                    <p className="text-sm text-gray-600">₡{item.precio.toLocaleString('es-CR')}</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                                <div className="flex items-center border rounded w-full justify-center sm:w-auto">
                                    <button onClick={() => updateQuantity(item._id, item.cantidad - 1)} className="p-2 hover:bg-gray-100"><Minus size={16}/></button>
                                    <span className="px-4">{item.cantidad}</span>
                                    <button onClick={() => updateQuantity(item._id, item.cantidad + 1)} className="p-2 hover:bg-gray-100"><Plus size={16}/></button>
                                </div>
                                <div className="flex justify-between w-full sm:w-auto items-center">
                                    <p className="font-semibold w-24 text-right sm:text-left">₡{(item.precio * item.cantidad).toLocaleString('es-CR')}</p>
                                    <button onClick={() => removeFromCart(item._id)} className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100"><Trash2 size={20}/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="flex flex-col items-end mt-6">
                        <h2 className="text-2xl font-bold">Total: ₡{cartTotal.toLocaleString('es-CR')}</h2>
                        <button onClick={handleCheckout} className="mt-4 w-full sm:w-auto bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105">
                            Proceder al Pago
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};