
import { useState, useEffect } from 'react';
import { Category, Product } from '@/types';
import { categories, refreshData } from '@/data/menu';

export const useMenu = () => {
  const [availableCategories, setAvailableCategories] = useState<Category[]>(categories);
  const [selectedCategory, setSelectedCategory] = useState<string>(categories.length > 0 ? categories[0].id : '');
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);

  // Initial data load and category selection
  useEffect(() => {
    const data = refreshData();
    setAvailableCategories(data.categories);
    
    if (data.categories.length > 0) {
      if (!data.categories.find(cat => cat.id === selectedCategory)) {
        setSelectedCategory(data.categories[0].id);
      }
    }
  }, []);

  // Update products when category changes
  useEffect(() => {
    if (selectedCategory) {
      const data = refreshData();
      const productsForCategory = data.products.filter(product => product.category === selectedCategory);
      setCurrentProducts(productsForCategory);
    }
  }, [selectedCategory]);

  // Handle page visibility changes and product updates
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const data = refreshData();
        setAvailableCategories(data.categories);
        
        if (selectedCategory) {
          const productsForCategory = data.products.filter(product => product.category === selectedCategory);
          setCurrentProducts(productsForCategory);
        }
      }
    };

    const handleProductUpdate = () => {
      console.log("Product update event detected, refreshing menu data");
      const data = refreshData();
      setAvailableCategories(data.categories);
      
      if (selectedCategory) {
        const productsForCategory = data.products.filter(product => product.category === selectedCategory);
        setCurrentProducts(productsForCategory);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);
    window.addEventListener('productUpdated', handleProductUpdate);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      window.removeEventListener('productUpdated', handleProductUpdate);
    };
  }, [selectedCategory]);

  return {
    availableCategories,
    selectedCategory,
    currentProducts,
    setSelectedCategory
  };
};
