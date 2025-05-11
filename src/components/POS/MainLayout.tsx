
import React from 'react';
import Header from '@/components/POS/Header';
import InvoiceSection from '@/components/POS/InvoiceSection';
import SalesContainer from '@/components/POS/SalesContainer';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-cafe-cream">
      <Header />

      <main className="container mx-auto py-6 px-4">
        <InvoiceSection />
        <SalesContainer />
      </main>
    </div>
  );
};

export default MainLayout;
