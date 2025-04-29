
import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Invoice } from '@/types';

interface OpenInvoicesProps {
  invoices: Invoice[];
  activeInvoiceId: string | null;
  onNewInvoice: () => void;
  onSelectInvoice: (invoiceId: string) => void;
}

const OpenInvoices: React.FC<OpenInvoicesProps> = ({
  invoices,
  activeInvoiceId,
  onNewInvoice,
  onSelectInvoice,
}) => {
  const draftInvoices = invoices.filter(invoice => invoice.status === 'draft');

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Factures en cours</h2>
        <Button onClick={onNewInvoice} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle facture
        </Button>
      </div>
      <ScrollArea className="h-[120px]">
        <div className="space-y-2">
          {draftInvoices.map((invoice) => (
            <Button
              key={invoice.id}
              variant={activeInvoiceId === invoice.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onSelectInvoice(invoice.id)}
            >
              <FileText className="h-4 w-4 mr-2" />
              <span>Facture #{invoice.number}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default OpenInvoices;
