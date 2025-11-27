import React, { useState } from 'react';
import { PlusCircle, List, Tag, LayoutDashboard, ShoppingCart, Menu, X } from 'lucide-react';
import { AdminAddProduct } from '../components/admin/AdminAddProduct';
import { AdminManageProducts } from '../components/admin/AdminManageProducts';
import { AdminManageCategories } from '../components/admin/AdminManageCategories';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { AdminManageOrders } from '../components/admin/AdminManageOrders';

type AdminView = 'dashboard' | 'manageOrders' | 'manageProducts' | 'addProduct' | 'manageCategories'

export const AdminPage: React.FC = () => {
  const [activeView, setActiveView] = useState<AdminView>('dashboard')
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'manageOrders', label: 'Gestionar Pedidos', icon: ShoppingCart },
    { id: 'manageProducts', label: 'Gestionar Productos', icon: List },
    { id: 'addProduct', label: 'Añadir Producto', icon: PlusCircle },
    { id: 'manageCategories', label: 'Gestionar Categorías', icon: Tag },
  ]

  const handleViewChange = (view: AdminView) => {
    setActiveView(view)
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <AdminDashboard />
      case 'manageOrders':
        return <AdminManageOrders />
      case 'manageProducts':
        return <AdminManageProducts />
      case 'addProduct':
        return <AdminAddProduct />
      case 'manageCategories':
        return <AdminManageCategories />
      default:
        return <AdminDashboard />
    }
  }

  const SidebarContent = () => (
    <>
      <div className="p-4 flex justify-between items-center lg:justify-center">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2">
          <X size={24} />
        </button>
      </div>
      <p className="text-sm text-center text-gray-400 mb-10">MercadoLocal</p>
      <nav className="flex flex-col space-y-2 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleViewChange(item.id as AdminView)}
              className={`flex items-center gap-3 p-3 rounded-lg text-left transition-colors duration-200 ${
                isActive ? 'bg-blue-600 shadow-md' : 'hover:bg-gray-700'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </>
  )

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white flex-col shadow-lg hidden lg:flex">
        <SidebarContent />
      </aside>

      <div
        className={`fixed inset-0 bg-gray-800 text-white z-50 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:hidden`}
      >
        <SidebarContent />
      </div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 mb-4 bg-white rounded-md shadow"
        >
          <Menu size={24} />
        </button>
        {renderContent()}
      </main>
    </div>
  )
}