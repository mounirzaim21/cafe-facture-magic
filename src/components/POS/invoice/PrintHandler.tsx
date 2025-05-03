
import React, { useRef } from 'react';

interface PrintHandlerProps {
  content: React.RefObject<HTMLDivElement>;
  orderId: string;
}

const PrintHandler = ({ content, orderId }: PrintHandlerProps) => {
  return () => {
    if (content.current) {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert("Veuillez autoriser les popups pour l'impression");
        return;
      }
      
      const printContents = content.current.innerHTML;
      
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
};

export default PrintHandler;
