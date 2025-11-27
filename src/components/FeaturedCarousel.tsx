import React, { useState, useEffect } from 'react';
import { getFeaturedProducts } from '../services/api';
import { ProductCard } from './ProductCard';
import type { Product } from '../context/CartContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export const FeaturedCarousel: React.FC = () => {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await getFeaturedProducts();
                setFeaturedProducts(res.data);
            } catch (error) {
                console.error("Failed to fetch featured products", error);
            }
        };
        fetchFeatured();
    }, []);

    if (featuredProducts.length === 0) {
        return null;
    }

    return (
        <section className="mb-12 container mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Star className="text-yellow-500" />
                Productos Destacados
            </h2>
            <div className="relative">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={30}
                    slidesPerView={1.5}
                    navigation={{
                        nextEl: '.swiper-button-next-custom',
                        prevEl: '.swiper-button-prev-custom',
                    }}
                    breakpoints={{
                        640: { slidesPerView: 2.5 },
                        768: { slidesPerView: 3.5 },
                        1024: { slidesPerView: 4.5 },
                    }}
                    className="!pb-4"
                >
                    {featuredProducts.map(product => (
                        <SwiperSlide key={product._id}>
                            <ProductCard product={product} />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="swiper-button-prev-custom absolute top-1/2 -translate-y-1/2 left-0 z-10 p-2 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-100">
                    <ChevronLeft className="text-gray-700" />
                </div>
                <div className="swiper-button-next-custom absolute top-1/2 -translate-y-1/2 right-0 z-10 p-2 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-100">
                    <ChevronRight className="text-gray-700" />
                </div>
            </div>
        </section>
    );
};