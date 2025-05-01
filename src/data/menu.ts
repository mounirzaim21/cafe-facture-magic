
import { Product, Category } from '@/types';

export let categories: Category[] = [
  { id: 'salades', name: 'SALADES', icon: 'salad' },
  { id: 'plats', name: 'PLATS', icon: 'utensils' },
  { id: 'sandwichs', name: 'SANDWICHS', icon: 'utensils' },
  { id: 'paninis', name: 'PANINIS', icon: 'utensils' },
  { id: 'pizzas', name: 'PIZZAS', icon: 'pizza' },
  { id: 'desserts', name: 'DESSERTS', icon: 'dessert' },
  { id: 'vins', name: 'VINS', icon: 'wine' },
  { id: 'bieres', name: 'BIÈRES', icon: 'beer' },
  { id: 'cafe', name: 'CAFÉ', icon: 'coffee' },
  { id: 'apperetif', name: 'APÉRETIF', icon: 'wine' },
  { id: 'eaux-sodas', name: 'EAUX & SODAS', icon: 'coffee' }
];

export let products: Product[] = [
  // Salades
  { id: 'sal1', name: 'Salade FES INN', price: 70.00, category: 'salades', description: 'Salade FES INN' },
  { id: 'sal2', name: 'Salade Quinoa (Avocat Ou Mangue)', price: 70.00, category: 'salades', description: 'Salade Quinoa avec avocat ou mangue' },

  // Plats
  { id: 'p1', name: 'Filet de Bœuf', price: 120.00, category: 'plats', description: 'Filet de bœuf' },
  { id: 'p2', name: 'Entrecôte Grillée', price: 90.00, category: 'plats', description: 'Entrecôte grillée' },
  { id: 'p3', name: 'Brochettes de Viande Hachée', price: 70.00, category: 'plats', description: 'Brochettes de viande hachée' },
  { id: 'p4', name: 'Saucisses de Viande Grillées', price: 80.00, category: 'plats', description: 'Saucisses de viande grillées' },
  { id: 'p5', name: 'Cuisse de Poulet', price: 60.00, category: 'plats', description: 'Cuisse de poulet' },
  { id: 'p6', name: 'Pilons de Poulet', price: 60.00, category: 'plats', description: 'Pilons de poulet' },
  { id: 'p7', name: 'Brochettes de Volaille', price: 60.00, category: 'plats', description: 'Brochettes de volaille' },
  { id: 'p8', name: 'Filet de Poulet Mariné', price: 60.00, category: 'plats', description: 'Filet de poulet mariné' },
  { id: 'p9', name: 'MENU ENFANTS', price: 70.00, category: 'plats', description: 'Menu enfants' },

  // Sandwichs
  { id: 's1', name: 'Sandwich de Volaille', price: 60.00, category: 'sandwichs', description: 'Sandwich de volaille' },
  { id: 's2', name: 'Sandwich de Fromage', price: 40.00, category: 'sandwichs', description: 'Sandwich au fromage' },
  { id: 's3', name: 'Tuna Sandwich', price: 60.00, category: 'sandwichs', description: 'Sandwich au thon' },
  { id: 's4', name: 'Hamburger Ou Frommages', price: 70.00, category: 'sandwichs', description: 'Hamburger ou fromages' },

  // Paninis
  { id: 'pan1', name: 'Panini Viande Hachée', price: 40.00, category: 'paninis', description: 'Panini à la viande hachée' },
  { id: 'pan2', name: 'Panini Poulet', price: 40.00, category: 'paninis', description: 'Panini au poulet' },
  { id: 'pan3', name: 'Panini Mixte', price: 50.00, category: 'paninis', description: 'Panini mixte' },
  { id: 'pan4', name: 'Panini Charcuterie', price: 50.00, category: 'paninis', description: 'Panini charcuterie' },

  // Pizzas
  { id: 'piz1', name: 'Pizza Margarita', price: 50.00, category: 'pizzas', description: 'Pizza Margarita' },
  { id: 'piz2', name: 'Pizza Quatre saisons', price: 70.00, category: 'pizzas', description: 'Pizza Quatre saisons' },
  { id: 'piz3', name: 'Pizza Bolognaise', price: 60.00, category: 'pizzas', description: 'Pizza Bolognaise' },
  { id: 'piz4', name: 'Pizza Végétarienne', price: 55.00, category: 'pizzas', description: 'Pizza Végétarienne' },
  { id: 'piz5', name: 'Pizza Fruits de mer', price: 70.00, category: 'pizzas', description: 'Pizza aux fruits de mer' },

  // Desserts
  { id: 'd1', name: 'Coupe de Glace', price: 35.00, category: 'desserts', description: 'Coupe de glace' },
  { id: 'd2', name: 'Crème Caramel', price: 30.00, category: 'desserts', description: 'Crème caramel' },
  { id: 'd3', name: 'Salade de Fruits', price: 30.00, category: 'desserts', description: 'Salade de fruits' },

  // Vins
  { id: 'v1', name: 'BEAUVALLON ROUGE 3/4', price: 240.00, category: 'vins', description: 'Beauvallon rouge 75cl' },
  { id: 'v2', name: 'BEAUVALON 1/2', price: 120.00, category: 'vins', description: 'Beauvalon 37.5cl' },
  { id: 'v3', name: 'MEDAILLON ROUGE 37 CL', price: 160.00, category: 'vins', description: 'Médaillon rouge 37cl' },
  { id: 'v4', name: 'MEDAILLON ROUGE 75 CL', price: 300.00, category: 'vins', description: 'Médaillon rouge 75cl' },
  { id: 'v5', name: 'RIMAL ROUGE 37,5', price: 120.00, category: 'vins', description: 'Rimal rouge 37.5cl' },
  { id: 'v6', name: 'RIMAL ROUGE 75CL', price: 100.00, category: 'vins', description: 'Rimal rouge 75cl' },
  { id: 'v7', name: 'SAHARI RESERVE ROUGE 1/2', price: 140.00, category: 'vins', description: 'Sahari réserve rouge 37.5cl' },
  { id: 'v8', name: 'SAHARI RESERVE ROUGE 3/4', price: 270.00, category: 'vins', description: 'Sahari réserve rouge 75cl' },
  { id: 'p2bc6935c', name: 'CUVE DE PRISEDENT 75 CL', price: 170, category: 'vins', description: 'VIN ORD' },

  // Bières
  { id: 'b1', name: 'BUDWEISER', price: 50.00, category: 'bieres', description: 'Budweiser' },
  { id: 'b2', name: 'CASABLANCA', price: 60.00, category: 'bieres', description: 'Casablanca' },
  { id: 'b3', name: 'FLAG SPECIAL', price: 30.00, category: 'bieres', description: 'Flag spécial' },
  { id: 'b4', name: 'HEINEKEN VS 25 CL', price: 50.00, category: 'bieres', description: 'Heineken 25cl' },
  { id: 'b5', name: 'ICE', price: 80.00, category: 'bieres', description: 'Ice' },

  // Café
  { id: 'c1', name: 'CAFE LAVAZZA', price: 25.00, category: 'cafe', description: 'Café Lavazza' },

  // Apéritifs
  { id: 'a1', name: 'MARTINI BLANC', price: 50.00, category: 'apperetif', description: 'Martini blanc' },
  { id: 'a2', name: 'MARTINI ROUGE', price: 50.00, category: 'apperetif', description: 'Martini rouge' },
  { id: 'a3', name: 'PASTIS 51', price: 50.00, category: 'apperetif', description: 'Pastis 51' },
  { id: 'a4', name: 'PORTO ROUGE', price: 50.00, category: 'apperetif', description: 'Porto rouge' },
  { id: 'a5', name: 'RICARD', price: 50.00, category: 'apperetif', description: 'Ricard' },

  // Eaux et Sodas
  { id: 'e1', name: 'OULEMES 100 CL', price: 25.00, category: 'eaux-sodas', description: 'Oulémes 1L' },
  { id: 'e2', name: 'OULEMES 25 CL VERRE', price: 15.00, category: 'eaux-sodas', description: 'Oulémes 25cl verre' },
  { id: 'e3', name: 'OULEMES 50 CL', price: 15.00, category: 'eaux-sodas', description: 'Oulémes 50cl' },
  { id: 'e4', name: 'RED BULL', price: 60.00, category: 'eaux-sodas', description: 'Red Bull' },
  { id: 'e5', name: 'SIDI ALI 150CL', price: 25.00, category: 'eaux-sodas', description: 'Sidi Ali 1.5L' },
  { id: 'e6', name: 'SIDI ALI 50CL', price: 15.00, category: 'eaux-sodas', description: 'Sidi Ali 50cl' },
  { id: 'e7', name: 'SODA 33 CL', price: 25.00, category: 'eaux-sodas', description: 'Soda 33cl' }
];

// Save data to localStorage
const saveData = () => {
  try {
    localStorage.setItem('cafeProducts', JSON.stringify(products));
    localStorage.setItem('cafeCategories', JSON.stringify(categories));
    console.log('Data saved to localStorage');
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

// Load data from localStorage
const loadData = () => {
  try {
    const savedProducts = localStorage.getItem('cafeProducts');
    const savedCategories = localStorage.getItem('cafeCategories');
    
    if (savedProducts) {
      products = JSON.parse(savedProducts);
    }
    
    if (savedCategories) {
      categories = JSON.parse(savedCategories);
    }
    
    console.log('Data loaded from localStorage');
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
};

// Try to load data when this module is imported
loadData();

export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(product => product.category === categoryId);
};

export const addProduct = (product: Product): Product[] => {
  products = [...products, product];
  saveData();
  // Dispatch custom event to notify other components
  const event = new CustomEvent('productUpdated');
  window.dispatchEvent(event);
  return products;
};

export const addCategory = (category: Category): Category[] => {
  categories = [...categories, category];
  saveData();
  // Dispatch custom event to notify other components
  const event = new CustomEvent('categoryUpdated');
  window.dispatchEvent(event);
  return categories;
};

// Function to force refresh the data
export const refreshData = () => {
  loadData(); // Make sure we get the latest data from localStorage
  return {
    categories: [...categories],
    products: [...products]
  };
};
