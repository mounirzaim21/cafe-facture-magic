
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProductManagement from "./pages/ProductManagement";
import SalesReport from "./pages/SalesReport";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { TooltipProvider } from "@/components/ui/tooltip";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  // Appliquer les couleurs personnalisées au chargement
  useEffect(() => {
    const primaryColor = localStorage.getItem('primaryColor');
    const secondaryColor = localStorage.getItem('secondaryColor');
    
    if (primaryColor) {
      document.documentElement.style.setProperty('--cafe-navy', primaryColor);
      // Appliquer également aux variables de couleur CSS standard pour une meilleure intégration
      document.documentElement.style.setProperty('--sidebar-primary', primaryColor);
    }
    
    if (secondaryColor) {
      document.documentElement.style.setProperty('--cafe-bordeaux', secondaryColor);
      // Appliquer également aux variables de couleur CSS standard pour une meilleure intégration
      document.documentElement.style.setProperty('--accent-foreground', secondaryColor);
    }

    // S'assurer que les variables CSS sont bien définies dans le root
    const root = document.documentElement;
    const style = getComputedStyle(root);
    
    if (!style.getPropertyValue('--cafe-navy')) {
      root.style.setProperty('--cafe-navy', '#1a3a5f');
    }
    
    if (!style.getPropertyValue('--cafe-bordeaux')) {
      root.style.setProperty('--cafe-bordeaux', '#93293d');
    }

    console.log("Couleurs appliquées:", {
      primaryColor,
      secondaryColor,
      cssVars: {
        cafeNavy: style.getPropertyValue('--cafe-navy'),
        cafeBordeaux: style.getPropertyValue('--cafe-bordeaux')
      }
    });
  }, []);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<ProductManagement />} />
              <Route path="/reports" element={<SalesReport />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
