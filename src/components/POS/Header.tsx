
import React from 'react';
import { Link } from 'react-router-dom';
import { Receipt, ShoppingCart, Plus, BarChart } from 'lucide-react';

const Header: React.FC = () => {
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
          <Receipt className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">Moni_Point de Vente</h1>
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
        </nav>

        <div className="hidden md:block text-sm text-white/80">
          {currentDate}
        </div>
      </div>
    </header>
  );
};

export default Header;
