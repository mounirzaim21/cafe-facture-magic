
import React, { useEffect } from 'react';
import Header from '@/components/POS/Header';
import SalesArea from '@/components/POS/SalesArea';
import Cart from '@/components/POS/Cart';
import CheckoutModal from '@/components/POS/CheckoutModal';
import InvoiceModal from '@/components/POS/InvoiceModal';
import OpenInvoices from '@/components/POS/OpenInvoices';
import { useMenu } from '@/hooks/useMenu';
import { useInvoices } from '@/hooks/useInvoices';
import { PaymentMethod } from '@/types';
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
    handleCompleteOrder
  } = useInvoices();

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = React.useState<boolean>(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = React.useState<boolean>(false);
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
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={(item) => handleUpdateQuantity(item, 0)}
              onClearCart={() => {
                if (currentInvoice) {
                  currentInvoice.items.forEach(item => handleUpdateQuantity(item, 0));
                }
              }}
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
    </div>
  );
};

export default Index;
