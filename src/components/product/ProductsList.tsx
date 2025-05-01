
import React, { useEffect, useState } from 'react';
import { Product } from '@/types';
import { Badge } from '@/components/ui/badge';

interface ProductsListProps {
  products: Product[];
}

const ProductsList: React.FC<ProductsListProps> = ({ products }) => {
  const [projectName, setProjectName] = useState('Moni_Point de Vente');
  
  // Charger le nom du projet depuis localStorage
  useEffect(() => {
    const savedProjectName = localStorage.getItem('projectName');
    if (savedProjectName) {
      setProjectName(savedProjectName);
    }
    
    // Écouter les changements de paramètres
    const handleSettingsUpdate = () => {
      const updatedName = localStorage.getItem('projectName');
      if (updatedName) {
        setProjectName(updatedName);
      }
    };
    
    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
    };
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Produits ({products.length})</h2>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {products.map((product) => (
          <div key={product.id} className="p-3 border rounded-md hover:bg-gray-50">
            <div className="flex justify-between">
              <span className="font-medium">{product.name}</span>
              <span className="font-medium text-cafe-navy">{product.price.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <div className="text-sm text-gray-600">{product.description}</div>
              <Badge variant="outline" className="bg-gray-100">
                {product.category}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
