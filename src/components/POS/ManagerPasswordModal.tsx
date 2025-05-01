
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { LockKeyhole } from 'lucide-react';

interface ManagerPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ManagerPasswordModal: React.FC<ManagerPasswordModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const managerPassword = localStorage.getItem('managerPassword') || '1234'; // Mot de passe par défaut

  const handleSubmit = () => {
    if (password === managerPassword) {
      toast({
        title: "Accès autorisé",
        description: "Mode gérant activé",
      });
      onConfirm();
    } else {
      toast({
        title: "Accès refusé",
        description: "Mot de passe incorrect",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <LockKeyhole className="mr-2 h-5 w-5" />
            Authentification Gérant
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-500 mb-4">
            Veuillez entrer le mot de passe gérant pour modifier cette facture.
          </p>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full"
            autoFocus
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit}>Confirmer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManagerPasswordModal;
