import React, { useState, useEffect } from 'react';
import { getCategories } from '../services/api';
import type { Category } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import { X, List, SlidersHorizontal, RotateCw, Star } from 'lucide-react';

interface CategorySidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({ isOpen, onClose }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    
    const { 
        selectedCategory, setSelectedCategory,
        priceRange, setPriceRange,
        minRating, setMinRating,
        sortBy, setSortBy,
        setSearchTerm 
    } = useSearch();

    const [localMin, setLocalMin] = useState(priceRange?.min || '');
    const [localMax, setLocalMax] = useState(priceRange?.max || '');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategories();
                setCategories(res.data);
            } catch (error) {
                console.error("Failed to fetch categories for sidebar", error);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = (categoryId: string | null) => {
        setSelectedCategory(categoryId);
        onClose();
    };
    
    const handlePriceFilter = (e: React.FormEvent) => {
        e.preventDefault();
        const min = localMin ? Number(localMin) : 0;
        const max = localMax ? Number(localMax) : Infinity;
        setPriceRange({ min, max });
    };

    const handleClearFilters = () => {
        setPriceRange(null);
        setMinRating(0);
        setSortBy('relevance');
        setSelectedCategory(null);
        setSearchTerm('');
        setLocalMin('');
        setLocalMax('');
    };

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            
            <aside 
                className={`fixed top-0 left-0 h-full w-80 bg-gray-800 text-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}
            >
                <div className="p-4 flex justify-between items-center border-b border-gray-700">
                    <h2 className="text-xl font-bold flex items-center gap-2"><SlidersHorizontal size={22}/> Filtros y Categorías</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="flex-grow overflow-y-auto">
                    <nav className="p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-300">OPCIONES</h3>
                             <button onClick={handleClearFilters} className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                                <RotateCw size={14} /> Limpiar Filtros
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Ordenar por</label>
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full p-2 border bg-gray-700 border-gray-600 rounded-md"
                            >
                                <option value="relevance">Relevancia</option>
                                <option value="price-asc">Precio: Más bajo a más alto</option>
                                <option value="price-desc">Precio: Más alto a más bajo</option>
                                <option value="rating-desc">Mejor calificados</option>
                            </select>
                        </div>

                        <form onSubmit={handlePriceFilter} className="space-y-2 mb-6">
                            <label className="block text-sm font-semibold text-gray-300">Rango de Precio (₡)</label>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="number"
                                    placeholder="Mín"
                                    value={localMin}
                                    onChange={(e) => setLocalMin(e.target.value)}
                                    className="w-full p-2 border bg-gray-700 border-gray-600 rounded-md"
                                />
                                <span className="text-gray-400">-</span>
                                <input 
                                    type="number"
                                    placeholder="Máx"
                                    value={localMax}
                                    onChange={(e) => setLocalMax(e.target.value)}
                                    className="w-full p-2 border bg-gray-700 border-gray-600 rounded-md"
                                />
                            </div>
                            <button type="submit" className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md">
                                Aplicar Precio
                            </button>
                        </form>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-300 mb-2">Calificación Mínima</label>
                            <div className="flex flex-col space-y-1">
                                {[4, 3, 2, 1].map((rating) => (
                                    <button 
                                        key={rating}
                                        onClick={() => setMinRating(rating)}
                                        className={`w-full flex items-center gap-2 p-2 rounded-md text-sm transition-colors ${minRating === rating ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                                    >
                                        <div className="flex">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} size={16} className={i < rating ? 'text-yellow-400' : 'text-gray-500'} fill={i < rating ? 'currentColor' : 'none'}/>
                                            ))}
                                        </div>
                                        <span>y superior</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <hr className="border-gray-600 my-4" />

                        <h3 className="font-bold text-gray-300 mb-2">CATEGORÍAS</h3>
                        <ul className="space-y-2">
                            <li>
                                <button 
                                    onClick={() => handleCategoryClick(null)} 
                                    className={`w-full text-left flex items-center gap-3 p-3 rounded-lg transition-colors ${!selectedCategory ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                                >
                                    <List size={20} />
                                    <span>Todos los Productos</span>
                                </button>
                            </li>
                            {categories.map(cat => (
                                <li key={cat._id}>
                                    <button 
                                        onClick={() => handleCategoryClick(cat._id)}
                                        className={`w-full text-left p-3 rounded-lg transition-colors ${selectedCategory === cat._id ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                                    >
                                        {cat.nombre}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    );
};