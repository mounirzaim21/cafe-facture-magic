
import React from 'react';
import { CartItem } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface InvoiceItemsProps {
  items: CartItem[];
}

const InvoiceItems: React.FC<InvoiceItemsProps> = ({ items }) => {
  return (
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
  );
};

export default InvoiceItems;
