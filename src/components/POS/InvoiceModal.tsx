
import React, { useRef } from 'react';
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
      const printContents = invoiceRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      
      // Force React to re-render
      window.location.reload();
    }
  };

  const handleAccept = () => {
    // Implémenter une logique de validation si nécessaire
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
            <h2 className="text-lg font-bold">Moni_Point de Vente</h2>
            <p className="text-xs">123 Rue de Paris, 75001 Paris</p>
            <p className="text-xs">Tel: 01 23 45 67 89</p>
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
            <p>Merci de votre visite!</p>
            <p>TVA MA12345678900</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handlePrint} className="mr-2">
            <FileText className="mr-2 h-4 w-4" />
            Éditer
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
