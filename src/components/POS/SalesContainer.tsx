
import React from 'react';
import SalesArea from '@/components/POS/SalesArea';
import CartContainer from '@/components/POS/CartContainer';
import { useMenu } from '@/hooks/useMenu';
import { useInvoices } from '@/hooks/useInvoices';

const SalesContainer = () => {
  const {
    availableCategories,
    selectedCategory,
    currentProducts,
    setSelectedCategory
  } = useMenu();

  const { handleAddToCart } = useInvoices();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
      <SalesArea
        availableCategories={availableCategories}
        selectedCategory={selectedCategory}
        currentProducts={currentProducts}
        onSelectCategory={setSelectedCategory}
        onAddToCart={handleAddToCart}
      />
      
      <div className="lg:col-span-1">
        <CartContainer />
      </div>
    </div>
  );
};

export default SalesContainer;
