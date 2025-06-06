
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

        {/* Navbar pour mobile */}
        <div className="md:hidden flex items-center">
          <div className="relative inline-block text-left dropdown">
            <button className="bg-transparent rounded px-3 py-1 focus:outline-none border border-white/30">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="opacity-0 invisible dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95 absolute right-0 mt-2 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <div className="py-1 bg-cafe-navy">
                <Link to="/" className="block px-4 py-2 text-white hover:bg-cafe-navy/80">
                  <ShoppingCart className="h-4 w-4 inline mr-2" />
                  Point de vente
                </Link>
                <Link to="/products" className="block px-4 py-2 text-white hover:bg-cafe-navy/80">
                  <Plus className="h-4 w-4 inline mr-2" />
                  Produits
                </Link>
                <Link to="/reports" className="block px-4 py-2 text-white hover:bg-cafe-navy/80">
                  <BarChart className="h-4 w-4 inline mr-2" />
                  Rapports
                </Link>
                <Link to="/settings" className="block px-4 py-2 text-white hover:bg-cafe-navy/80">
                  <Settings className="h-4 w-4 inline mr-2" />
                  Paramètres
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:block text-sm text-white/80">
          {currentDate}
        </div>
      </div>
    </header>
  );
};

export default Header;
