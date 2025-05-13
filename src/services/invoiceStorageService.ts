
import { Invoice } from '@/types';

/**
 * Loads invoices from localStorage
 */
export const loadInvoicesFromStorage = (): { invoices: Invoice[], activeInvoiceId: string | null } => {
  const savedInvoices = localStorage.getItem('draftInvoices');
  const savedActiveInvoiceId = localStorage.getItem('activeInvoiceId');
  
  let parsedInvoices: Invoice[] = [];
  
  if (savedInvoices) {
    try {
      parsedInvoices = JSON.parse(savedInvoices);
      
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
  
  return {
    invoices: parsedInvoices,
    activeInvoiceId: savedActiveInvoiceId
  };
};

/**
 * Saves invoices to localStorage
 */
export const saveInvoicesToStorage = (invoices: Invoice[], activeInvoiceId: string | null): void => {
  localStorage.setItem('draftInvoices', JSON.stringify(invoices));
  if (activeInvoiceId) {
    localStorage.setItem('activeInvoiceId', activeInvoiceId);
  } else {
    localStorage.removeItem('activeInvoiceId');
  }
};

// Export aliases for functions used in useInvoices.ts
export const getSavedInvoices = (): Invoice[] => {
  return loadInvoicesFromStorage().invoices;
};

export const saveInvoices = (invoices: Invoice[]): void => {
  saveInvoicesToStorage(invoices, null);
};
