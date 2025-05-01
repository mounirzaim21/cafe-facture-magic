
import { DailySummary, Order, PaymentMethod, CartItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage for orders (in a real app, this would be in a database)
let ordersStore: Order[] = [];
let archivedOrders: Order[] = []; // Nouvel historique des commandes archivées

// Load any previously saved orders from localStorage
const initOrderStore = () => {
  try {
    const savedOrders = localStorage.getItem('ordersStore');
    const savedArchive = localStorage.getItem('archivedOrders');
    
    if (savedOrders) {
      ordersStore = JSON.parse(savedOrders);
      console.log("Loaded saved orders:", ordersStore.length);
    }
    
    if (savedArchive) {
      archivedOrders = JSON.parse(savedArchive);
      console.log("Loaded archived orders:", archivedOrders.length);
    }
  } catch (error) {
    console.error("Error loading saved orders:", error);
  }
};

// Initialize on module load
initOrderStore();

// Function to add a new order to the store
export const addOrder = (order: Order) => {
  // Ensure we don't duplicate orders with the same ID
  const existingOrderIndex = ordersStore.findIndex(o => o.id === order.id);
  if (existingOrderIndex >= 0) {
    // Replace existing order
    ordersStore[existingOrderIndex] = order;
  } else {
    // Add new order
    ordersStore.push(order);
  }
  
  // Save to localStorage for persistence
  localStorage.setItem('ordersStore', JSON.stringify(ordersStore));
  
  console.log("Order store updated:", ordersStore);
  return order;
};

// Helper function to reset the order store
export const resetOrderStore = () => {
  // Move current orders to archive before resetting
  archivedOrders = [...archivedOrders, ...ordersStore];
  localStorage.setItem('archivedOrders', JSON.stringify(archivedOrders));
  
  // Reset current orders
  ordersStore = [];
  localStorage.setItem('ordersStore', JSON.stringify(ordersStore));
  
  console.log("Order store has been reset and archived");
};

// Fonction pour vérifier si tous les brouillons sont complétés
export const checkAllDraftsCompleted = (): boolean => {
  const draftInvoices = JSON.parse(localStorage.getItem('draftInvoices') || '[]');
  return draftInvoices.every((invoice: any) => invoice.status === 'completed');
};

// Fonction pour récupérer le résumé quotidien
export const getDailySummary = (): DailySummary => {
  // Calculate based on all orders in the store
  const totalRevenue = ordersStore.reduce((sum, order) => sum + order.total, 0);
  
  // Check if there was a close operation today
  const lastCloseDate = localStorage.getItem('lastCloseDate');
  let isClosed = false;
  
  if (lastCloseDate) {
    const closeDate = new Date(lastCloseDate);
    const today = new Date();
    isClosed = closeDate.toDateString() === today.toDateString();
  }
  
  return {
    id: uuidv4(),
    date: new Date(),
    totalRevenue,
    orderCount: ordersStore.length,
    isClosed
  };
};

// Fonction pour sauvegarder le résumé quotidien
export const saveDailySummary = (): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Ensure all orders are saved to localStorage
      localStorage.setItem('ordersStore', JSON.stringify(ordersStore));
      console.log('Sauvegarde effectuée avec', ordersStore.length, 'commandes');
      resolve(true);
    }, 800);
  });
};

// Fonction pour clôturer la journée
export const closeDailyOperations = (): Promise<{success: boolean, message?: string}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Vérifier que tous les brouillons sont complétés
      const allCompleted = checkAllDraftsCompleted();
      if (!allCompleted) {
        resolve({
          success: false,
          message: "Impossible de clôturer. Toutes les factures doivent être validées et payées."
        });
        return;
      }
      
      // Save today's orders to archive for historical access
      const today = new Date();
      const closeDate = today.toISOString();
      
      const dailySummary = getDailySummary();
      const dailyTransactions = getDailyTransactions();
      
      // Archive current daily data before reset
      const archiveData = {
        closeDate: closeDate,
        summary: dailySummary,
        transactions: dailyTransactions,
        orders: [...ordersStore]
      };
      
      // Store the daily close report so it can be accessed later
      localStorage.setItem('lastDailyCloseReport', JSON.stringify(archiveData));
      
      // Add current orders to archive
      archivedOrders = [...archivedOrders, ...ordersStore];
      localStorage.setItem('archivedOrders', JSON.stringify(archivedOrders));
      
      // Save close date
      localStorage.setItem('lastCloseDate', closeDate);
      
      // Reset current orders for a new day
      ordersStore = [];
      localStorage.setItem('ordersStore', JSON.stringify(ordersStore));
      
      // Also clear any draft invoices for a fresh start
      localStorage.removeItem('draftInvoices');
      localStorage.removeItem('activeInvoiceId');
      
      console.log('Clôture effectuée avec', dailyTransactions.length, 'commandes archivées');
      resolve({
        success: true,
        message: "Clôture journalière effectuée avec succès."
      });
    }, 1000);
  });
};

// Fonction pour générer un rapport sur une période
export const generateSalesReport = (startDate: string, endDate: string): Promise<Order[]> => {
  return new Promise((resolve) => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    // Combine current orders and archived orders for reporting
    const allOrders = [...ordersStore, ...archivedOrders];
    
    const filteredOrders = allOrders.filter(order => {
      const orderDate = new Date(order.date);
      return orderDate >= start && orderDate <= end;
    });
    
    console.log(`Rapport généré du ${startDate} au ${endDate} avec ${filteredOrders.length} commandes`);
    resolve(filteredOrders);
  });
};

// Fonction pour obtenir les statistiques par mode de paiement
export const getPaymentMethodStats = () => {
  const stats: Record<PaymentMethod, { count: number; total: number }> = {
    'cash': { count: 0, total: 0 },
    'card': { count: 0, total: 0 },
    'other': { count: 0, total: 0 },
    'room_transfer': { count: 0, total: 0 },
    'free': { count: 0, total: 0 }
  };
  
  ordersStore.forEach(order => {
    stats[order.paymentMethod].count += 1;
    stats[order.paymentMethod].total += order.total;
  });
  
  return stats;
};

// Fonction pour obtenir les statistiques par catégorie de produits
export const getProductCategoryStats = () => {
  const stats: Record<string, { count: number; total: number }> = {};
  
  ordersStore.forEach(order => {
    order.items.forEach(item => {
      const category = item.product.category;
      
      if (!stats[category]) {
        stats[category] = { count: 0, total: 0 };
      }
      
      stats[category].count += item.quantity;
      stats[category].total += item.product.price * item.quantity;
    });
  });
  
  return stats;
};

// Fonction pour obtenir les transactions journalières (main courante)
export const getDailyTransactions = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Filter orders for today only
  const todayOrders = ordersStore.filter(order => {
    const orderDate = new Date(order.date);
    return orderDate >= today;
  });
  
  // Transform orders into transactions
  return todayOrders.map(order => ({
    id: order.id,
    invoiceNumber: order.id,
    tableNumber: order.tableNumber,
    server: 'N/A',
    operator: 'N/A',
    totalFood: order.items
      .filter(item => item.product.category === 'Nourriture')
      .reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
    totalDrinks: order.items
      .filter(item => item.product.category === 'Boissons')
      .reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
    totalOther: order.items
      .filter(item => !['Nourriture', 'Boissons'].includes(item.product.category))
      .reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
    totalAmount: order.total,
    paymentMethod: order.paymentMethod,
    date: order.date
  }));
};

// Fonction pour obtenir l'historique complet des transactions pour recherche
export const searchTransactionsByDate = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  
  // Combiner les commandes actuelles et archivées
  const allOrders = [...ordersStore, ...archivedOrders];
  
  return allOrders
    .filter(order => {
      const orderDate = new Date(order.date);
      return orderDate >= start && orderDate <= end;
    })
    .map(order => ({
      id: order.id,
      invoiceNumber: order.id,
      tableNumber: order.tableNumber,
      roomNumber: order.roomNumber,
      totalAmount: order.total,
      paymentMethod: order.paymentMethod,
      date: order.date,
      items: order.items
    }));
};

// Function to get the last daily close report
export const getLastDailyCloseReport = () => {
  const report = localStorage.getItem('lastDailyCloseReport');
  if (report) {
    return JSON.parse(report);
  }
  return null;
};
