
import React, { useRef, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CartItem, PaymentMethod } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Check, Printer, FileText } from 'lucide-react';

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

  const calculateSubtotal = (): number => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const calculateTax = (): number => {
    // TVA à 10% pour la restauration au Maroc
    return calculateSubtotal() * 0.1;
  };

  const calculateTotal = (): number => {
    return calculateSubtotal() + calculateTax();
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getPaymentMethodName = (method: PaymentMethod): string => {
    switch (method) {
      case 'cash': return 'Espèces';
      case 'card': return 'Carte bancaire';
      case 'room_transfer': return 'Transfer chambre';
      case 'free': return 'Gratuité';
      case 'other': return 'Autre';
    }
  };

  const handlePrint = () => {
    if (invoiceRef.current) {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert("Veuillez autoriser les popups pour l'impression");
        return;
      }
      
      const printContents = invoiceRef.current.innerHTML;
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Facture ${orderId}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              width: 80mm;
              font-size: 12px;
            }
            .print-ticket {
              padding: 5mm;
            }
            .text-center { text-align: center; }
            .my-2 { margin-top: 8px; margin-bottom: 8px; }
            .py-2 { padding-top: 8px; padding-bottom: 8px; }
            .mt-4 { margin-top: 16px; }
            .pt-2 { padding-top: 8px; }
            .space-y-1 > * + * { margin-top: 4px; }
            .text-xs { font-size: 10px; }
            .text-sm { font-size: 12px; }
            .text-lg { font-size: 16px; }
            .font-bold { font-weight: bold; }
            .border-t, .border-b { border-top: 1px dashed #ccc; }
            .border-dashed { border-style: dashed; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .border-dotted { border-bottom: 1px dotted #ccc; }
            .pb-1 { padding-bottom: 4px; }
            .text-right { text-align: right; }
            .logo { max-width: 60%; max-height: 50px; margin: 0 auto; display: block; }
          </style>
        </head>
        <body>
          <div class="print-ticket">
            ${printContents}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
        </html>
      `);
      
      printWindow.document.close();
    }
  };

  const handleAccept = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Facture</DialogTitle>
        </DialogHeader>
        
        <div className="bg-white p-4 rounded-lg text-sm" ref={invoiceRef} data-invoice>
          <div className="text-center mb-4 space-y-1">
            {logo && (
              <img src={logo} alt="Logo" className="logo mb-2 mx-auto" />
            )}
            <h2 className="text-lg font-bold">{projectName}</h2>
            
            {headerText && (
              <div className="text-xs whitespace-pre-line">
                {headerText}
              </div>
            )}
            
            <div className="border-t border-b border-dashed my-2 py-2">
              <p>Facture N°: {orderId}</p>
              <p>Date: {formatDate(date)}</p>
              {tableNumber && <p>Table N°: {tableNumber}</p>}
              {paymentMethod === 'room_transfer' && roomNumber && (
                <p>Chambre N°: {roomNumber}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm border-b border-dotted pb-1">
                <div>
                  <div>{item.product.name}</div>
                  <div className="text-xs">{item.quantity} x {formatCurrency(item.product.price)}</div>
                </div>
                <div className="text-right">
                  {formatCurrency(item.product.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-2 border-t border-dashed space-y-1">
            <div className="flex justify-between text-sm">
              <span>Sous-total:</span>
              <span>{formatCurrency(calculateSubtotal())}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>TVA (10%):</span>
              <span>{formatCurrency(calculateTax())}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-dashed pt-2">
              <span>Total:</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
            <div className="flex justify-between text-sm pt-2">
              <span>Méthode de paiement:</span>
              <span>{getPaymentMethodName(paymentMethod)}</span>
            </div>
          </div>

          <div className="text-center text-xs mt-4 space-y-1">
            {footerText ? (
              <div className="whitespace-pre-line">
                {footerText}
              </div>
            ) : (
              <p>Merci de votre visite!</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handlePrint} className="mr-2">
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          <Button onClick={handleAccept}>
            <Check className="mr-2 h-4 w-4" />
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;
