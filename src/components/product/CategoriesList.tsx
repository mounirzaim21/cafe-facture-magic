
import React from 'react';
import { Category } from '@/types';

interface CategoriesListProps {
  categories: Category[];
}

const CategoriesList: React.FC<CategoriesListProps> = ({ categories }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Catégories ({categories.length})</h2>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {categories.map((category) => (
          <div key={category.id} className="p-3 border rounded-md flex items-center gap-2">
            <span>{category.icon}</span>
            <span className="font-medium">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesList;
