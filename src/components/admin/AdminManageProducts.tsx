import React from 'react';
import Swal from 'sweetalert2';
import { getProducts, deleteProduct, getCategories, updateProduct } from '../../services/api';
import type { Product, Category } from '../../context/CartContext';
import { Edit, Trash2, Package, Star } from 'lucide-react';
import { AdminModal } from './AdminModal';
import { AdminEditProductForm } from './AdminEditProductForm';

export const AdminManageProducts: React.FC = () => {
    const [products, setProducts] = React.useState<Product[]>([]);
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

    const fetchAllData = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([getProducts(), getCategories()]);
            setProducts(productsRes.data.products);
            setCategories(categoriesRes.data);
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar los datos del panel.', 'error');
        }
    };

    React.useEffect(() => {
        fetchAllData();
    }, []);
    
    const handleToggleFeatured = async (product: Product) => {
        try {
            await updateProduct(product._id, { isFeatured: !product.isFeatured });
            setProducts(products.map(p => 
                p._id === product._id ? { ...p, isFeatured: !p.isFeatured } : p
            ));
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el producto.', 'error');
        }
    };

    const handleDelete = (id: string, name: string) => {
        Swal.fire({
            title: `¿Eliminar "${name}"?`, text: "Esta acción es irreversible.", icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#d33', cancelButtonText: 'Cancelar', confirmButtonText: 'Sí, eliminar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteProduct(id);
                    Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.', 'success');
                    fetchAllData();
                } catch (error) {
                    Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
                }
            }
        });
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleUpdateSuccess = () => {
        handleCloseModal();
        fetchAllData();
    };

    return (
        <>
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Gestionar Productos</h2>
                <div className="space-y-3 max-h-[80vh] overflow-y-auto pr-2">
                    {products.map(p => (
                        <div key={p._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-4 flex-grow">
                                <div className="w-16 h-16 bg-white flex items-center justify-center rounded-md overflow-hidden flex-shrink-0">
                                    <img src={p.imagen} alt={p.nombre} className="w-full h-full object-contain"/>
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-900">{p.nombre}</p>
                                    <p className="text-sm text-gray-600">{typeof p.categoria === 'object' ? p.categoria.nombre : 'N/A'}</p>
                                    <div className="flex items-center gap-4 mt-2 text-sm">
                                        <div className="flex items-center gap-1 text-green-700">
                                            <span className="font-medium">₡{p.precio.toLocaleString('es-CR')}</span>
                                        </div>
                                        <div className={`flex items-center gap-1 ${p.stock > 0 ? 'text-blue-700' : 'text-red-600'}`}>
                                            <Package size={14} />
                                            <span className="font-medium">{p.stock > 0 ? `${p.stock} en stock` : 'Agotado'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0 ml-4">
                                <button onClick={() => handleToggleFeatured(p)} className={`p-2 rounded-full transition-colors ${p.isFeatured ? 'text-yellow-500 bg-yellow-100' : 'text-gray-400 hover:bg-gray-200'}`} aria-label="Destacar producto">
                                    <Star size={18} fill={p.isFeatured ? 'currentColor' : 'none'}/>
                                </button>
                                <button onClick={() => handleEdit(p)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full" aria-label="Editar"><Edit size={18}/></button>
                                <button onClick={() => handleDelete(p._id, p.nombre)} className="p-2 text-red-600 hover:bg-red-100 rounded-full" aria-label="Eliminar"><Trash2 size={18}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {selectedProduct && (
                <AdminModal isOpen={isModalOpen} onClose={handleCloseModal} title="Editar Producto">
                    <AdminEditProductForm product={selectedProduct} categories={categories} onSuccess={handleUpdateSuccess} />
                </AdminModal>
            )}
        </>
    );
};