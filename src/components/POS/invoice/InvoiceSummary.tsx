
import React from 'react';
import { CartItem, PaymentMethod } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface InvoiceSummaryProps {
  items: CartItem[];
  paymentMethod: PaymentMethod;
}

const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({ items, paymentMethod }) => {
  const calculateSubtotal = (): number => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const calculateTax = (): number => {
    // Si c'est une gratuité, pas de TVA
    if (paymentMethod === 'free') return 0;
    // TVA à 10% pour la restauration au Maroc
    return calculateSubtotal() * 0.1;
  };

  const calculateTotal = (): number => {
    // Si c'est une gratuité, total à 0
    if (paymentMethod === 'free') return 0;
    return calculateSubtotal() + calculateTax();
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

  return (
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
      <div className="mt-4">
        <Button variant="outline" className="w-full">
          <Printer className="mr-2 h-4 w-4" />
          Imprimer facture
        </Button>
      </div>
    </div>
  );
};

export default InvoiceSummary;
