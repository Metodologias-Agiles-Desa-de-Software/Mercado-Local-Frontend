import React, { useState, useEffect } from 'react';
import { getMyOrders } from '../services/api';
import { Package, Calendar, Hash, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface OrderProduct {
    _id: string;
    nombre: string;
    imagen: string;
}
export interface OrderItem {
    producto: OrderProduct | null;
    cantidad: number;
    precio: number;
}
export interface Order {
    _id: string;
    orderNumber: string;
    createdAt: string;
    total: number;
    estado: string;
    items: OrderItem[];
    cliente: {
        _id: string;
        nombre: string;
        email: string;
    };
}

export const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await getMyOrders();
                setOrders(res.data);
            } catch (err) {
                setError("No se pudieron cargar tus pedidos.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6 text-center">
                 <div className="text-center bg-white p-12 rounded-lg shadow">
                    <AlertCircle size={48} className="mx-auto text-red-400" />
                    <h2 className="mt-4 text-xl font-semibold text-red-700">Ocurrió un Error</h2>
                    <p className="text-gray-500 mt-2">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6 max-w-4xl">
            <h1 className="text-2xl md:text-3xl font-bold my-6 md:my-8 text-gray-800">Mis Pedidos</h1>
            {orders.length === 0 ? (
                <div className="text-center bg-white p-12 rounded-lg shadow">
                    <Package size={48} className="mx-auto text-gray-400" />
                    <h2 className="mt-4 text-xl font-semibold text-gray-700">Aún no tienes pedidos</h2>
                    <Link to="/" className="mt-6 inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">
                        Ir a la Tienda
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <details key={order._id} className="bg-white rounded-lg shadow overflow-hidden">
                            <summary className="p-4 cursor-pointer grid grid-cols-2 sm:flex sm:justify-between items-center font-semibold text-gray-700 hover:bg-gray-50 gap-y-2">
                                <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                                    <Hash size={16} className="text-gray-400" />
                                    <span>Pedido {order.orderNumber}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar size={16} />
                                    <span>{new Date(order.createdAt).toLocaleDateString('es-CR')}</span>
                                </div>
                                <div className="flex items-center gap-4 justify-end">
                                    <span className="text-lg font-bold text-green-600">₡{order.total.toLocaleString('es-CR')}</span>
                                    <span className={`px-2 py-1 text-xs rounded-full capitalize ${order.estado === 'pagado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {order.estado}
                                    </span>
                                </div>
                            </summary>
                            <div className="p-4 border-t border-gray-200 bg-gray-50">
                                <h4 className="font-semibold mb-3 text-gray-600">Artículos del pedido:</h4>
                                <div className="space-y-3">
                                    {order.items.map(item => (
                                        item.producto ? (
                                            <div key={item.producto._id} className="flex items-center gap-4 text-sm">
                                                <img src={item.producto.imagen} alt={item.producto.nombre} className="w-12 h-12 object-contain rounded bg-white p-1" />
                                                <div className="flex-grow">
                                                    <p className="font-medium">{item.producto.nombre}</p>
                                                    <p className="text-gray-500">{item.cantidad} x ₡{item.precio.toLocaleString('es-CR')}</p>
                                                </div>
                                                <p className="font-semibold">₡{(item.cantidad * item.precio).toLocaleString('es-CR')}</p>
                                            </div>
                                        ) : null
                                    ))}
                                </div>
                            </div>
                        </details>
                    ))}
                </div>
            )}
        </div>
    );
};