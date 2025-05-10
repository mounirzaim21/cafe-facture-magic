
import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  FileText, 
  Calendar, 
  Download, 
  Search, 
  Printer,
  FileExcel 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Order } from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getSalesHistory,
  getSalesHistoryByDateRange,
  exportSalesHistoryToCSV,
  calculateSalesStatistics,
  syncOrdersWithHistory
} from '@/services/historyService';
import { utils, writeFile } from 'xlsx';
import SalesStatisticsCard from '@/components/history/SalesStatisticsCard';
import SalesChart from '@/components/history/SalesChart';
import HistoryFilters from '@/components/history/HistoryFilters';

const SalesHistory: React.FC = () => {
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const { toast } = useToast();

  // Synchroniser avec l'historique au démarrage
  useEffect(() => {
    syncOrdersWithHistory();
    handleSearch();
  }, []);

  const handleSearch = () => {
    setIsLoading(true);
    
    try {
      const orders = getSalesHistoryByDateRange(startDate, endDate);
      
      // Filtrer par terme de recherche si présent
      const filtered = searchTerm
        ? orders.filter(order => 
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.items.some(item => 
              item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
        : orders;
      
      setFilteredOrders(filtered);
      
      toast({
        title: "Recherche effectuée",
        description: `${filtered.length} commandes trouvées.`,
      });
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la recherche.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    try {
      const csvContent = exportSalesHistoryToCSV(filteredOrders);
      
      if (!csvContent) {
        toast({
          title: "Export impossible",
          description: "Aucune donnée à exporter.",
          variant: "destructive",
        });
        return;
      }
      
      // Créer un Blob avec le contenu CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Créer un lien de téléchargement
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `historique-ventes-${startDate}-${endDate}.csv`);
      document.body.appendChild(link);
      
      // Déclencher le téléchargement
      link.click();
      
      // Nettoyer
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export réussi",
        description: "L'historique des ventes a été exporté avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'export.",
        variant: "destructive",
      });
    }
  };

  const handleExportExcel = () => {
    try {
      if (filteredOrders.length === 0) {
        toast({
          title: "Export impossible",
          description: "Aucune donnée à exporter.",
          variant: "destructive",
        });
        return;
      }

      // Créer les données pour l'export Excel
      const statistics = calculateSalesStatistics(filteredOrders);
      
      // Créer le livre Excel
      const wb = utils.book_new();
      
      // Créer la feuille des commandes
      const ordersData = filteredOrders.map(order => ({
        'Date': new Date(order.date).toLocaleDateString('fr-FR'),
        'Numéro de facture': order.id,
        'Articles': order.items.map(item => item.product.name).join(', '),
        'Quantités': order.items.map(item => item.quantity).join(', '),
        'Mode de paiement': order.paymentMethod === 'card' ? 'Carte bancaire' : 
                          order.paymentMethod === 'cash' ? 'Espèces' : 
                          order.paymentMethod === 'room_transfer' ? 'Transfer chambre' :
                          order.paymentMethod === 'free' ? 'Gratuité' : 'Autre',
        'Montant total': order.total
      }));
      const ordersSheet = utils.json_to_sheet(ordersData);
      utils.book_append_sheet(wb, ordersSheet, 'Commandes');
      
      // Créer la feuille des statistiques
      const statsData = statistics.productQuantities.map(item => ({
        'Produit': item.name,
        'Quantité vendue': item.quantity,
        'Montant total': item.total
      }));
      const statsSheet = utils.json_to_sheet(statsData);
      utils.book_append_sheet(wb, statsSheet, 'Statistiques');
      
      // Créer une feuille résumé
      const summaryData = [
        { 'Métrique': 'Période', 'Valeur': `${new Date(startDate).toLocaleDateString('fr-FR')} au ${new Date(endDate).toLocaleDateString('fr-FR')}` },
        { 'Métrique': 'Nombre total de commandes', 'Valeur': statistics.orderCount },
        { 'Métrique': 'Chiffre d\'affaires total', 'Valeur': statistics.totalRevenue },
        { 'Métrique': 'Panier moyen', 'Valeur': statistics.orderCount > 0 ? statistics.totalRevenue / statistics.orderCount : 0 }
      ];
      const summarySheet = utils.json_to_sheet(summaryData);
      utils.book_append_sheet(wb, summarySheet, 'Résumé');
      
      // Télécharger le fichier Excel
      writeFile(wb, `historique-ventes-${startDate}-${endDate}.xlsx`);
      
      toast({
        title: "Export Excel réussi",
        description: "L'historique des ventes a été exporté en format Excel avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de l'export Excel:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'export Excel.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Erreur",
        description: "Veuillez autoriser les popups pour l'impression",
        variant: "destructive",
      });
      return;
    }
    
    const statistics = calculateSalesStatistics(filteredOrders);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Historique des ventes</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          h1, h2 {
            margin-bottom: 16px;
          }
          .text-center {
            text-align: center;
          }
          .summary {
            margin-bottom: 30px;
          }
        </style>
      </head>
      <body>
        <h1 class="text-center">Historique des ventes</h1>
        <p class="text-center">Période du ${new Date(startDate).toLocaleDateString('fr-FR')} au ${new Date(endDate).toLocaleDateString('fr-FR')}</p>
        
        <div class="summary">
          <h2>Résumé</h2>
          <table>
            <tr>
              <td><strong>Nombre de commandes:</strong></td>
              <td>${statistics.orderCount}</td>
            </tr>
            <tr>
              <td><strong>Chiffre d'affaires total:</strong></td>
              <td>${formatCurrency(statistics.totalRevenue)}</td>
            </tr>
          </table>
        </div>

        <div>
          <h2>Détail des ventes par produit</h2>
          <table>
            <tr>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Montant total</th>
            </tr>
            ${statistics.productQuantities.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.total)}</td>
              </tr>
            `).join('')}
          </table>
        </div>

        <div>
          <h2>Détail des commandes</h2>
          <table>
            <tr>
              <th>Date</th>
              <th>Facture</th>
              <th>Produits</th>
              <th>Quantités</th>
              <th>Mode de paiement</th>
              <th>Total</th>
            </tr>
            ${filteredOrders.map(order => `
              <tr>
                <td>${new Date(order.date).toLocaleDateString('fr-FR')}</td>
                <td>${order.id}</td>
                <td>${order.items.map(item => item.product.name).join(', ')}</td>
                <td>${order.items.map(item => item.quantity).join(', ')}</td>
                <td>${
                  order.paymentMethod === 'card' ? 'Carte bancaire' :
                  order.paymentMethod === 'cash' ? 'Espèces' :
                  order.paymentMethod === 'room_transfer' ? 'Transfer chambre' :
                  order.paymentMethod === 'free' ? 'Gratuité' :
                  order.paymentMethod === 'other' ? 'Autre' : ''
                }</td>
                <td>${formatCurrency(order.total)}</td>
              </tr>
            `).join('')}
          </table>
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
  };

  // Calculer les statistiques pour les filtres actuels
  const statistics = calculateSalesStatistics(filteredOrders);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Historique des Ventes</h1>
        <div className="space-x-2">
          <Button
            onClick={handleExportExcel}
            disabled={filteredOrders.length === 0}
            variant="outline"
          >
            <FileExcel className="mr-2 h-4 w-4" />
            Exporter Excel
          </Button>
          <Button
            onClick={handleExportCSV}
            disabled={filteredOrders.length === 0}
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
          <Button
            onClick={handlePrint}
            disabled={filteredOrders.length === 0}
            variant="outline"
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
        </div>
      </div>

      <HistoryFilters
        startDate={startDate}
        endDate={endDate}
        searchTerm={searchTerm}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      {filteredOrders.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SalesStatisticsCard 
              title="Chiffre d'Affaires" 
              value={statistics.totalRevenue}
              icon={<FileText className="h-5 w-5" />}
              isCurrency
            />
            <SalesStatisticsCard 
              title="Nombre de Ventes" 
              value={statistics.orderCount} 
              icon={<Calendar className="h-5 w-5" />}
            />
            <SalesStatisticsCard 
              title="Panier Moyen" 
              value={statistics.orderCount > 0 ? statistics.totalRevenue / statistics.orderCount : 0}
              icon={<BarChart2 className="h-5 w-5" />}
              isCurrency
            />
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Évolution des Ventes</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesChart orders={filteredOrders} />
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Détail des Quantités Vendues</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statistics.productQuantities.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatCurrency(item.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Liste des Ventes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Facture</TableHead>
                    <TableHead>Articles</TableHead>
                    <TableHead>Mode de Paiement</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        {new Date(order.date).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index}>
                              {item.product.name} (x{item.quantity})
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.paymentMethod === 'card' && 'Carte bancaire'}
                        {order.paymentMethod === 'cash' && 'Espèces'}
                        {order.paymentMethod === 'room_transfer' && 'Transfer chambre'}
                        {order.paymentMethod === 'free' && 'Gratuité'}
                        {order.paymentMethod === 'other' && 'Autre'}
                      </TableCell>
                      <TableCell>{formatCurrency(order.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="mt-6">
          <CardContent className="p-6 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-medium mb-2">Aucune vente trouvée</h2>
            <p className="text-muted-foreground">
              Aucune vente ne correspond à vos critères de recherche. Veuillez essayer d'autres dates ou termes de recherche.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SalesHistory;
