
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Invoice, CartItem, Product, PaymentMethod, InvoiceStatus, Order } from '@/types';
import { getSavedInvoices, saveInvoices, loadInvoicesFromStorage, saveInvoicesToStorage } from '@/services/invoiceStorageService';
import { saveSalesHistory } from '@/services/historyService';
import { calculateInvoiceTotal } from '@/utils/invoiceUtils';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activeInvoiceId, setActiveInvoiceId] = useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Invoice | null>(null);

  // Load invoices from localStorage on component mount
  useEffect(() => {
    const { invoices: savedInvoices, activeInvoiceId: savedActiveInvoiceId } = loadInvoicesFromStorage();
    
    if (savedInvoices.length > 0) {
      setInvoices(savedInvoices);
      if (savedActiveInvoiceId) {
        setActiveInvoiceId(savedActiveInvoiceId);
      }
      console.info(`Loaded ${savedInvoices.length} saved invoices`);
    } else {
      handleNewInvoice(); // Create a new invoice if none exist
    }
  }, []);

  // Save invoices to localStorage whenever they change
  useEffect(() => {
    if (invoices.length > 0) {
      saveInvoicesToStorage(invoices, activeInvoiceId);
    }
  }, [invoices, activeInvoiceId]);

  const handleNewInvoice = () => {
    // Find the max invoice number and increment it
    const maxInvoiceNumber = Math.max(0, ...invoices.map(inv => Number(inv.number) || 0));
    const newInvoiceNumber = maxInvoiceNumber + 1;
    
    const newInvoice: Invoice = {
      id: uuidv4(),
      number: String(newInvoiceNumber), // Convert to string to match Invoice type
      items: [],
      status: 'draft',
      isLocked: false,
      createdAt: new Date(),
      total: 0
    };
    
    setInvoices(prevInvoices => [...prevInvoices, newInvoice]);
    setActiveInvoiceId(newInvoice.id);
  };

  const getCurrentInvoice = (): Invoice | undefined => {
    return invoices.find(invoice => invoice.id === activeInvoiceId);
  };

  const handleAddToCart = (product: Product) => {
    setInvoices(prevInvoices => {
      return prevInvoices.map(invoice => {
        if (invoice.id === activeInvoiceId) {
          if (invoice.isLocked) {
            return invoice; // Don't modify locked invoices
          }
          
          const existingItem = invoice.items.find(item => item.product.id === product.id);
          let updatedItems;
          
          if (existingItem) {
            updatedItems = invoice.items.map(item => 
              item.product.id === product.id 
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            updatedItems = [...invoice.items, { product, quantity: 1 }];
          }
          
          return {
            ...invoice,
            items: updatedItems,
            total: calculateInvoiceTotal(updatedItems)
          };
        }
        return invoice;
      });
    });
  };

  const handleUpdateQuantity = (item: CartItem, newQuantity: number) => {
    setInvoices(prevInvoices => {
      return prevInvoices.map(invoice => {
        if (invoice.id === activeInvoiceId) {
          if (invoice.isLocked) {
            return invoice; // Don't modify locked invoices
          }
          
          let updatedItems;
          if (newQuantity <= 0) {
            // Remove item if quantity is 0 or less
            updatedItems = invoice.items.filter(i => i.product.id !== item.product.id);
          } else {
            // Update quantity if greater than 0
            updatedItems = invoice.items.map(i => 
              i.product.id === item.product.id 
                ? { ...i, quantity: newQuantity }
                : i
            );
          }
          
          return {
            ...invoice,
            items: updatedItems,
            total: calculateInvoiceTotal(updatedItems)
          };
        }
        return invoice;
      });
    });
  };

  const updateInvoiceDetails = (
    invoiceId: string,
    paymentMethod: PaymentMethod,
    tableNumber?: number,
    roomNumber?: string
  ) => {
    setInvoices(prevInvoices =>
      prevInvoices.map(inv =>
        inv.id === invoiceId
          ? {
              ...inv,
              paymentMethod,
              tableNumber,
              roomNumber
            }
          : inv
      )
    );
  };

  const handleCompleteOrder = (paymentMethod: PaymentMethod, tableNumber?: number, roomNumber?: string) => {
    const currentInvoice = getCurrentInvoice();
    
    if (currentInvoice) {
      // Calculate total based on payment method
      let totalAmount = calculateInvoiceTotal(currentInvoice.items);
      if (paymentMethod === 'free') {
        totalAmount = 0;
      }
      
      const completedInvoice: Invoice = {
        ...currentInvoice,
        status: 'completed',
        paymentMethod,
        tableNumber,
        roomNumber,
        completedAt: new Date(),
        total: totalAmount,
        isLocked: true
      };
      
      // Update the invoice in state
      setInvoices(prevInvoices => 
        prevInvoices.map(inv => 
          inv.id === currentInvoice.id ? completedInvoice : inv
        )
      );
      
      // Set the current order for display in the invoice modal
      setCurrentOrder(completedInvoice);
      
      // Convert Invoice to Order format for saveSalesHistory
      const orderForHistory: Order = {
        id: completedInvoice.id,
        items: completedInvoice.items,
        total: totalAmount,
        paymentMethod: paymentMethod,
        date: completedInvoice.createdAt,
        tableNumber: tableNumber,
        roomNumber: roomNumber,
        completed: true
      };
      
      // Save to history - passing it as an array as required by the function
      saveSalesHistory([orderForHistory]);
      
      // Create a new invoice for the next order
      handleNewInvoice();
    }
  };

  const lockInvoice = (invoiceId: string) => {
    setInvoices(prevInvoices =>
      prevInvoices.map(inv =>
        inv.id === invoiceId
          ? { ...inv, isLocked: true }
          : inv
      )
    );
  };

  const unlockInvoice = (invoiceId: string) => {
    setInvoices(prevInvoices =>
      prevInvoices.map(inv =>
        inv.id === invoiceId
          ? { ...inv, isLocked: false }
          : inv
      )
    );
  };

  return {
    invoices,
    setInvoices,
    activeInvoiceId,
    setActiveInvoiceId,
    currentOrder,
    setCurrentOrder,
    getCurrentInvoice,
    handleNewInvoice,
    handleAddToCart,
    handleUpdateQuantity,
    updateInvoiceDetails,
    handleCompleteOrder,
    lockInvoice,
    unlockInvoice,
  };
};
