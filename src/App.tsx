import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CartPage } from './pages/CartPage';
import { Navbar } from './components/Navbar';
import { CategorySidebar } from './components/CategorySidebar';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { AdminPage } from './pages/AdminPage';
import { AdminRoute } from './components/AdminRoute';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRegisterPage } from './pages/AdminRegisterPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { WishlistPage } from './pages/WishlistPage';
import { AnimatePresence, motion } from 'framer-motion';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.25 }}
      >
        <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/producto/:id" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register-admin" element={<AdminRegisterPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout/:orderId" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/my-orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <CategorySidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
              <Navbar toggleSidebar={toggleSidebar} />
              <main className="flex-grow">
                <AnimatedRoutes />
              </main>
            </div>
          </Router>
        </SearchProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;