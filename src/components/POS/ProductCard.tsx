
import React from 'react';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-0">
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium">{product.name}</h3>
            <div className="text-lg font-semibold text-cafe-navy">
              {formatCurrency(product.price)}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1 flex-grow">
            {product.description}
          </p>
          <div className="mt-3">
            <Button 
              variant="outline" 
              className="w-full border-cafe-bordeaux text-cafe-bordeaux hover:bg-cafe-bordeaux hover:text-white"
              onClick={() => onAddToCart(product)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
