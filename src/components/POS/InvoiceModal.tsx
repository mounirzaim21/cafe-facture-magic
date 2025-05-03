
import React, { useRef, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CartItem, PaymentMethod } from '@/types';
import { Check, Printer } from 'lucide-react';
import InvoiceHeader from './invoice/InvoiceHeader';
import InvoiceItems from './invoice/InvoiceItems';
import InvoiceSummary from './invoice/InvoiceSummary';
import InvoiceFooter from './invoice/InvoiceFooter';
import PrintHandler from './invoice/PrintHandler';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  paymentMethod: PaymentMethod;
  date: Date;
  orderId: string;
  tableNumber?: number;
  roomNumber?: string;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  items,
  paymentMethod,
  date,
  orderId,
  tableNumber,
  roomNumber,
}) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [projectName, setProjectName] = useState('Moni_Point de Vente');
  const [headerText, setHeaderText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    // Charger les paramètres de facture depuis localStorage
    const savedProjectName = localStorage.getItem('projectName');
    const savedHeaderText = localStorage.getItem('headerText');
    const savedFooterText = localStorage.getItem('footerText');
    const savedLogo = localStorage.getItem('projectLogo');
    
    if (savedProjectName) setProjectName(savedProjectName);
    if (savedHeaderText) setHeaderText(savedHeaderText);
    if (savedFooterText) setFooterText(savedFooterText);
    if (savedLogo) setLogo(savedLogo);
  }, []);

  const handlePrintInvoice = PrintHandler({ content: invoiceRef, orderId });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Facture</DialogTitle>
        </DialogHeader>
        
        <div className="bg-white p-4 rounded-lg text-sm" ref={invoiceRef} data-invoice>
          <InvoiceHeader 
            projectName={projectName}
            headerText={headerText}
            logo={logo}
            orderId={orderId}
            date={date}
            tableNumber={tableNumber}
            roomNumber={roomNumber}
            paymentMethod={paymentMethod}
          />

          <InvoiceItems items={items} />
          
          <InvoiceSummary items={items} paymentMethod={paymentMethod} />

          <InvoiceFooter footerText={footerText} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handlePrintInvoice} className="mr-2">
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          <Button onClick={onClose}>
            <Check className="mr-2 h-4 w-4" />
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
