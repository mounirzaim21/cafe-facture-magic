
import React from 'react';
import { Product, Category } from '@/types';
import CategoryMenu from './CategoryMenu';
import ProductCard from './ProductCard';
import NoProducts from './NoProducts';

interface SalesAreaProps {
  availableCategories: Category[];
  selectedCategory: string;
  currentProducts: Product[];
  onSelectCategory: (categoryId: string) => void;
  onAddToCart: (product: Product) => void;
}

const SalesArea: React.FC<SalesAreaProps> = ({
  availableCategories,
  selectedCategory,
  currentProducts,
  onSelectCategory,
  onAddToCart
}) => {
  return (
    <div className="lg:col-span-3">
      <CategoryMenu 
        categories={availableCategories} 
        selectedCategory={selectedCategory} 
        onSelectCategory={onSelectCategory} 
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart} 
            />
          ))
        ) : (
          <NoProducts categoryName={availableCategories.find(cat => cat.id === selectedCategory)?.name || ''} />
        )}
      </div>
    </div>
  );
};

export default SalesArea;
