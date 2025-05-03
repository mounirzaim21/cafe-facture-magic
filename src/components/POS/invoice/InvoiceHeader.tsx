
import React from 'react';

interface InvoiceHeaderProps {
  projectName: string;
  headerText: string;
  logo: string | null;
  orderId: string;
  date: Date;
  tableNumber?: number;
  roomNumber?: string;
  paymentMethod: string;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
  projectName,
  headerText,
  logo,
  orderId,
  date,
  tableNumber,
  roomNumber,
  paymentMethod
}) => {
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
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
  );
};

export default InvoiceHeader;
