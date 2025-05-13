
import React from 'react';
import { Invoice } from '@/types';
import InvoiceModal from '@/components/POS/InvoiceModal';

interface InvoiceDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOrder: Invoice | null;
}

const InvoiceDisplayModal: React.FC<InvoiceDisplayModalProps> = ({
  isOpen,
  onClose,
  currentOrder
}) => {
  if (!currentOrder || !isOpen) return null;
  
  return (
    <InvoiceModal 
      isOpen={isOpen}
      onClose={onClose}
      items={currentOrder.items || []}
      paymentMethod={currentOrder.paymentMethod || 'cash'}
      date={currentOrder.createdAt}
      orderId={currentOrder.id}
      tableNumber={currentOrder.tableNumber}
      roomNumber={currentOrder.roomNumber}
    />
  );
};

export default InvoiceDisplayModal;
