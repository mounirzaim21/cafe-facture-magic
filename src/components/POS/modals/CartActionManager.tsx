
import React, { useState } from 'react';
import ManagerPasswordModal from '@/components/POS/ManagerPasswordModal';
import { CartItem } from '@/types';

interface CartActionManagerProps {
  onUpdateQuantity: (item: CartItem, newQuantity: number) => void;
  onUnlockInvoice: (invoiceId: string) => void;
  onLockInvoice: (invoiceId: string) => void;
  activeInvoiceId: string | null;
}

const CartActionManager: React.FC<CartActionManagerProps> = ({
  onUpdateQuantity,
  onUnlockInvoice,
  onLockInvoice,
  activeInvoiceId
}) => {
  const [isManagerModalOpen, setIsManagerModalOpen] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'update' | 'remove' | 'clear';
    item?: CartItem;
    quantity?: number;
  } | null>(null);

  const handleAuthenticatedAction = (
    actionType: 'update' | 'remove' | 'clear',
    item?: CartItem,
    quantity?: number
  ) => {
    setPendingAction({ type: actionType, item, quantity });
    setIsManagerModalOpen(true);
  };

  const handleManagerConfirm = () => {
    if (pendingAction && activeInvoiceId) {
      onUnlockInvoice(activeInvoiceId);
      
      switch (pendingAction.type) {
        case 'update':
          if (pendingAction.item && pendingAction.quantity !== undefined) {
            onUpdateQuantity(pendingAction.item, pendingAction.quantity);
          }
          break;
        case 'remove':
          if (pendingAction.item) {
            onUpdateQuantity(pendingAction.item, 0);
          }
          break;
        case 'clear':
          // The current invoice items will be handled by the parent component
          break;
      }
      
      setTimeout(() => {
        if (activeInvoiceId) {
          onLockInvoice(activeInvoiceId);
        }
      }, 100);
    }
    
    setPendingAction(null);
    setIsManagerModalOpen(false);
  };

  return (
    <>
      {isManagerModalOpen && (
        <ManagerPasswordModal
          isOpen={isManagerModalOpen}
          onClose={() => {
            setIsManagerModalOpen(false);
            setPendingAction(null);
          }}
          onConfirm={handleManagerConfirm}
        />
      )}
    </>
  );
};

export { CartActionManager, type CartActionManagerProps };
export default CartActionManager;
