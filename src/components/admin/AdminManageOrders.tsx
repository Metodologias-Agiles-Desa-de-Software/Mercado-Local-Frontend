import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus, getOrderById } from '../../services/api';
import Swal from 'sweetalert2';
import { Search, Calendar, User, DollarSign } from 'lucide-react';
import { AdminOrderDetailModal } from './AdminOrderDetailModal';
import type { Order as FullOrderDetails } from '../../pages/OrdersPage';

interface OrderSummary {
    _id: string;
    orderNumber?: string;
    cliente: { nombre: string; email: string };
    total: number;
    estado: 'pendiente' | 'pagado' | 'enviado' | 'entregado';
    createdAt: string;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pagado': return 'bg-green-100 text-green-800 ring-green-600/20';
        case 'enviado': return 'bg-blue-100 text-blue-800 ring-blue-600/20';
        case 'entregado': return 'bg-purple-100 text-purple-800 ring-purple-600/20';
        default: return 'bg-yellow-100 text-yellow-800 ring-yellow-600/20';
    }
};

export const AdminManageOrders: React.FC = () => {
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<FullOrderDetails | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchOrders = async () => {
        try {
            const res = await getAllOrders();
            setOrders(res.data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            Swal.fire('¡Éxito!', 'El estado del pedido ha sido actualizado.', 'success');
            fetchOrders();
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el estado del pedido.', 'error');
        }
    };

    const handleRowClick = async (orderId: string) => {
        try {
            const res = await getOrderById(orderId);
            setSelectedOrder(res.data);
            setIsModalOpen(true);
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar los detalles del pedido.', 'error');
        }
    };

    const filteredOrders = orders.filter(order => {
        const search = searchTerm.toLowerCase();
        const clientNameMatch = order.cliente.nombre.toLowerCase().includes(search);
        const orderNumberMatch = order.orderNumber ? order.orderNumber.toLowerCase().includes(search) : false;
        
        return clientNameMatch || orderNumberMatch;
    });

    return (
        <>
            <div className="bg-white p-4 sm:p-8 rounded-xl shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">Gestionar Pedidos</h2>
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por cliente o N° Pedido..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-64 pl-10 pr-4 py-2 border rounded-full"
                        />
                    </div>
                </div>

                <div className="space-y-4 md:hidden">
                    {filteredOrders.map(order => (
                        <div key={order._id} className="bg-gray-50 rounded-lg p-4 shadow" onClick={() => handleRowClick(order._id)}>
                            <div className="flex justify-between items-start mb-2">
                                <p className="font-bold text-gray-900">{order.orderNumber || 'N/A'}</p>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(order.estado)}`}>
                                    {order.estado}
                                </span>
                            </div>
                            <div className="text-sm space-y-2 text-gray-600">
                                <p className="flex items-center gap-2"><User size={14} /> {order.cliente.nombre}</p>
                                <p className="flex items-center gap-2"><Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString('es-CR')}</p>
                                <p className="flex items-center gap-2 font-semibold"><DollarSign size={14} /> ₡{order.total.toLocaleString('es-CR')}</p>
                            </div>
                            <div onClick={(e) => e.stopPropagation()} className="mt-3">
                                <select 
                                    value={order.estado}
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    className={`w-full p-2 rounded-md text-xs font-medium appearance-none text-center ${getStatusColor(order.estado)}`}
                                >
                                    <option value="pendiente">Pendiente</option>
                                    <option value="pagado">Pagado</option>
                                    <option value="enviado">Enviado</option>
                                    <option value="entregado">Entregado</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="overflow-x-auto hidden md:block">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">N° Pedido</th>
                                <th scope="col" className="px-6 py-3">Cliente</th>
                                <th scope="col" className="px-6 py-3">Fecha</th>
                                <th scope="col" className="px-6 py-3">Total</th>
                                <th scope="col" className="px-6 py-3">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order._id} className="bg-white border-b hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(order._id)}>
                                    <td className="px-6 py-4 font-medium text-gray-900">{order.orderNumber || 'N/A'}</td>
                                    <td className="px-6 py-4">{order.cliente.nombre}</td>
                                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString('es-CR')}</td>
                                    <td className="px-6 py-4 font-semibold">₡{order.total.toLocaleString('es-CR')}</td>
                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                        <select 
                                            value={order.estado}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className={`w-full p-2 border-none rounded-full text-xs font-medium appearance-none text-center ${getStatusColor(order.estado)}`}
                                        >
                                            <option value="pendiente">Pendiente</option>
                                            <option value="pagado">Pagado</option>
                                            <option value="enviado">Enviado</option>
                                            <option value="entregado">Entregado</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <AdminOrderDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} order={selectedOrder} />
        </>
    );
};