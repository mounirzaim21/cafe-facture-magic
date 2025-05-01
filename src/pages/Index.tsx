
import React, { useEffect, useState } from 'react';
import Header from '@/components/POS/Header';
import SalesArea from '@/components/POS/SalesArea';
import Cart from '@/components/POS/Cart';
import CheckoutModal from '@/components/POS/CheckoutModal';
import InvoiceModal from '@/components/POS/InvoiceModal';
import OpenInvoices from '@/components/POS/OpenInvoices';
import ManagerPasswordModal from '@/components/POS/ManagerPasswordModal';
import { useMenu } from '@/hooks/useMenu';
import { useInvoices } from '@/hooks/useInvoices';
import { PaymentMethod, CartItem } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const {
    availableCategories,
    selectedCategory,
    currentProducts,
    setSelectedCategory
  } = useMenu();

  const {
    invoices,
    setInvoices,
    activeInvoiceId,
    currentOrder,
    setActiveInvoiceId,
    setCurrentOrder,
    getCurrentInvoice,
    handleNewInvoice,
    handleAddToCart,
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

  // Ensure we restore the current invoice state from localStorage
  useEffect(() => {
    if (invoices.length > 0 && !activeInvoiceId) {
      const draftInvoices = invoices.filter(inv => inv.status === 'draft');
      if (draftInvoices.length > 0) {
        setActiveInvoiceId(draftInvoices[0].id);
      }
    }
  }, [invoices, activeInvoiceId, setActiveInvoiceId]);

  const handleCheckout = () => {
    setIsCheckoutModalOpen(true);
  };
  
  const handleUpdateQuantityWithCheck = (item: CartItem, newQuantity: number) => {
    const currentInvoice = getCurrentInvoice();
    
    if (currentInvoice?.isLocked) {
      // La facture est verrouillée, demander le mot de passe gérant
      setPendingAction({ type: 'update', item, quantity: newQuantity });
      setIsManagerModalOpen(true);
    } else {
      // La facture n'est pas verrouillée, mettre à jour directement
      handleUpdateQuantity(item, newQuantity);
    }
  };
  
  const handleRemoveItemWithCheck = (item: CartItem) => {
    const currentInvoice = getCurrentInvoice();
    
    if (currentInvoice?.isLocked) {
      // La facture est verrouillée, demander le mot de passe gérant
      setPendingAction({ type: 'remove', item });
      setIsManagerModalOpen(true);
    } else {
      // La facture n'est pas verrouillée, supprimer directement
      handleUpdateQuantity(item, 0);
    }
  };
  
  const handleClearCartWithCheck = () => {
    const currentInvoice = getCurrentInvoice();
    
    if (currentInvoice?.isLocked) {
      // La facture est verrouillée, demander le mot de passe gérant
      setPendingAction({ type: 'clear' });
      setIsManagerModalOpen(true);
    } else {
      // La facture n'est pas verrouillée, vider directement
      if (currentInvoice) {
        currentInvoice.items.forEach(item => handleUpdateQuantity(item, 0));
      }
    }
  };
  
  const handleManagerConfirm = () => {
    // Le mot de passe a été validé, exécuter l'action en attente
    if (pendingAction && activeInvoiceId) {
      // Déverrouiller la facture
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
      
      // Reverrouiller la facture
      setTimeout(() => {
        if (activeInvoiceId) {
          lockInvoice(activeInvoiceId);
        }
      }, 100);
    }
    
    // Réinitialiser
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
      if (currentInvoice) {
        setInvoices(prevInvoices =>
          prevInvoices.map(inv =>
            inv.id === currentInvoice.id
              ? {
                  ...inv,
                  paymentMethod,
                  tableNumber,
                  roomNumber
                }
              : inv
          )
        );
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

  const currentInvoice = getCurrentInvoice();

  return (
    <div className="min-h-screen bg-cafe-cream">
      <Header />

      <main className="container mx-auto py-6 px-4">
        <OpenInvoices
          invoices={invoices}
          activeInvoiceId={activeInvoiceId}
          onNewInvoice={handleNewInvoice}
          onSelectInvoice={setActiveInvoiceId}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          <SalesArea
            availableCategories={availableCategories}
            selectedCategory={selectedCategory}
            currentProducts={currentProducts}
            onSelectCategory={setSelectedCategory}
            onAddToCart={handleAddToCart}
          />
          
          <div className="lg:col-span-1">
            <Cart 
              items={currentInvoice?.items || []}
              onUpdateQuantity={handleUpdateQuantityWithCheck}
              onRemoveItem={handleRemoveItemWithCheck}
              onClearCart={handleClearCartWithCheck}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </main>

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
    </div>
  );
};

export default Index;
