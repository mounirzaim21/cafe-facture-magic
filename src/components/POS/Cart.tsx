
import React from 'react';
import { CartItem as CartItemType } from '@/types';
import CartItem from './CartItem';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { Receipt, Trash2 } from 'lucide-react';

interface CartProps {
  items: CartItemType[];
  onUpdateQuantity: (item: CartItemType, newQuantity: number) => void;
  onRemoveItem: (item: CartItemType) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}) => {
  const calculateTotal = (): number => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  return (
    <div className="bg-white border rounded-lg p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Panier</h2>
        {items.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearCart} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-1" />
            Vider
          </Button>
        )}
      </div>

      <div className="flex-grow overflow-y-auto">
        {items.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            Le panier est vide
          </div>
        ) : (
          items.map((item) => (
            <CartItem
              key={item.product.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
            />
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between font-semibold mb-4">
            <span>Total</span>
            <span>{formatCurrency(calculateTotal())}</span>
          </div>
          <Button 
            className="w-full bg-cafe-bordeaux hover:bg-cafe-bordeaux/90" 
            onClick={onCheckout}
          >
            <Receipt className="mr-2 h-4 w-4" />
            Finaliser la commande
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
