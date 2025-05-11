
import React, { useState } from 'react';
import { useInvoices } from '@/hooks/useInvoices';
import Cart from '@/components/POS/Cart';
import CheckoutModal from '@/components/POS/CheckoutModal';
import InvoiceModal from '@/components/POS/InvoiceModal';
import ManagerPasswordModal from '@/components/POS/ManagerPasswordModal';
import { PaymentMethod, CartItem } from '@/types';
import { useToast } from '@/hooks/use-toast';

const CartContainer = () => {
  const {
    currentOrder,
    activeInvoiceId,
    setActiveInvoiceId,
    setCurrentOrder,
    getCurrentInvoice,
    handleUpdateQuantity,
    handleCompleteOrder,
    lockInvoice,
    unlockInvoice
  } = useInvoices();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'update' | 'remove' | 'clear';
    item?: CartItem;
    quantity?: number;
  } | null>(null);
  const { toast } = useToast();

  const handleCheckout = () => {
    setIsCheckoutModalOpen(true);
  };
  
  const handleUpdateQuantityWithCheck = (item: CartItem, newQuantity: number) => {
    const currentInvoice = getCurrentInvoice();
    
    if (currentInvoice?.isLocked) {
      setPendingAction({ type: 'update', item, quantity: newQuantity });
      setIsManagerModalOpen(true);
    } else {
      handleUpdateQuantity(item, newQuantity);
    }
  };
  
  const handleRemoveItemWithCheck = (item: CartItem) => {
    const currentInvoice = getCurrentInvoice();
    
    if (currentInvoice?.isLocked) {
      setPendingAction({ type: 'remove', item });
      setIsManagerModalOpen(true);
    } else {
      handleUpdateQuantity(item, 0);
    }
  };
  
  const handleClearCartWithCheck = () => {
    const currentInvoice = getCurrentInvoice();
    
    if (currentInvoice?.isLocked) {
      setPendingAction({ type: 'clear' });
      setIsManagerModalOpen(true);
    } else {
      if (currentInvoice) {
        currentInvoice.items.forEach(item => handleUpdateQuantity(item, 0));
      }
    }
  };
  
  const handleManagerConfirm = () => {
    if (pendingAction && activeInvoiceId) {
      unlockInvoice(activeInvoiceId);
      
      switch (pendingAction.type) {
        case 'update':
          if (pendingAction.item && pendingAction.quantity !== undefined) {
            handleUpdateQuantity(pendingAction.item, pendingAction.quantity);
          }
          break;
        case 'remove':
          if (pendingAction.item) {
            handleUpdateQuantity(pendingAction.item, 0);
          }
          break;
        case 'clear':
          const currentInvoice = getCurrentInvoice();
          if (currentInvoice) {
            currentInvoice.items.forEach(item => handleUpdateQuantity(item, 0));
          }
          break;
      }
      
      setTimeout(() => {
        if (activeInvoiceId) {
          lockInvoice(activeInvoiceId);
        }
      }, 100);
    }
    
    setPendingAction(null);
    setIsManagerModalOpen(false);
  };

  const handleCompleteCheckout = (paymentMethod: PaymentMethod, tableNumber?: number, roomNumber?: string, shouldComplete?: boolean) => {
    if (shouldComplete) {
      handleCompleteOrder(paymentMethod, tableNumber, roomNumber);
      setIsCheckoutModalOpen(false);
      setIsInvoiceModalOpen(true);
      
      toast({
        title: "Commande validée",
        description: "La commande a été validée et ajoutée au rapport des ventes.",
      });
    } else {
      const currentInvoice = getCurrentInvoice();
      if (currentInvoice) {
        // This part uses the setInvoices function which we need to import
        // We'll handle this by modifying the useInvoices hook to expose what we need
        handleUpdateInvoiceDetails(currentInvoice.id, paymentMethod, tableNumber, roomNumber);
        setIsCheckoutModalOpen(false);
        
        toast({
          title: "Commande enregistrée",
          description: "La commande a été enregistrée et reste en attente de validation.",
        });
      }
    }
  };

  const handleUpdateInvoiceDetails = (
    invoiceId: string,
    paymentMethod: PaymentMethod,
    tableNumber?: number,
    roomNumber?: string
  ) => {
    // Get the current invoice and update its details
    const currentInvoice = getCurrentInvoice();
    if (currentInvoice && currentInvoice.id === invoiceId) {
      // This would be implemented in useInvoices to update specific invoice details
      updateInvoiceDetails(invoiceId, paymentMethod, tableNumber, roomNumber);
    }
  };

  const updateInvoiceDetails = (
    invoiceId: string,
    paymentMethod: PaymentMethod,
    tableNumber?: number,
    roomNumber?: string
  ) => {
    // This is a placeholder for the function that would be exposed by useInvoices
    // In this refactoring, we'll add this function to the useInvoices hook
  };

  const handleInvoiceClose = () => {
    setIsInvoiceModalOpen(false);
    setCurrentOrder(null);
    setActiveInvoiceId(null);
  };

  const currentInvoice = getCurrentInvoice();

  return (
    <>
      <Cart 
        items={currentInvoice?.items || []}
        onUpdateQuantity={handleUpdateQuantityWithCheck}
        onRemoveItem={handleRemoveItemWithCheck}
        onClearCart={handleClearCartWithCheck}
        onCheckout={handleCheckout}
      />

      {isCheckoutModalOpen && currentInvoice && (
        <CheckoutModal 
          isOpen={isCheckoutModalOpen} 
          onClose={() => setIsCheckoutModalOpen(false)} 
          onCompleteOrder={handleCompleteCheckout}
          items={currentInvoice.items}
        />
      )}

      {isInvoiceModalOpen && currentOrder && (
        <InvoiceModal 
          isOpen={isInvoiceModalOpen}
          onClose={handleInvoiceClose}
          items={currentOrder.items}
          paymentMethod={currentOrder.paymentMethod}
          date={currentOrder.date}
          orderId={currentOrder.id}
          tableNumber={currentOrder.tableNumber}
          roomNumber={currentOrder.roomNumber}
        />
      )}

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

export default CartContainer;
