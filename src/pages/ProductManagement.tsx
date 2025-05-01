
import React, { useState } from 'react';
import { Product, Category } from '@/types';
import { categories, products } from '@/data/menu';
import AddProductForm from '@/components/product/AddProductForm';
import AddCategoryForm from '@/components/product/AddCategoryForm';
import ProductsList from '@/components/product/ProductsList';
import CategoriesList from '@/components/product/CategoriesList';

const ProductManagement = () => {
  const [allProducts, setAllProducts] = useState<Product[]>(products);
  const [allCategories, setAllCategories] = useState<Category[]>(categories);

  const handleProductAdded = (updatedProducts: Product[]) => {
    setAllProducts([...updatedProducts]);
  };

  const handleCategoryAdded = (updatedCategories: Category[]) => {
    setAllCategories([...updatedCategories]);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Gestion des Produits et Catégories</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AddProductForm 
          allCategories={allCategories} 
          onProductAdded={handleProductAdded} 
        />
        <AddCategoryForm 
          onCategoryAdded={handleCategoryAdded} 
        />
      </div>

      {/* Display products and categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <ProductsList products={allProducts} />
        <CategoriesList categories={allCategories} />
      </div>
    </div>
  );
};

export default ProductManagement;
