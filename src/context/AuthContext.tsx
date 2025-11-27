import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import Swal from 'sweetalert2';
import { toggleWishlist as apiToggleWishlist } from '../services/api';

interface User {
  id: string;
  nombre: string;
  email: string;
  rol: 'cliente' | 'admin';
  wishlist: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
  wishlist: Set<string>;
  toggleWishlist: (productId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
        const token = sessionStorage.getItem('token');
        const userData = sessionStorage.getItem('user');
        if (token && userData) {
            const parsedUser: User = JSON.parse(userData);
            setIsAuthenticated(true);
            setUser(parsedUser);
            setWishlist(new Set(parsedUser.wishlist || []));
        }
    } catch (error) {
        sessionStorage.clear();
    } finally {
        setIsLoading(false);
    }
  }, []);

  const login = (token: string, userData: User) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    setWishlist(new Set(userData.wishlist || []));
  };

  const logout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
    setWishlist(new Set());
    Swal.fire({
        icon: 'info', title: 'Has cerrado sesión', toast: true,
        position: 'top-end', showConfirmButton: false, timer: 1500,
    });
  };

  const toggleWishlist = async (productId: string) => {
      if (!isAuthenticated || !user) {
          Swal.fire('Inicia Sesión', 'Debes iniciar sesión para guardar productos en tu lista de deseos.', 'info');
          return;
      }

      const originalWishlist = new Set(wishlist);
      const newWishlist = new Set(wishlist);
      if (newWishlist.has(productId)) {
          newWishlist.delete(productId);
      } else {
          newWishlist.add(productId);
      }
      setWishlist(newWishlist);

      try {
          const res = await apiToggleWishlist(productId);
          const updatedWishlistFromServer: string[] = res.data.wishlist;

          setWishlist(new Set(updatedWishlistFromServer));

          const updatedUser = { ...user, wishlist: updatedWishlistFromServer };
          setUser(updatedUser);
          sessionStorage.setItem('user', JSON.stringify(updatedUser));

      } catch (error: any) {
          setWishlist(originalWishlist);
          const errorMessage = error.response?.data?.message || 'No se pudo actualizar tu lista de deseos.';
          Swal.fire('Error', errorMessage, 'error');
      }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading, wishlist, toggleWishlist }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};