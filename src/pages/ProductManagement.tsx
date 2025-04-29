import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Product, Category } from '@/types';
import { categories, products, addProduct, addCategory } from '@/data/menu';
import { useToast } from '@/hooks/use-toast';

const ProductManagement = () => {
  const { toast } = useToast();
  const [allProducts, setAllProducts] = useState<Product[]>(products);
  const [allCategories, setAllCategories] = useState<Category[]>(categories);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    id: '',
    name: '',
    price: 0,
    category: categories.length > 0 ? categories[0].id : '',
    description: ''
  });

  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    id: '',
    name: '',
    icon: ''
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
    
    // Update both local state and global data
    const updatedProducts = addProduct(productToSave);
    setAllProducts([...updatedProducts]);
    
    // Reset the form
    setNewProduct({
      id: '',
      name: '',
      price: 0,
      category: categories[0].id,
      description: ''
    });

    // Success notification
    toast({
      title: "Succès",
      description: `Le produit "${productToSave.name}" a été ajouté avec succès`,
    });
    
    console.log('Nouveau produit sauvegardé:', productToSave);
  };

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
    
    // Update both local state and global data
    const updatedCategories = addCategory(categoryToSave);
    setAllCategories([...updatedCategories]);
    
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
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Gestion des Produits et Catégories</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>

      {/* Display products and categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Produits ({allProducts.length})</h2>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {allProducts.map((product) => (
              <div key={product.id} className="p-3 border rounded-md">
                <div className="flex justify-between">
                  <span className="font-medium">{product.name}</span>
                  <span>{product.price.toFixed(2)} €</span>
                </div>
                <div className="text-sm text-gray-600">{product.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Catégories ({allCategories.length})</h2>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {allCategories.map((category) => (
              <div key={category.id} className="p-3 border rounded-md flex items-center gap-2">
                <span>{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
