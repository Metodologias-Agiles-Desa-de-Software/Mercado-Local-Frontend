import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import { ShoppingCart, LogIn, LogOut, UserCircle, Store, ShieldCheck, Search, Menu, ChevronDown, Package as PackageIcon, Settings, Heart } from 'lucide-react';

interface NavbarProps {
    toggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
    const { cartItemCount } = useCart();
    const { isAuthenticated, user, logout } = useAuth();
    const { searchTerm, setSearchTerm } = useSearch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const showSearchBar = location.pathname === '/';

    const handleLogout = () => {
        setDropdownOpen(false);
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    return (
        <nav className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-2 sm:px-6 py-3 flex items-center justify-between gap-2 md:gap-4">

                <div className="flex items-center gap-2 md:gap-4">
                    <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Abrir menú de categorías"><Menu size={24} className="text-gray-700" /></button>
                    <Link to="/" className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Store className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600"/> <span className="hidden md:inline">Mercado<span className="text-blue-600">Local</span></span></Link>
                </div>

                <div className="flex-1 flex justify-center px-1 sm:px-4">
                    {showSearchBar && (
                        <div className="relative w-full max-w-lg">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-2 border rounded-full text-sm sm:text-base transition-shadow focus:ring-2 focus:ring-blue-300"/>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-2 sm:gap-4">
                    <div className="hidden lg:flex items-center gap-4">
                        <Link to="/" className="text-gray-600 hover:text-blue-500 transition-colors">Tienda</Link>
                    </div>

                    <div className="hidden lg:block w-px h-6 bg-gray-200"></div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link to="/cart" id="cart-icon-container" className="relative text-gray-600 hover:text-blue-500 transition-colors p-2 sm:p-0">
                            <ShoppingCart className="h-6 w-6" />
                            {cartItemCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">{cartItemCount}</span>}
                        </Link>
                        {isAuthenticated ? (
                            <div className="relative" ref={dropdownRef}>
                                <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 font-semibold p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                    <UserCircle className="w-6 h-6 text-blue-600" />
                                    <span className="text-gray-800 hidden sm:inline">{user?.nombre}</span>
                                    <ChevronDown size={16} className={`text-gray-800 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                                        {user?.rol === 'admin' && (
                                            <>
                                                <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-semibold transition-colors">
                                                    <ShieldCheck size={16} className="text-green-600" /> Panel de Admin
                                                </Link>
                                                <hr className="my-1" />
                                            </>
                                        )}
                                        <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"><Settings size={16} /> Mi Perfil</Link>
                                        <Link to="/my-orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"><PackageIcon size={16} /> Mis Pedidos</Link>
                                        <Link to="/wishlist" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"><Heart size={16} /> Mis Favoritos</Link>
                                        <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"><LogOut size={16} /> Salir</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="p-2 text-gray-600 hover:text-blue-500 transition-colors sm:flex sm:items-center sm:gap-1">
                                    <LogIn className="h-6 w-6 sm:h-5 sm:w-5" />
                                    <span className="hidden sm:inline">Login</span>
                                </Link>
                                <Link to="/register" className="text-gray-600 hover:text-blue-500 transition-colors hidden sm:block">
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};