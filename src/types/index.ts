
// Types pour l'application de point de vente restaurant

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
  notes?: string;
};

export type PaymentMethod = 'cash' | 'card' | 'other' | 'room_transfer' | 'free';

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: PaymentMethod;
  date: Date;
  tableNumber?: number;
  roomNumber?: string;
  completed: boolean;
};

export type DailySummary = {
  id: string;
  date: Date;
  totalRevenue: number;
  orderCount: number;
  isClosed: boolean;
};

export type SalesReport = {
  startDate: Date;
  endDate: Date;
  orders: Order[];
  totalRevenue: number;
  orderCount: number;
};

export type InvoiceStatus = 'draft' | 'completed';

export type Invoice = {
  id: string;
  number: string;
  items: CartItem[];
  status: InvoiceStatus;
  createdAt: Date;
  completedAt?: Date;
  total: number;
  paymentMethod?: PaymentMethod;
  tableNumber?: number;
  roomNumber?: string;
};

export type Transaction = {
  id: string;
  invoiceNumber: string;
  tableNumber?: number;
  roomNumber?: number;
  accountNumber?: string;
  server: string;
  operator: string;
  totalFood: number;
  totalDrinks: number;
  totalOther: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  date: Date;
};
