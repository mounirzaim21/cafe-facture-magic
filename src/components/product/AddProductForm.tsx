
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Product, Category } from '@/types';
import { addProduct } from '@/data/menu';
import { useToast } from '@/hooks/use-toast';

interface AddProductFormProps {
  allCategories: Category[];
  onProductAdded: (products: Product[]) => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ allCategories, onProductAdded }) => {
  const { toast } = useToast();
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    id: '',
    name: '',
    price: 0,
    category: allCategories.length > 0 ? allCategories[0].id : '',
    description: ''
  });

  const handleSaveProduct = () => {
    // Basic validation
    if (!newProduct.name) {
      toast({
        title: "Erreur",
        description: "Le nom du produit est requis",
        variant: "destructive"
      });
      return;
    }

    if (!newProduct.price || newProduct.price <= 0) {
      toast({
        title: "Erreur",
        description: "Le prix doit être supérieur à zéro",
        variant: "destructive"
      });
      return;
    }

    const productToSave: Product = {
      ...newProduct,
      id: `p${uuidv4().substring(0, 8)}`,
    } as Product;
    
    // Update global data
    const updatedProducts = addProduct(productToSave);
    onProductAdded(updatedProducts);
    
    // Reset the form
    setNewProduct({
      id: '',
      name: '',
      price: 0,
      category: allCategories[0].id,
      description: ''
    });

    // Success notification
    toast({
      title: "Succès",
      description: `Le produit "${productToSave.name}" a été ajouté avec succès`,
    });
    
    console.log('Nouveau produit sauvegardé:', productToSave);
    
    // Dispatch custom event to notify components to refresh their data
    const customEvent = new CustomEvent('productUpdated', { detail: productToSave });
    window.dispatchEvent(customEvent);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Nouveau Produit</h2>
      <div className="space-y-4">
        <Input
          placeholder="Nom du produit"
          value={newProduct.name}
          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
        />
        <Input
          type="number"
          placeholder="Prix"
          value={newProduct.price}
          onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
        />
        <select
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          value={newProduct.category}
          onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
        >
          {allCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <Textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
        />
        <Button onClick={handleSaveProduct}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter Produit
        </Button>
      </div>
    </div>
  );
};

export default AddProductForm;
