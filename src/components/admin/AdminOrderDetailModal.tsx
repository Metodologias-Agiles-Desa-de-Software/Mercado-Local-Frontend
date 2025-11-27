import React from 'react';
import { AdminModal } from './AdminModal';
import type { Order as FullOrder } from '../../pages/OrdersPage';
import { User, Calendar, Package } from 'lucide-react';

interface OrderDetailModalProps {
    order: FullOrder | null;
    isOpen: boolean;
    onClose: () => void;
}

const getStatusPill = (status: string) => {
    const baseClasses = "px-3 py-1 text-xs font-medium rounded-full capitalize";
    switch (status) {
        case 'pagado': return `${baseClasses} bg-green-100 text-green-800`;
        case 'enviado': return `${baseClasses} bg-blue-100 text-blue-800`;
        case 'entregado': return `${baseClasses} bg-purple-100 text-purple-800`;
        default: return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
};

export const AdminOrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, isOpen, onClose }) => {
    if (!order) return null;

    return (
        <AdminModal isOpen={isOpen} onClose={onClose} title={`Detalles del Pedido ${order.orderNumber}`}>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><User size={16} /> Cliente</h3>
                        <p className="text-gray-600">{order.cliente.nombre}</p>
                        <p className="text-gray-500">{order.cliente.email}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><Calendar size={16} /> Fecha y Estado</h3>
                        <p className="text-gray-600">{new Date(order.createdAt).toLocaleString('es-CR')}</p>
                        <div className="mt-1">
                            <span className={getStatusPill(order.estado)}>{order.estado}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"><Package size={16} /> Artículos Comprados</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto border rounded-lg p-3">
                        {order.items.map(item => (
                            item.producto ? (
                                <div key={item.producto._id} className="flex items-center gap-4">
                                    <img src={item.producto.imagen} alt={item.producto.nombre} className="w-14 h-14 object-contain rounded bg-white p-1 border"/>
                                    <div className="flex-grow">
                                        <p className="font-medium text-gray-900">{item.producto.nombre}</p>
                                        <p className="text-gray-500 text-xs">{item.cantidad} x ₡{item.precio.toLocaleString('es-CR')}</p>
                                    </div>
                                    <p className="font-semibold text-gray-800">₡{(item.cantidad * item.precio).toLocaleString('es-CR')}</p>
                                </div>
                            ) : null
                        ))}
                    </div>
                </div>

                <div className="text-right border-t pt-4">
                    <p className="text-gray-600">Total del Pedido:</p>
                    <p className="text-2xl font-bold text-green-600">₡{order.total.toLocaleString('es-CR')}</p>
                </div>
            </div>
        </AdminModal>
    );
};