import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log(`La API se está conectando a: ${API_URL}`);
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

interface UserData { nombre: string; email: string; password?: string; }
interface AdminUserData extends UserData { adminSecretCode: string; }
interface Credentials { email: string; password: string; }
interface OrderItem { producto: string; cantidad: number; precio: number; }
interface OrderData { items: OrderItem[]; total: number; }
interface ProductData { nombre: string; descripcion: string; precio: number; categoria: string; imagen: string; stock: number; isFeatured?: boolean; }
interface ProfileUpdateData { nombre: string; }
interface PasswordChangeData { currentPassword: string; newPassword: string; }
interface ResenaData { calificacion: number; comentario: string; }

interface GetProductsParams {
    page?: number;
    limit?: number;
    category?: string | null;
    searchTerm?: string;
    priceMin?: number;
    priceMax?: number;
    minRating?: number;
    sortBy?: string;
}

export const registerUser = (userData: UserData) => api.post('/auth/register', userData);
export const registerAdminUser = (adminData: AdminUserData) => api.post('/auth/register-admin', adminData);
export const loginUser = (credentials: Credentials) => api.post('/auth/login', credentials);

export const getProducts = (params: GetProductsParams = {}) => {
    const queryParams: Record<string, string> = {};

    if (params.page) queryParams.page = String(params.page);
    if (params.limit) queryParams.limit = String(params.limit);
    if (params.category) queryParams.category = params.category;
    if (params.searchTerm) queryParams.searchTerm = params.searchTerm;
    if (params.priceMin !== undefined && params.priceMin > 0) queryParams.priceMin = String(params.priceMin);
    if (params.priceMax !== undefined && params.priceMax !== Infinity) queryParams.priceMax = String(params.priceMax);
    if (params.minRating) queryParams.minRating = String(params.minRating);
    if (params.sortBy) queryParams.sortBy = params.sortBy;

    const queryString = new URLSearchParams(queryParams).toString();
    
    return api.get(`/productos?${queryString}`);
};

export const getProductById = (productId: string) => api.get(`/productos/${productId}`);
export const getFeaturedProducts = () => api.get('/productos/featured');
export const createOrder = (orderData: OrderData) => api.post('/orders/create', orderData);
export const getOrderById = (orderId: string) => api.get(`/orders/${orderId}`);
export const processOrderPayment = (orderId: string) => api.post(`/orders/${orderId}/pay`);
export const createProduct = (productData: ProductData) => api.post('/productos', productData);
export const deleteProduct = (productId: string) => api.delete(`/productos/${productId}`);
export const updateProduct = (productId: string, productData: Partial<ProductData>) => api.put(`/productos/${productId}`, productData);
export const getCategories = () => api.get('/categorias');
export const createCategory = (categoryData: { nombre: string }) => api.post('/categorias', categoryData);
export const deleteCategory = (categoryId: string) => api.delete(`/categorias/${categoryId}`);
export const updateCategory = (categoryId: string, categoryData: { nombre: string }) => api.put(`/categorias/${categoryId}`, categoryData);
export const getDashboardStats = () => api.get('/dashboard');
export const getMyOrders = () => api.get('/orders/my-orders');
export const updateUserProfile = (data: ProfileUpdateData) => api.put('/user/profile', data);
export const changePassword = (data: PasswordChangeData) => api.put('/user/change-password', data);
export const getAllOrders = () => api.get('/orders/admin/all');
export const updateOrderStatus = (orderId: string, estado: string) => api.put(`/orders/admin/${orderId}/status`, { estado });
export const getResenas = (productId: string) => api.get(`/resenas/${productId}`);
export const createResena = (productId: string, resenaData: ResenaData) => api.post(`/resenas/${productId}`, resenaData);
export const getWishlist = () => api.get('/user/wishlist');
export const toggleWishlist = (productId: string) => api.post('/user/wishlist/toggle', { productId });