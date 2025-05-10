
import { Invoice, CartItem, PaymentMethod, Order } from '@/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique invoice number based on date and count
 */
export const generateInvoiceNumber = (count: number): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const baseNumber = (count + 1).toString().padStart(4, '0');
  return `FAC${year}${month}-${baseNumber}`;
};

/**
 * Creates a new invoice object
 */
export const createNewInvoice = (invoicesCount: number): Invoice => {
  return {
    id: uuidv4(),
    number: generateInvoiceNumber(invoicesCount),
    items: [],
    status: 'draft',
    createdAt: new Date(),
    total: 0,
    isLocked: false
  };
};

/**
 * Calculates the total amount for an invoice based on items
 */
export const calculateInvoiceTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
};

/**
 * Creates an Order object from an Invoice
 */
export const createOrderFromInvoice = (
  invoice: Invoice,
  paymentMethod: PaymentMethod,
  tableNumber?: number,
  roomNumber?: string
): Order => {
  // Calculate total according to payment method
  let totalAmount = invoice.total;
  if (paymentMethod === 'free') {
    totalAmount = 0; // Total à 0 pour les gratuités
  }
  
  return {
    id: invoice.number,
    items: [...invoice.items],
    total: totalAmount,
    paymentMethod,
    date: new Date(),
    tableNumber,
    roomNumber,
    completed: true,
  };
};
