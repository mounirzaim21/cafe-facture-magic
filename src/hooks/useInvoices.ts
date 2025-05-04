
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Invoice, CartItem, PaymentMethod, Order, Product } from '@/types';
import { addOrder } from '@/services/reportService';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activeInvoiceId, setActiveInvoiceId] = useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
  // Load invoices from localStorage on initial render
  useEffect(() => {
    const savedInvoices = localStorage.getItem('draftInvoices');
    const savedActiveInvoiceId = localStorage.getItem('activeInvoiceId');
    
    if (savedInvoices) {
      try {
        const parsedInvoices = JSON.parse(savedInvoices);
        setInvoices(parsedInvoices);
        
        // Convert date strings back to Date objects
        parsedInvoices.forEach((invoice: Invoice) => {
          invoice.createdAt = new Date(invoice.createdAt);
          if (invoice.completedAt) {
            invoice.completedAt = new Date(invoice.completedAt);
          }
        });
        
        console.log('Loaded saved invoices:', parsedInvoices.length);
      } catch (error) {
        console.error('Error loading saved invoices:', error);
      }
    }
    
    if (savedActiveInvoiceId) {
      setActiveInvoiceId(savedActiveInvoiceId);
    }
  }, []);
  
  // Save invoices to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('draftInvoices', JSON.stringify(invoices));
    if (activeInvoiceId) {
      localStorage.setItem('activeInvoiceId', activeInvoiceId);
    }
  }, [invoices, activeInvoiceId]);

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const baseNumber = (invoices.length + 1).toString().padStart(4, '0');
    return `FAC${year}${month}-${baseNumber}`;
  };

  const getCurrentInvoice = (): Invoice | undefined => {
    return invoices.find(inv => inv.id === activeInvoiceId);
  };

  const handleNewInvoice = () => {
    const newInvoice: Invoice = {
      id: uuidv4(),
      number: generateInvoiceNumber(),
      items: [],
      status: 'draft',
      createdAt: new Date(),
      total: 0,
      isLocked: false // Par défaut, la facture est déverrouillée
    };
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
          // Vérifier si la facture est verrouillée
          if (invoice.isLocked) {
            console.log('La facture est verrouillée et ne peut pas être modifiée');
            return invoice;
          }
          
          const existingItem = invoice.items.find(item => item.product.id === product.id);
          const updatedItems = existingItem
            ? invoice.items.map(item =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            : [...invoice.items, { product, quantity: 1 }];
          
          return {
            ...invoice,
            items: updatedItems,
            total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
          };
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
          // Vérifier si la facture est verrouillée
          if (invoice.isLocked) {
            console.log('La facture est verrouillée et ne peut pas être modifiée');
            return invoice;
          }
          
          const updatedItems = newQuantity === 0
            ? invoice.items.filter(i => i.product.id !== item.product.id)
            : invoice.items.map(i =>
                i.product.id === item.product.id
                  ? { ...i, quantity: newQuantity }
                  : i
              );
          
          return {
            ...invoice,
            items: updatedItems,
            total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
          };
        }
        return invoice;
      });
    });
  };

  const lockInvoice = (invoiceId: string) => {
    setInvoices(prevInvoices => 
      prevInvoices.map(inv => 
        inv.id === invoiceId ? { ...inv, isLocked: true } : inv
      )
    );
  };

  const unlockInvoice = (invoiceId: string) => {
    setInvoices(prevInvoices => 
      prevInvoices.map(inv => 
        inv.id === invoiceId ? { ...inv, isLocked: false } : inv
      )
    );
  };

  const handleCompleteOrder = (paymentMethod: PaymentMethod, tableNumber?: number, roomNumber?: string) => {
    if (!activeInvoiceId) return;

    const invoice = getCurrentInvoice();
    if (!invoice) return;

    const newOrder: Order = {
      id: invoice.number,
      items: [...invoice.items],
      total: invoice.total,
      paymentMethod,
      date: new Date(),
      tableNumber,
      roomNumber: roomNumber,
      completed: true,
    };

    // Add the order to our central store (now also adds to history)
    const addedOrder = addOrder(newOrder);
    console.log("Order added successfully:", addedOrder);

    // Trigger a custom event to notify components to refresh their data
    const refreshEvent = new CustomEvent('orderCompleted', { detail: addedOrder });
    window.dispatchEvent(refreshEvent);

    setInvoices(prevInvoices =>
      prevInvoices.map(inv =>
        inv.id === activeInvoiceId
          ? {
              ...inv,
              status: 'completed',
              completedAt: new Date(),
              paymentMethod,
              tableNumber,
              roomNumber,
              isLocked: true // Verrouiller la facture une fois complétée
            }
          : inv
      )
    );

    setCurrentOrder(newOrder);
  };

  const areAllInvoicesCompleted = (): boolean => {
    // Vérifier si toutes les factures sont complétées
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
