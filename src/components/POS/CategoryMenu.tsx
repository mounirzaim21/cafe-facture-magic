
import React from 'react';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Utensils, Coffee, Wine, Beer, Pizza, Salad } from 'lucide-react';

interface CategoryMenuProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'utensils':
        return <Utensils className="h-4 w-4 mr-2" />;
      case 'coffee':
        return <Coffee className="h-4 w-4 mr-2" />;
      case 'wine':
        return <Wine className="h-4 w-4 mr-2" />;
      case 'beer':
        return <Beer className="h-4 w-4 mr-2" />;
      case 'pizza':
        return <Pizza className="h-4 w-4 mr-2" />;
      case 'salad':
        return <Salad className="h-4 w-4 mr-2" />;
      default:
        return <Utensils className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          className={cn(
            "border-cafe-navy",
            selectedCategory === category.id
              ? "bg-cafe-navy text-white"
              : "text-cafe-navy hover:bg-cafe-navy/10"
          )}
          onClick={() => onSelectCategory(category.id)}
        >
          {getIcon(category.icon)}
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default CategoryMenu;
