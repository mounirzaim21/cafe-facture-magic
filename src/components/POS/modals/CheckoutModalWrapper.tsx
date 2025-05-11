
import React from 'react';
import CheckoutModal from '@/components/POS/CheckoutModal';
import { Invoice, PaymentMethod } from '@/types';

interface CheckoutModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  currentInvoice: Invoice | null;
  onCompleteCheckout: (
    paymentMethod: PaymentMethod, 
    tableNumber?: number, 
    roomNumber?: string,
    shouldComplete?: boolean
  ) => void;
}

const CheckoutModalWrapper: React.FC<CheckoutModalWrapperProps> = ({
  isOpen,
  onClose,
  currentInvoice,
  onCompleteCheckout
}) => {
  if (!currentInvoice || !isOpen) return null;

  return (
    <CheckoutModal
      isOpen={isOpen}
      onClose={onClose}
      onCompleteOrder={onCompleteCheckout}
      items={currentInvoice.items}
    />
  );
};

export default CheckoutModalWrapper;
