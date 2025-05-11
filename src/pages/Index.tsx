
import React, { useEffect } from 'react';
import MainLayout from '@/components/POS/MainLayout';
import { useInvoices } from '@/hooks/useInvoices';

const Index = () => {
  const { invoices, activeInvoiceId, setActiveInvoiceId } = useInvoices();

  // Ensure we restore the current invoice state from localStorage
  useEffect(() => {
    if (invoices.length > 0 && !activeInvoiceId) {
      const draftInvoices = invoices.filter(inv => inv.status === 'draft');
      if (draftInvoices.length > 0) {
        setActiveInvoiceId(draftInvoices[0].id);
      }
    }
  }, [invoices, activeInvoiceId, setActiveInvoiceId]);

  return <MainLayout />;
};

export default Index;
