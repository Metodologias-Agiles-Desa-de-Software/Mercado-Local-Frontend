import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { Pagination } from '../components/Pagination';
import { FeaturedCarousel } from '../components/FeaturedCarousel';
import { useSearch } from '../context/SearchContext';
import type { Product } from '../context/CartContext';
import Swal from 'sweetalert2';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchTerm, selectedCategory, priceRange, minRating, sortBy } = useSearch();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const fetchProducts = () => {
      setLoading(true);
      const params = {
        page: currentPage,
        searchTerm: searchTerm || undefined,
        category: selectedCategory || undefined,
        priceMin: priceRange?.min,
        priceMax: priceRange?.max === Infinity ? undefined : priceRange?.max,
        minRating: minRating > 0 ? minRating : undefined,
        sortBy: sortBy,
        limit: 12
      };

      getProducts(params)
        .then(res => {
          setProducts(res.data.products);
          setTotalPages(res.data.totalPages);
        })
        .catch(() => {
          Swal.fire('Error', 'No se pudieron cargar los productos.', 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    };
    fetchProducts();
  }, [currentPage, searchTerm, selectedCategory, priceRange, minRating, sortBy]);

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, priceRange, minRating, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const isFiltering = searchTerm !== '' || selectedCategory !== null || priceRange !== null || minRating > 0;

  return (
    <div>
      {!isFiltering && (
        <>
          <header className="text-center my-10">
            <h1 className="text-5xl font-extrabold text-gray-900">Bienvenido a <span className="text-blue-600">MercadoLocal</span></h1>
            <p className="text-lg text-gray-600 mt-2">La frescura del barrio, directo a tu casa.</p>
          </header>
          <FeaturedCarousel />
        </>
      )}
      <div className="container mx-auto p-6">
        <main>
           <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{isFiltering ? 'Resultados de la Búsqueda' : 'Todo Nuestro Catálogo'}</h2>
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="bg-white rounded-xl shadow-lg animate-pulse">
                        <div className="h-52 w-full bg-gray-200 rounded-t-xl"></div>
                        <div className="p-5"><div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div><div className="h-4 bg-gray-200 rounded w-1/2"></div><div className="h-10 bg-gray-200 rounded w-1/3 mt-4"></div></div>
                      </div>
                    ))}
                </div>
            ) : (
                <>
                    {products.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product) => (<ProductCard key={product._id} product={product} />))}
                      </div>
                    ) : (
                      <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
                          <h3 className="text-xl font-semibold">No se encontraron productos</h3>
                          <p className="text-gray-500 mt-2">Intenta ajustar tus filtros o palabras clave.</p>
                      </div>
                    )}
                    {totalPages > 1 && (<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />)}
                </>
            )}
        </section>
        </main>
      </div>
    </div>
  );
};