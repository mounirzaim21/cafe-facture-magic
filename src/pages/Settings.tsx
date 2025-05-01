
import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/POS/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ColorPicker } from '@/components/settings/ColorPicker';
import { useToast } from '@/hooks/use-toast';
import { Settings, Upload, Image, Type, Palette, Lock, SaveIcon } from 'lucide-react';

const SettingsPage = () => {
  const [projectName, setProjectName] = useState('Moni_Point de Vente');
  const [managerPassword, setManagerPassword] = useState('1234');
  const [headerText, setHeaderText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#1a3a5f'); // cafe-navy
  const [secondaryColor, setSecondaryColor] = useState('#93293d'); // cafe-bordeaux
  const logoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Charger les paramètres sauvegardés
  useEffect(() => {
    const savedProjectName = localStorage.getItem('projectName');
    const savedManagerPassword = localStorage.getItem('managerPassword');
    const savedHeaderText = localStorage.getItem('headerText');
    const savedFooterText = localStorage.getItem('footerText');
    const savedPrimaryColor = localStorage.getItem('primaryColor');
    const savedSecondaryColor = localStorage.getItem('secondaryColor');

    if (savedProjectName) setProjectName(savedProjectName);
    if (savedManagerPassword) setManagerPassword(savedManagerPassword);
    if (savedHeaderText) setHeaderText(savedHeaderText);
    if (savedFooterText) setFooterText(savedFooterText);
    if (savedPrimaryColor) setPrimaryColor(savedPrimaryColor);
    if (savedSecondaryColor) setSecondaryColor(savedSecondaryColor);
  }, []);

  const handleSaveSettings = () => {
    // Sauvegarder les paramètres
    localStorage.setItem('projectName', projectName);
    localStorage.setItem('managerPassword', managerPassword);
    localStorage.setItem('headerText', headerText);
    localStorage.setItem('footerText', footerText);
    localStorage.setItem('primaryColor', primaryColor);
    localStorage.setItem('secondaryColor', secondaryColor);

    // Mettre à jour les variables CSS
    document.documentElement.style.setProperty('--cafe-navy', primaryColor);
    document.documentElement.style.setProperty('--cafe-bordeaux', secondaryColor);

    // Afficher un toast de confirmation
    toast({
      title: "Paramètres sauvegardés",
      description: "Les modifications ont été appliquées avec succès.",
    });

    // Déclencher un événement pour notifier les autres composants
    window.dispatchEvent(new CustomEvent('settingsUpdated'));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem('projectLogo', reader.result as string);
        toast({
          title: "Logo mis à jour",
          description: "Le nouveau logo a été appliqué.",
        });
        // Déclencher un événement pour notifier les autres composants
        window.dispatchEvent(new CustomEvent('logoUpdated'));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-cafe-cream">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="flex items-center mb-6">
          <Settings className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">Paramètres</h1>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="appearance">Apparence</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres généraux</CardTitle>
                <CardDescription>
                  Configurez les informations de base de votre établissement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Nom du projet</Label>
                  <div className="flex items-center space-x-2">
                    <Type className="h-4 w-4 text-gray-500" />
                    <Input
                      id="projectName"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Nom de votre établissement"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Logo</Label>
                  <div className="flex items-center space-x-2">
                    <Image className="h-4 w-4 text-gray-500" />
                    <Input
                      id="logo"
                      type="file"
                      ref={logoInputRef}
                      onChange={handleLogoChange}
                      accept="image/*"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => logoInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choisir
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headerText">En-tête des factures</Label>
                  <Textarea
                    id="headerText"
                    value={headerText}
                    onChange={(e) => setHeaderText(e.target.value)}
                    placeholder="Adresse, téléphone, email, etc."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="footerText">Pied de page des factures</Label>
                  <Textarea
                    id="footerText"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    placeholder="Messages de remerciement, informations légales, etc."
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Apparence</CardTitle>
                <CardDescription>
                  Personnalisez les couleurs et le style de l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Couleur principale</Label>
                  <div className="flex items-center space-x-2">
                    <Palette className="h-4 w-4 text-gray-500" />
                    <div className="flex-1 flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-md border"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <Input
                        id="primaryColor"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        placeholder="#1a3a5f"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Couleur secondaire</Label>
                  <div className="flex items-center space-x-2">
                    <Palette className="h-4 w-4 text-gray-500" />
                    <div className="flex-1 flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-md border"
                        style={{ backgroundColor: secondaryColor }}
                      />
                      <Input
                        id="secondaryColor"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        placeholder="#93293d"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>
                  Gérez les paramètres de sécurité et les accès
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="managerPassword">Mot de passe gérant</Label>
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4 text-gray-500" />
                    <Input
                      id="managerPassword"
                      type="password"
                      value={managerPassword}
                      onChange={(e) => setManagerPassword(e.target.value)}
                      placeholder="Mot de passe pour accès gérant"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ce mot de passe sera requis pour modifier les factures et effectuer la clôture journalière
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSaveSettings} className="px-6">
            <SaveIcon className="h-4 w-4 mr-2" />
            Enregistrer les paramètres
          </Button>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
