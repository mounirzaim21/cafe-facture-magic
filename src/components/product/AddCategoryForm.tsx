
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Category } from '@/types';
import { addCategory } from '@/data/menu';
import { useToast } from '@/hooks/use-toast';

interface AddCategoryFormProps {
  onCategoryAdded: (categories: Category[]) => void;
}

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({ onCategoryAdded }) => {
  const { toast } = useToast();
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    id: '',
    name: '',
    icon: ''
  });

  const handleSaveCategory = () => {
    // Basic validation
    if (!newCategory.name) {
      toast({
        title: "Erreur",
        description: "Le nom de la catégorie est requis",
        variant: "destructive"
      });
      return;
    }

    if (!newCategory.icon) {
      toast({
        title: "Erreur",
        description: "L'icône est requise",
        variant: "destructive"
      });
      return;
    }

    const categoryToSave: Category = {
      ...newCategory,
      id: `c${uuidv4().substring(0, 8)}`,
    } as Category;
    
    // Update global data
    const updatedCategories = addCategory(categoryToSave);
    onCategoryAdded(updatedCategories);
    
    // Reset the form
    setNewCategory({
      id: '',
      name: '',
      icon: ''
    });

    // Success notification
    toast({
      title: "Succès",
      description: `La catégorie "${categoryToSave.name}" a été ajoutée avec succès`,
    });
    
    console.log('Nouvelle catégorie sauvegardée:', categoryToSave);
    
    // Dispatch custom event to notify components to refresh their data
    const customEvent = new CustomEvent('productUpdated', { detail: categoryToSave });
    window.dispatchEvent(customEvent);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Nouvelle Catégorie</h2>
      <div className="space-y-4">
        <Input
          placeholder="Nom de la catégorie"
          value={newCategory.name}
          onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
        />
        <select
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          value={newCategory.icon}
          onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
        >
          <option value="">-- Sélectionner une icône --</option>
          <option value="utensils">Couverts (Plats)</option>
          <option value="coffee">Café (Boissons)</option>
          <option value="wine">Vin (Alcools)</option>
          <option value="cake-slice">Gâteau (Desserts)</option>
          <option value="pizza">Pizza</option>
        </select>
        <Button onClick={handleSaveCategory}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter Catégorie
        </Button>
      </div>
    </div>
  );
};

export default AddCategoryForm;
