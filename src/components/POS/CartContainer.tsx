import React, { useState } from 'react';
import { useInvoices } from '@/hooks/useInvoices';
import Cart from '@/components/POS/Cart';
import { PaymentMethod, CartItem } from '@/types';
import { useToast } from '@/hooks/use-toast';
import CartActionManager from './modals/CartActionManager';
import CheckoutModalWrapper from './modals/CheckoutModalWrapper';
import InvoiceDisplayModal from './modals/InvoiceDisplayModal';

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
    unlockInvoice,
    updateInvoiceDetails
  } = useInvoices();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const currentInvoice = getCurrentInvoice();

  const handleCheckout = () => {
    setIsCheckoutModalOpen(true);
  };
  
  const handleUpdateQuantityWithCheck = (item: CartItem, newQuantity: number) => {
    const currentInvoice = getCurrentInvoice();
    
    if (currentInvoice?.isLocked) {
      // Use the CartActionManager for this
      return;
    } else {
      handleUpdateQuantity(item, newQuantity);
    }
  };
  
  const handleRemoveItemWithCheck = (item: CartItem) => {
    const currentInvoice = getCurrentInvoice();
    
    if (currentInvoice?.isLocked) {
      // Use the CartActionManager for this
      return;
    } else {
      handleUpdateQuantity(item, 0);
    }
  };
  
  const handleClearCartWithCheck = () => {
    const currentInvoice = getCurrentInvoice();
    
    if (currentInvoice?.isLocked) {
      // Use the CartActionManager for this
      return;
    } else {
      if (currentInvoice) {
        currentInvoice.items.forEach(item => handleUpdateQuantity(item, 0));
      }
    }
  };

  const handleCompleteCheckout = (
    paymentMethod: PaymentMethod, 
    tableNumber?: number, 
    roomNumber?: string, 
    shouldComplete?: boolean
  ) => {
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
        updateInvoiceDetails(currentInvoice.id, paymentMethod, tableNumber, roomNumber);
        setIsCheckoutModalOpen(false);
        
        toast({
          title: "Commande enregistrée",
          description: "La commande a été enregistrée et reste en attente de validation.",
        });
      }
    }
  };

  const handleInvoiceClose = () => {
    setIsInvoiceModalOpen(false);
    setCurrentOrder(null);
    setActiveInvoiceId(null);
  };

  return (
    <>
      <Cart 
        items={currentInvoice?.items || []}
        onUpdateQuantity={handleUpdateQuantityWithCheck}
        onRemoveItem={handleRemoveItemWithCheck}
        onClearCart={handleClearCartWithCheck}
        onCheckout={handleCheckout}
      />

      <CartActionManager
        onUpdateQuantity={handleUpdateQuantity}
        onUnlockInvoice={unlockInvoice}
        onLockInvoice={lockInvoice}
        activeInvoiceId={activeInvoiceId}
      />

      <CheckoutModalWrapper
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        currentInvoice={currentInvoice}
        onCompleteCheckout={handleCompleteCheckout}
      />

      <InvoiceDisplayModal
        isOpen={isInvoiceModalOpen}
        onClose={handleInvoiceClose}
        currentOrder={currentOrder}
      />
    </>
  );
};

export default CartContainer;
