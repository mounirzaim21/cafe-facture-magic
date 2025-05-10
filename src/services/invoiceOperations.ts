
import { Invoice, CartItem, Product, PaymentMethod, Order } from '@/types';
import { calculateInvoiceTotal } from '@/utils/invoiceUtils';

/**
 * Updates or adds a product to an invoice's items
 */
export const addProductToInvoice = (invoice: Invoice, product: Product): Invoice => {
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
    total: calculateInvoiceTotal(updatedItems)
  };
};

/**
 * Updates the quantity of an item in an invoice
 */
export const updateItemQuantity = (invoice: Invoice, item: CartItem, newQuantity: number): Invoice => {
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
    total: calculateInvoiceTotal(updatedItems)
  };
};

/**
 * Completes an invoice and converts it to an order
 */
export const completeInvoice = (
  invoice: Invoice,
  paymentMethod: PaymentMethod,
  tableNumber?: number,
  roomNumber?: string
): Invoice => {
  // Calculate total according to payment method
  let totalAmount = invoice.total;
  if (paymentMethod === 'free') {
    totalAmount = 0;
  }

  return {
    ...invoice,
    status: 'completed',
    completedAt: new Date(),
    paymentMethod,
    tableNumber,
    roomNumber,
    total: totalAmount,
    isLocked: true
  };
};

/**
 * Locks or unlocks an invoice
 */
export const toggleInvoiceLock = (invoice: Invoice, isLocked: boolean): Invoice => {
  return {
    ...invoice,
    isLocked
  };
};
