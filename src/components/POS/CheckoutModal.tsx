
import React, { useState, useRef } from 'react';
import { CartItem, PaymentMethod } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { Save, Check, CreditCard, Euro, DoorOpen, FileText, Printer } from 'lucide-react';
import ManagerPasswordModal from './ManagerPasswordModal';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteOrder: (paymentMethod: PaymentMethod, tableNumber?: number, roomNumber?: string, shouldComplete?: boolean) => void;
  items: CartItem[];
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onCompleteOrder,
  items,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [roomNumber, setRoomNumber] = useState<string>('');
  const [isManagerModalOpen, setIsManagerModalOpen] = useState<boolean>(false);
  const printRef = useRef<HTMLDivElement>(null);

  const calculateTotal = (): number => {
    // Si le mode de paiement est "Gratuité", on retourne 0
    if (paymentMethod === 'free') {
      return 0;
    }
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const handleSave = () => {
    onCompleteOrder(
      paymentMethod, 
      tableNumber ? parseInt(tableNumber) : undefined,
      roomNumber || undefined,
      false // not completing the order, just saving
    );
  };

  const handleValidate = () => {
    onCompleteOrder(
      paymentMethod, 
      tableNumber ? parseInt(tableNumber) : undefined,
      roomNumber || undefined,
      true // completing the order
    );
  };

  const handleManagerConfirm = () => {
    setIsManagerModalOpen(false);
    onClose();
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert("Veuillez autoriser les popups pour l'impression");
        return;
      }
      
      // Create content for printing
      const totalPrice = calculateTotal();
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Pré-Facture</title>
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
          </style>
        </head>
        <body>
          <div class="print-ticket">
            <div class="text-center my-2">
              <div class="text-lg font-bold">Pré-Facture</div>
              <div class="text-xs">${new Date().toLocaleString()}</div>
            </div>
            
            <div class="border-t border-b py-2 my-2">
              ${tableNumber ? `<div>Table: ${tableNumber}</div>` : ''}
              <div>Méthode de paiement: ${
                paymentMethod === 'cash' ? 'Espèces' :
                paymentMethod === 'card' ? 'Carte bancaire' :
                paymentMethod === 'room_transfer' ? 'Transfer chambre' :
                paymentMethod === 'free' ? 'Gratuité' : 'Autre'
              }</div>
            </div>
            
            <div class="space-y-1 my-2">
              ${items.map(item => `
                <div class="flex justify-between border-dotted pb-1">
                  <div>${item.quantity}x ${item.product.name}</div>
                  <div class="text-right">${formatCurrency(item.product.price * item.quantity)}</div>
                </div>
              `).join('')}
            </div>
            
            <div class="border-t pt-2 mt-4">
              <div class="flex justify-between">
                <div>Sous-total:</div>
                <div>${formatCurrency(calculateTotal())}</div>
              </div>
              <div class="flex justify-between">
                <div>TVA (10%):</div>
                <div>${formatCurrency(calculateTotal() * 0.1)}</div>
              </div>
              <div class="flex justify-between font-bold">
                <div>Total:</div>
                <div>${formatCurrency(totalPrice)}</div>
              </div>
            </div>
            
            <div class="text-center text-xs mt-4 pt-2 border-t">
              Merci pour votre visite!
            </div>
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Finaliser la commande</DialogTitle>
            <DialogDescription>Complétez les informations pour finaliser votre commande</DialogDescription>
          </DialogHeader>

          <div className="py-4" ref={printRef}>
            <div className="mb-4">
              <Label htmlFor="tableNumber">Numéro de table (optionnel)</Label>
              <Input
                id="tableNumber"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Ex: 5"
                type="number"
                min="1"
              />
            </div>

            <div className="mb-6">
              <Label>Méthode de paiement</Label>
              <RadioGroup
                defaultValue="cash"
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                className="mt-2 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex items-center">
                    <Euro className="mr-2 h-4 w-4" /> Espèces
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" /> Carte bancaire
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="room_transfer" id="room_transfer" />
                  <Label htmlFor="room_transfer" className="flex items-center">
                    <DoorOpen className="mr-2 h-4 w-4" /> Transfer chambre
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="free" id="free" />
                  <Label htmlFor="free" className="flex items-center">
                    <Check className="mr-2 h-4 w-4" /> Gratuité
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="flex items-center">Autre</Label>
                </div>
              </RadioGroup>
            </div>

            {paymentMethod === 'room_transfer' && (
              <div className="mb-4">
                <Label htmlFor="roomNumber">Numéro de chambre</Label>
                <Input
                  id="roomNumber"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="Ex: 101"
                  type="text"
                  required
                />
              </div>
            )}

            <div className="border-t pt-4">
              <div className="space-y-1">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.product.name}</span>
                    <span>{formatCurrency(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-semibold mt-4 pt-4 border-t">
                <span>Total</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row justify-between gap-2">
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button 
                onClick={handlePrint} 
                variant="outline" 
                className="bg-blue-100 hover:bg-blue-200 flex items-center"
              >
                <Printer className="mr-2 h-4 w-4" />
                Imprimer
              </Button>
            </div>
            <div className="flex space-x-2 mt-2 sm:mt-0">
              <Button 
                onClick={handleSave} 
                variant="secondary" 
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </Button>
              <Button onClick={handleValidate} className="bg-green-600 hover:bg-green-700">
                <Check className="mr-2 h-4 w-4" />
                Valider
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isManagerModalOpen && (
        <ManagerPasswordModal
          isOpen={isManagerModalOpen}
          onClose={() => setIsManagerModalOpen(false)}
          onConfirm={handleManagerConfirm}
        />
      )}
    </>
  );
};

export default CheckoutModal;
