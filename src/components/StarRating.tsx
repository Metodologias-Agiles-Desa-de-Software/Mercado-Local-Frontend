import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
    rating: number;
    totalStars?: number;
    size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, totalStars = 5, size = 20 }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => (
                <Star key={`full-${i}`} size={size} className="text-yellow-400" fill="currentColor" />
            ))}
            {halfStar && (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <Star size={size} className="text-gray-300" fill="currentColor" />
                    <div style={{ position: 'absolute', top: 0, left: 0, width: `${(rating % 1) * 100}%`, overflow: 'hidden' }}>
                        <Star size={size} className="text-yellow-400" fill="currentColor" />
                    </div>
                </div>
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <Star key={`empty-${i}`} size={size} className="text-gray-300" />
            ))}
        </div>
    );
};