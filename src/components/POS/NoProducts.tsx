
import React from 'react';
import { Utensils } from 'lucide-react';

interface NoProductsProps {
  categoryName: string;
}

const NoProducts: React.FC<NoProductsProps> = ({ categoryName }) => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
      <Utensils size={48} className="text-cafe-bordeaux opacity-50 mb-4" />
      <h3 className="text-xl font-medium mb-1">Aucun produit disponible</h3>
      <p className="text-muted-foreground">
        Aucun produit n'est disponible dans la catégorie "{categoryName}"
      </p>
    </div>
  );
};

export default NoProducts;
