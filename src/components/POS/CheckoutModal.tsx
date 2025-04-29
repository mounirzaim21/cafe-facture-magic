
import React, { useState } from 'react';
import { CartItem, PaymentMethod } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { Save, Check, CreditCard, Euro, DoorOpen, FileText } from 'lucide-react';

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

  const calculateTotal = (): number => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Finaliser la commande</DialogTitle>
        </DialogHeader>

        <div className="py-4">
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

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave} variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700">
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
          <Button onClick={handleValidate} className="bg-green-600 hover:bg-green-700">
            <Check className="mr-2 h-4 w-4" />
            Valider
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
