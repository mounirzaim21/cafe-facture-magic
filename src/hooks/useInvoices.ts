import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Invoice, CartItem, Product, PaymentMethod, InvoiceStatus, Order } from '@/types';
import { getSavedInvoices, saveInvoices } from '@/services/invoiceStorageService';
import { saveSalesHistory } from '@/services/historyService';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activeInvoiceId, setActiveInvoiceId] = useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Invoice | null>(null);

  // Load invoices from localStorage on component mount
  useEffect(() => {
    const savedInvoices = getSavedInvoices();
    if (savedInvoices.length > 0) {
      setInvoices(savedInvoices);
      console.info(`Loaded saved invoices: ${savedInvoices.length}`);
    } else {
      handleNewInvoice(); // Create a new invoice if none exist
    }
  }, []);

  // Save invoices to localStorage whenever they change
  useEffect(() => {
    if (invoices.length > 0) {
      saveInvoices(invoices);
    }
  }, [invoices]);

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
          const existingItem = invoice.items.find(item => item.product.id === product.id);
          
          if (existingItem) {
            return {
              ...invoice,
              items: invoice.items.map(item => 
                item.product.id === product.id 
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return {
              ...invoice,
              items: [...invoice.items, { product, quantity: 1 }],
            };
          }
        }
        return invoice;
      });
    });
  };

  const handleUpdateQuantity = (item: CartItem, newQuantity: number) => {
    setInvoices(prevInvoices => {
      return prevInvoices.map(invoice => {
        if (invoice.id === activeInvoiceId) {
          if (newQuantity <= 0) {
            // Remove item if quantity is 0 or less
            return {
              ...invoice,
              items: invoice.items.filter(i => i.product.id !== item.product.id),
            };
          } else {
            // Update quantity if greater than 0
            return {
              ...invoice,
              items: invoice.items.map(i => 
                i.product.id === item.product.id 
                  ? { ...i, quantity: newQuantity }
                  : i
              ),
            };
          }
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
      const completedInvoice: Invoice = {
        ...currentInvoice,
        status: 'completed',
        paymentMethod,
        tableNumber,
        roomNumber,
        completedAt: new Date(),
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
        total: completedInvoice.total,
        paymentMethod: completedInvoice.paymentMethod || 'cash',
        date: completedInvoice.createdAt,
        tableNumber: completedInvoice.tableNumber,
        roomNumber: completedInvoice.roomNumber,
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
