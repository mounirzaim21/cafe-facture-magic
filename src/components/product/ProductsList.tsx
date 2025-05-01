
import React from 'react';
import { Product } from '@/types';

interface ProductsListProps {
  products: Product[];
}

const ProductsList: React.FC<ProductsListProps> = ({ products }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Produits ({products.length})</h2>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {products.map((product) => (
          <div key={product.id} className="p-3 border rounded-md">
            <div className="flex justify-between">
              <span className="font-medium">{product.name}</span>
              <span>{product.price.toFixed(2)} €</span>
            </div>
            <div className="text-sm text-gray-600">{product.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
