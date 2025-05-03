
import React from 'react';

interface InvoiceFooterProps {
  footerText: string;
}

const InvoiceFooter: React.FC<InvoiceFooterProps> = ({ footerText }) => {
  return (
    <div className="text-center text-xs mt-4 space-y-1">
      {footerText ? (
        <div className="whitespace-pre-line">
          {footerText}
        </div>
      ) : (
        <p>Merci de votre visite!</p>
      )}
    </div>
  );
};

export default InvoiceFooter;
