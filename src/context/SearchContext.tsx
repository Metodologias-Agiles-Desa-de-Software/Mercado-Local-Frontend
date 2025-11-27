import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

export interface PriceRange {
    min: number;
    max: number;
}

interface SearchContextType {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedCategory: string | null;
    setSelectedCategory: (categoryId: string | null) => void;
    priceRange: PriceRange | null;
    setPriceRange: (range: PriceRange | null) => void;
    minRating: number;
    setMinRating: (rating: number) => void;
    sortBy: string;
    setSortBy: (sort: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState<PriceRange | null>(null);
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState('relevance');

    return (
        <SearchContext.Provider 
            value={{ 
                searchTerm, setSearchTerm, 
                selectedCategory, setSelectedCategory,
                priceRange, setPriceRange,
                minRating, setMinRating,
                sortBy, setSortBy
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearch debe ser usado dentro de un SearchProvider');
    }
    return context;
};