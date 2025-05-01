
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Receipt, ShoppingCart, Plus, BarChart, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const [projectName, setProjectName] = useState('Moni_Point de Vente');
  const [logo, setLogo] = useState<string | null>(null);
  
  useEffect(() => {
    // Charger le nom et le logo du projet depuis localStorage
    const savedProjectName = localStorage.getItem('projectName');
    const savedLogo = localStorage.getItem('projectLogo');
    
    if (savedProjectName) {
      setProjectName(savedProjectName);
    }
    
    if (savedLogo) {
      setLogo(savedLogo);
    }
    
    // Écouter les changements de paramètres
    const handleSettingsUpdate = () => {
      const updatedName = localStorage.getItem('projectName');
      if (updatedName) {
        setProjectName(updatedName);
      }
    };
    
    const handleLogoUpdate = () => {
      const updatedLogo = localStorage.getItem('projectLogo');
      if (updatedLogo) {
        setLogo(updatedLogo);
      }
    };
    
    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    window.addEventListener('logoUpdated', handleLogoUpdate);
    
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
      window.removeEventListener('logoUpdated', handleLogoUpdate);
    };
  }, []);

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-cafe-navy text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {logo ? (
            <img src={logo} alt="Logo" className="h-8 w-auto mr-3" />
          ) : (
            <Receipt className="h-6 w-6 mr-2" />
          )}
          <h1 className="text-2xl font-bold">{projectName}</h1>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="flex items-center hover:text-white/80">
            <ShoppingCart className="h-5 w-5 mr-2" />
            <span>Point de vente</span>
          </Link>
          <Link to="/products" className="flex items-center hover:text-white/80">
            <Plus className="h-5 w-5 mr-2" />
            <span>Produits</span>
          </Link>
          <Link to="/reports" className="flex items-center hover:text-white/80">
            <BarChart className="h-5 w-5 mr-2" />
            <span>Rapports</span>
          </Link>
          <Link to="/settings" className="flex items-center hover:text-white/80">
            <Settings className="h-5 w-5 mr-2" />
            <span>Paramètres</span>
          </Link>
        </nav>

        <div className="hidden md:block text-sm text-white/80">
          {currentDate}
        </div>
      </div>
    </header>
  );
};

export default Header;
