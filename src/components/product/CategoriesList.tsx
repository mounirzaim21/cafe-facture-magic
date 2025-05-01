
import React from 'react';
import { Category } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Utensils, Coffee, Wine, Beer, Pizza, Salad } from 'lucide-react';

interface CategoriesListProps {
  categories: Category[];
}

const CategoriesList: React.FC<CategoriesListProps> = ({ categories }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'utensils':
        return <Utensils className="h-4 w-4" />;
      case 'coffee':
        return <Coffee className="h-4 w-4" />;
      case 'wine':
        return <Wine className="h-4 w-4" />;
      case 'beer':
        return <Beer className="h-4 w-4" />;
      case 'pizza':
        return <Pizza className="h-4 w-4" />;
      case 'salad':
        return <Salad className="h-4 w-4" />;
      default:
        return <Utensils className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Catégories ({categories.length})</h2>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {categories.map((category) => (
          <div key={category.id} className="p-3 border rounded-md flex items-center gap-2 hover:bg-gray-50">
            <div className="bg-cafe-navy/10 p-2 rounded-full">
              {getIcon(category.icon)}
            </div>
            <span className="font-medium">{category.name}</span>
            <Badge variant="outline" className="ml-auto">
              ID: {category.id}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesList;
