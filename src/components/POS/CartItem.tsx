
import React, { useState } from 'react';
import { CartItem as CartItemType } from '@/types';
import { Button } from '@/components/ui/button';
import { Trash2, MinusCircle, PlusCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import ManagerPasswordModal from './ManagerPasswordModal';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (item: CartItemType, newQuantity: number) => void;
  onRemoveItem: (item: CartItemType) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const [isManagerModalOpen, setIsManagerModalOpen] = useState<boolean>(false);
  const [pendingQuantity, setPendingQuantity] = useState<number | null>(null);

  const handleDecrementClick = () => {
    // On demande le mot de passe pour diminuer la quantité
    setPendingQuantity(Math.max(1, item.quantity - 1));
    setIsManagerModalOpen(true);
  };

  const handleManagerConfirm = () => {
    if (pendingQuantity !== null) {
      onUpdateQuantity(item, pendingQuantity);
    }
    setIsManagerModalOpen(false);
    setPendingQuantity(null);
  };

  return (
    <>
      <div className="flex items-center justify-between py-2 border-b border-slate-100">
        <div className="flex-1">
          <div className="flex justify-between">
            <span className="font-medium">{item.product.name}</span>
            <span className="font-semibold">{formatCurrency(item.product.price * item.quantity)}</span>
          </div>
          <div className="flex items-center mt-1">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                className="px-2 h-8"
                onClick={handleDecrementClick} // Mot de passe pour diminuer
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              <span className="px-2">{item.quantity}</span>
              <Button
                variant="ghost"
                size="sm"
                className="px-2 h-8"
                onClick={() => onUpdateQuantity(item, item.quantity + 1)} // Pas de mot de passe pour augmenter
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 text-destructive hover:text-destructive"
              onClick={() => onRemoveItem(item)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          {item.notes && <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>}
        </div>
      </div>

      {isManagerModalOpen && (
        <ManagerPasswordModal
          isOpen={isManagerModalOpen}
          onClose={() => {
            setIsManagerModalOpen(false);
            setPendingQuantity(null);
          }}
          onConfirm={handleManagerConfirm}
        />
      )}
    </>
  );
};

export default CartItem;
