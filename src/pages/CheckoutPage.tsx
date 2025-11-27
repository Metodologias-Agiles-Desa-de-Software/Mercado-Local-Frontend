import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, processOrderPayment } from '../services/api';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';
import { CreditCard, Calendar, Lock, User } from 'lucide-react';

interface Order {
    _id: string;
    total: number;
    items: { producto: { nombre: string }, cantidad: number, precio: number }[];
}

export const CheckoutPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderId) {
            navigate('/');
            return;
        }
        const fetchOrder = async () => {
            try {
                const res = await getOrderById(orderId);
                setOrder(res.data);
            } catch (error) {
                Swal.fire('Error', 'No se pudo cargar la información de la orden.', 'error');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId, navigate]);

    const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        Swal.fire({
            title: 'Procesando Pago...',
            text: 'Por favor espere.',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); },
        });

        try {
            await processOrderPayment(orderId!);
            
            Swal.fire({
                icon: 'success',
                title: '¡Pago Exitoso!',
                text: 'Gracias por tu compra. Tu pedido está en camino.',
                timer: 3000,
                showConfirmButton: false,
            }).then(() => {
                clearCart();
                navigate('/');
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Hubo un problema al procesar el pago.';
            Swal.fire('Error en el Pago', errorMessage, 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    
    if (!order) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Orden no encontrada.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6 max-w-4xl">
            <h1 className="text-2xl md:text-3xl font-bold my-6 md:my-8 text-center">Finalizar Compra</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <div className="bg-gray-100 p-6 rounded-lg order-1">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Resumen de tu Orden</h2>
                    {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm mb-2">
                            <span>{item.producto.nombre} x{item.cantidad}</span>
                            <span>₡{(item.precio * item.cantidad).toLocaleString('es-CR')}</span>
                        </div>
                    ))}
                    <div className="flex justify-between font-bold text-lg mt-4 border-t pt-2">
                        <span>TOTAL</span>
                        <span>₡{order.total.toLocaleString('es-CR')}</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md order-2">
                    <h2 className="text-xl font-semibold mb-4">Información de Pago</h2>
                    <form onSubmit={handlePayment} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Número de Tarjeta (Simulado)</label>
                            <div className="relative mt-1">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                <input type="tel" inputMode="numeric" pattern="[0-9\s]{13,19}" autoComplete="cc-number" maxLength={19} required className="w-full pl-10 pr-3 py-2 border rounded-md" placeholder="0000 0000 0000 0000"/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre en la Tarjeta</label>
                            <div className="relative mt-1">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                <input type="text" required className="w-full pl-10 pr-3 py-2 border rounded-md" placeholder="Juan Pérez"/>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Expiración</label>
                                <div className="relative mt-1">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                    <input type="text" required className="w-full pl-10 pr-3 py-2 border rounded-md" placeholder="MM/AA"/>
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">CVC</label>
                                <div className="relative mt-1">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                    <input type="text" required className="w-full pl-10 pr-3 py-2 border rounded-md" placeholder="123" maxLength={4}/>
                                </div>
                            </div>
                        </div>
                        <div className="pt-4">
                            <button type="submit" className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors">
                                Pagar ₡{order.total.toLocaleString('es-CR')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};