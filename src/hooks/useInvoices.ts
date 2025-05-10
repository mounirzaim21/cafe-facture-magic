
import { useState, useEffect } from 'react';
import { Invoice, CartItem, PaymentMethod, Order, Product } from '@/types';
import { addOrder } from '@/services/reportService';
import { addOrderToHistory } from '@/services/historyService';
import { createNewInvoice, createOrderFromInvoice } from '@/utils/invoiceUtils';
import { loadInvoicesFromStorage, saveInvoicesToStorage } from '@/services/invoiceStorageService';
import { addProductToInvoice, updateItemQuantity, completeInvoice, toggleInvoiceLock } from '@/services/invoiceOperations';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activeInvoiceId, setActiveInvoiceId] = useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
  // Load invoices from localStorage on initial render
  useEffect(() => {
    const { invoices: loadedInvoices, activeInvoiceId: loadedActiveId } = loadInvoicesFromStorage();
    setInvoices(loadedInvoices);
    
    if (loadedActiveId) {
      setActiveInvoiceId(loadedActiveId);
    }
  }, []);
  
  // Save invoices to localStorage whenever they change
  useEffect(() => {
    saveInvoicesToStorage(invoices, activeInvoiceId);
  }, [invoices, activeInvoiceId]);

  const getCurrentInvoice = (): Invoice | undefined => {
    return invoices.find(inv => inv.id === activeInvoiceId);
  };

  const handleNewInvoice = () => {
    const newInvoice = createNewInvoice(invoices.length);
    setInvoices([...invoices, newInvoice]);
    setActiveInvoiceId(newInvoice.id);
  };

  const handleAddToCart = (product: Product) => {
    if (!activeInvoiceId) {
      handleNewInvoice();
      return;
    }

    setInvoices(prevInvoices => {
      return prevInvoices.map(invoice => {
        if (invoice.id === activeInvoiceId) {
          return addProductToInvoice(invoice, product);
        }
        return invoice;
      });
    });
  };

  const handleUpdateQuantity = (item: CartItem, newQuantity: number) => {
    if (!activeInvoiceId) return;

    setInvoices(prevInvoices => {
      return prevInvoices.map(invoice => {
        if (invoice.id === activeInvoiceId) {
          return updateItemQuantity(invoice, item, newQuantity);
        }
        return invoice;
      });
    });
  };

  const lockInvoice = (invoiceId: string) => {
    setInvoices(prevInvoices => 
      prevInvoices.map(inv => 
        inv.id === invoiceId ? toggleInvoiceLock(inv, true) : inv
      )
    );
  };

  const unlockInvoice = (invoiceId: string) => {
    setInvoices(prevInvoices => 
      prevInvoices.map(inv => 
        inv.id === invoiceId ? toggleInvoiceLock(inv, false) : inv
      )
    );
  };

  const handleCompleteOrder = (paymentMethod: PaymentMethod, tableNumber?: number, roomNumber?: string) => {
    if (!activeInvoiceId) return;

    const invoice = getCurrentInvoice();
    if (!invoice) return;

    // Create order object from invoice
    const newOrder = createOrderFromInvoice(invoice, paymentMethod, tableNumber, roomNumber);

    // Add the order to our central store and history
    const addedOrder = addOrder(newOrder);
    addOrderToHistory(newOrder);
    
    console.log("Order added successfully:", addedOrder);

    // Trigger a custom event to notify components to refresh their data
    const refreshEvent = new CustomEvent('orderCompleted', { detail: addedOrder });
    window.dispatchEvent(refreshEvent);

    // Update invoice status to completed
    setInvoices(prevInvoices =>
      prevInvoices.map(inv =>
        inv.id === activeInvoiceId
          ? completeInvoice(inv, paymentMethod, tableNumber, roomNumber)
          : inv
      )
    );

    setCurrentOrder(newOrder);
  };

  const areAllInvoicesCompleted = (): boolean => {
    // Check if all invoices are completed
    return invoices.every(invoice => invoice.status === 'completed');
  };

  return {
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
    unlockInvoice,
    areAllInvoicesCompleted
  };
};
