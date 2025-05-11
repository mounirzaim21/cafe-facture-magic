
import React from 'react';
import { useInvoices } from '@/hooks/useInvoices';
import OpenInvoices from './OpenInvoices';

const InvoiceSection = () => {
  const {
    invoices,
    activeInvoiceId,
    handleNewInvoice,
    setActiveInvoiceId
  } = useInvoices();

  return (
    <OpenInvoices
      invoices={invoices}
      activeInvoiceId={activeInvoiceId}
      onNewInvoice={handleNewInvoice}
      onSelectInvoice={setActiveInvoiceId}
    />
  );
};

export default InvoiceSection;
