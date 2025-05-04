
import { Order } from "@/types";

// Clé utilisée pour stocker l'historique des ventes dans localStorage
const SALES_HISTORY_KEY = "salesHistory";

/**
 * Sauvegarde l'historique des ventes dans localStorage
 * @param orders Liste des commandes à sauvegarder
 */
export const saveSalesHistory = (orders: Order[]): void => {
  try {
    localStorage.setItem(SALES_HISTORY_KEY, JSON.stringify(orders));
    console.log(`${orders.length} commandes sauvegardées dans l'historique`);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'historique des ventes:", error);
  }
};

/**
 * Récupère l'historique complet des ventes depuis localStorage
 */
export const getSalesHistory = (): Order[] => {
  try {
    const data = localStorage.getItem(SALES_HISTORY_KEY);
    if (!data) return [];
    
    const orders = JSON.parse(data) as Order[];
    console.log(`${orders.length} commandes chargées depuis l'historique`);
    return orders;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique des ventes:", error);
    return [];
  }
};

/**
 * Filtre l'historique des ventes par plage de dates
 */
export const getSalesHistoryByDateRange = (startDate: string, endDate: string): Order[] => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  
  const history = getSalesHistory();
  
  return history.filter(order => {
    const orderDate = new Date(order.date);
    return orderDate >= start && orderDate <= end;
  });
};

/**
 * Exporte l'historique des ventes au format CSV
 */
export const exportSalesHistoryToCSV = (orders: Order[]): string => {
  if (!orders.length) return "";
  
  const headers = [
    'Date',
    'Numéro de facture',
    'Produits',
    'Quantités',
    'Mode de paiement',
    'Total'
  ].join(';');

  const rows = orders.map(order => {
    const date = new Date(order.date).toLocaleDateString('fr-FR');
    const products = order.items.map(item => item.product.name).join(', ');
    const quantities = order.items.map(item => item.quantity).join(', ');
    const paymentMethod = 
      order.paymentMethod === 'cash' ? 'Espèces' :
      order.paymentMethod === 'card' ? 'Carte bancaire' :
      order.paymentMethod === 'room_transfer' ? 'Transfert chambre' :
      order.paymentMethod === 'free' ? 'Gratuité' : 'Autre';

    return [
      date,
      order.id,
      products,
      quantities,
      paymentMethod,
      order.total.toFixed(2)
    ].join(';');
  });

  return `${headers}\n${rows.join('\n')}`;
};

/**
 * Calcule les statistiques sur une liste de commandes
 */
export const calculateSalesStatistics = (orders: Order[]) => {
  // Total des ventes
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  
  // Nombre de commandes
  const orderCount = orders.length;
  
  // Détail des quantités par produit
  const productQuantities: Record<string, { name: string; quantity: number; total: number }> = {};
  
  orders.forEach(order => {
    order.items.forEach(item => {
      const productId = item.product.id;
      
      if (!productQuantities[productId]) {
        productQuantities[productId] = {
          name: item.product.name,
          quantity: 0,
          total: 0
        };
      }
      
      productQuantities[productId].quantity += item.quantity;
      productQuantities[productId].total += item.product.price * item.quantity;
    });
  });
  
  // Statistiques par mode de paiement
  const paymentStats: Record<string, { count: number; total: number }> = {
    cash: { count: 0, total: 0 },
    card: { count: 0, total: 0 },
    room_transfer: { count: 0, total: 0 },
    free: { count: 0, total: 0 },
    other: { count: 0, total: 0 }
  };
  
  orders.forEach(order => {
    paymentStats[order.paymentMethod].count += 1;
    paymentStats[order.paymentMethod].total += order.total;
  });
  
  return {
    totalRevenue,
    orderCount,
    productQuantities: Object.values(productQuantities),
    paymentStats
  };
};

/**
 * Ajoute automatiquement des commandes à l'historique
 */
export const addOrderToHistory = (order: Order): void => {
  const history = getSalesHistory();
  
  // Vérifier si la commande existe déjà dans l'historique
  const existingIndex = history.findIndex(o => o.id === order.id);
  
  if (existingIndex >= 0) {
    // Mettre à jour la commande existante
    history[existingIndex] = order;
  } else {
    // Ajouter la nouvelle commande
    history.push(order);
  }
  
  saveSalesHistory(history);
};

// Hook pour synchroniser les commandes du reportService avec historyService
export const syncOrdersWithHistory = (): void => {
  // Cette fonction sera appelée lors de l'initialisation de l'application
  // pour synchroniser les ordres dans reportService avec l'historique
  const { archivedOrders, ordersStore } = require('./reportService');
  
  if (!archivedOrders || !ordersStore) return;
  
  // Combiner les commandes actuelles et archivées
  const allOrders = [...ordersStore, ...archivedOrders];
  
  // Charger l'historique actuel
  const currentHistory = getSalesHistory();
  
  // Fusionner les commandes
  const mergedOrders = [...currentHistory];
  
  allOrders.forEach(order => {
    const existingIndex = mergedOrders.findIndex(o => o.id === order.id);
    
    if (existingIndex >= 0) {
      // Mettre à jour la commande existante
      mergedOrders[existingIndex] = order;
    } else {
      // Ajouter la nouvelle commande
      mergedOrders.push(order);
    }
  });
  
  // Sauvegarder l'historique fusionné
  saveSalesHistory(mergedOrders);
};
