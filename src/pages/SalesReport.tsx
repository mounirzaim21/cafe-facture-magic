import React, { useState, useEffect, useRef } from 'react';
import { Save, BarChart2, CreditCard, CircleDollarSign, CalendarClock, Receipt, Trash2, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { DailySummary, Order, SalesReport as SalesReportType } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { 
  getDailySummary, 
  saveDailySummary, 
  closeDailyOperations, 
  generateSalesReport,
  getPaymentMethodStats,
  getProductCategoryStats,
  getDailyTransactions,
  resetOrderStore,
  getLastDailyCloseReport
} from '@/services/reportService';
import SalesDetailCard from '@/components/reports/SalesDetailCard';
import PaymentMethodChart from '@/components/reports/PaymentMethodChart';
import ProductCategoryChart from '@/components/reports/ProductCategoryChart';
import MainCourtReport from '@/components/reports/MainCourtReport';

const SalesReportPage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState({
    save: false,
    close: false,
    report: false
  });
  const [activeTab, setActiveTab] = useState('reports');
  const mainCourtReportRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    const summary = getDailySummary();
    setDailySummary(summary);
    
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
    
    handleGenerateReport(today, today);
  }, []);

  useEffect(() => {
    const handleOrderCompleted = () => {
      console.log("Order completed event detected, refreshing report data");
      
      const summary = getDailySummary();
      setDailySummary(summary);
      
      if (startDate && endDate) {
        generateSalesReport(startDate, endDate)
          .then(results => {
            setOrders(results);
            console.log("Report data refreshed with new orders:", results);
          })
          .catch(error => {
            console.error("Error refreshing report data:", error);
          });
      }
    };
    
    window.addEventListener('orderCompleted', handleOrderCompleted);
    
    const handleFocus = () => {
      console.log("Window focused, refreshing data");
      handleOrderCompleted();
    };
    window.addEventListener('focus', handleFocus);
    
    const interval = setInterval(handleOrderCompleted, 30000);
    
    return () => {
      window.removeEventListener('orderCompleted', handleOrderCompleted);
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [startDate, endDate]);

  const calculateTotalQuantities = (orders: Order[]) => {
    const totalQuantities: Record<string, { name: string; quantity: number }> = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.product.id;
        if (!totalQuantities[productId]) {
          totalQuantities[productId] = {
            name: item.product.name,
            quantity: 0
          };
        }
        totalQuantities[productId].quantity += item.quantity;
      });
    });

    return Object.values(totalQuantities);
  };

  const handleDailyClose = async () => {
    setIsLoading(prev => ({ ...prev, close: true }));
    try {
      const success = await closeDailyOperations();
      if (success) {
        const closeDate = new Date();
        
        toast({
          title: "Clôture journalière réussie",
          description: `Les données ont été clôturées le ${closeDate.toLocaleDateString()} à ${closeDate.toLocaleTimeString()}.`,
        });
        
        const newSummary = getDailySummary();
        setDailySummary(newSummary);
        
        setOrders([]);
        
        handlePrintDailyReport();
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de clôturer la journée.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, close: false }));
    }
  };

  const handleDailySave = async () => {
    setIsLoading(prev => ({ ...prev, save: true }));
    try {
      const success = await saveDailySummary();
      if (success) {
        toast({
          title: "Sauvegarde effectuée",
          description: "Toutes les opérations de la journée ont été sauvegardées avec succès.",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les données.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, save: false }));
    }
  };

  const handleGenerateReport = async (start: string = startDate, end: string = endDate) => {
    if (!start || !end) {
      toast({
        title: "Dates manquantes",
        description: "Veuillez sélectionner les dates de début et de fin.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(prev => ({ ...prev, report: true }));
    try {
      const results = await generateSalesReport(start, end);
      setOrders(results);
      toast({
        title: "Rapport généré",
        description: `Rapport du ${start} au ${end} généré avec succès.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le rapport.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(prev => ({ ...prev, report: false }));
    }
  };

  const paymentStats = getPaymentMethodStats();
  const categoryStats = getProductCategoryStats();
  const transactions = getDailyTransactions();

  const handleReset = async () => {
    try {
      resetOrderStore();
      const summary = getDailySummary();
      setDailySummary(summary);
      setOrders([]);
      toast({
        title: "Réinitialisation effectuée",
        description: "Toutes les données du rapport ont été effacées.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de réinitialiser les données.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = (elementId: string) => {
    const printContent = document.getElementById(elementId);
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast({
          title: "Erreur",
          description: "Veuillez autoriser les popups pour l'impression",
          variant: "destructive",
        });
        return;
      }
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Rapport</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            .print-a4 {
              width: 210mm;
              padding: 10mm;
              margin: 0 auto;
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
          </style>
        </head>
        <body>
          <div class="print-a4">
            <h1 class="text-center">Moni_Point de Vente</h1>
            ${printContent.innerHTML}
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
  
  const handlePrintDailyReport = () => {
    const reportData = getLastDailyCloseReport();
    if (!reportData) {
      toast({
        title: "Erreur",
        description: "Aucun rapport de clôture disponible.",
        variant: "destructive",
      });
      return;
    }
    
    const closeDate = new Date(reportData.closeDate);
    const quantities = calculateTotalQuantities(reportData.orders || []);
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Erreur",
        description: "Veuillez autoriser les popups pour l'impression",
        variant: "destructive",
      });
      return;
    }
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Rapport de Clôture</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
          }
          .print-a4 {
            width: 210mm;
            padding: 10mm;
            margin: 0 auto;
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
          .mb-4 {
            margin-bottom: 16px;
          }
        </style>
      </head>
      <body>
        <div class="print-a4">
          <h1 class="text-center">Rapport de Clôture Journalière</h1>
          <p class="text-center mb-4">Moni_Point de Vente</p>
          <p class="text-center mb-4">Date: ${closeDate.toLocaleDateString()} - Heure: ${closeDate.toLocaleTimeString()}</p>
          
          <div class="mb-4">
            <h2>Résumé des ventes</h2>
            <p>Chiffre d'affaires total: ${formatCurrency(reportData.summary?.totalRevenue || 0)}</p>
            <p>Nombre de commandes: ${reportData.summary?.orderCount || 0}</p>
          </div>
          
          <div class="mb-4">
            <h2>Détail des articles vendus</h2>
            <table>
              <tr>
                <th style="text-align:left">Article</th>
                <th style="text-align:right">Quantité</th>
              </tr>
              ${quantities.map((item) => `
                <tr>
                  <td style="text-align:left">${item.name}</td>
                  <td style="text-align:right">${item.quantity}</td>
                </tr>
              `).join('')}
            </table>
          </div>
          
          <div>
            <h2>Transactions du jour</h2>
            <table>
              <tr>
                <th style="text-align:left">Facture</th>
                <th style="text-align:left">Table</th>
                <th style="text-align:right">Montant</th>
                <th style="text-align:left">Mode</th>
              </tr>
              ${(reportData.transactions || []).map((tx) => `
                <tr>
                  <td style="text-align:left">${tx.invoiceNumber}</td>
                  <td style="text-align:left">${tx.tableNumber || '-'}</td>
                  <td style="text-align:right">${formatCurrency(tx.totalAmount)}</td>
                  <td style="text-align:left">${
                    tx.paymentMethod === 'card' ? 'Carte' : 
                    tx.paymentMethod === 'cash' ? 'Espèces' :
                    tx.paymentMethod === 'room_transfer' ? 'Chambre' :
                    tx.paymentMethod === 'free' ? 'Gratuité' : 'Autre'
                  }</td>
                </tr>
              `).join('')}
            </table>
          </div>
          
          <div class="text-center" style="margin-top: 30px;">
            <p>*** Fin du rapport ***</p>
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
  };

  const handlePrintMainCourt = () => {
    if (mainCourtReportRef.current) {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast({
          title: "Erreur",
          description: "Veuillez autoriser les popups pour l'impression",
          variant: "destructive",
        });
        return;
      }
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Main Courante</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            .print-a4 {
              width: 210mm;
              padding: 10mm;
              margin: 0 auto;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              padding: 8px;
              text-align: left;
              border: 1px solid #ddd;
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            h1, h2 {
              text-align: center;
              margin-bottom: 16px;
            }
            .text-right {
              text-align: right;
            }
            .subheader {
              text-align: center;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="print-a4">
            <h1>Main Courante</h1>
            ${mainCourtReportRef.current.innerHTML}
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
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vente/Prestation</h1>
        <div className="space-x-4">
          <Button 
            variant="destructive"
            onClick={handleReset}
            className="mr-4"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Effacer les données
          </Button>
          <Button 
            onClick={handleDailySave} 
            disabled={isLoading.save}
            loading={isLoading.save}
          >
            <Save className="mr-2 h-4 w-4" />
            Sauvegarde Journalière
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDailyClose}
            disabled={isLoading.close}
            loading={isLoading.close}
          >
            <CalendarClock className="mr-2 h-4 w-4" />
            Clôture Journalière
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <Button
            variant={activeTab === 'reports' ? "default" : "outline"}
            onClick={() => setActiveTab('reports')}
          >
            <BarChart2 className="mr-2 h-4 w-4" />
            Rapports
          </Button>
          <Button
            variant={activeTab === 'transactions' ? "default" : "outline"}
            onClick={() => setActiveTab('transactions')}
          >
            <Receipt className="mr-2 h-4 w-4" />
            Main Courante
          </Button>
        </div>
      </div>

      {activeTab === 'reports' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Chiffre d'Affaires Journalier</h2>
              {dailySummary ? (
                <div className="space-y-4">
                  <p className="text-3xl font-bold text-green-600">
                    {formatCurrency(dailySummary.totalRevenue)}
                  </p>
                  <p className="text-gray-600">
                    Nombre de commandes: {dailySummary.orderCount}
                  </p>
                  {dailySummary.isClosed && (
                    <p className="text-blue-600 font-medium">
                      Journée clôturée
                    </p>
                  )}
                </div>
              ) : (
                <p>Chargement des données...</p>
              )}
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Historique des Ventes</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => handleGenerateReport()}
                  disabled={isLoading.report}
                  loading={isLoading.report}
                >
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Générer Rapport
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <SalesDetailCard 
              title="Détail par Mode de Règlement" 
              icon={<CreditCard className="h-5 w-5 text-blue-500" />}
            >
              <PaymentMethodChart paymentStats={paymentStats} />
            </SalesDetailCard>

            <SalesDetailCard 
              title="Détail des Prestations Vendues" 
              icon={<CircleDollarSign className="h-5 w-5 text-green-500" />}
            >
              <ProductCategoryChart categoryStats={categoryStats} />
            </SalesDetailCard>
          </div>

          <div className="mt-6 space-y-6">
            {orders.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Quantités Totales Vendues</h2>
                  <Button onClick={() => handlePrint('quantities-report')} variant="outline">
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimer
                  </Button>
                </div>
                <div id="quantities-report">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Article</TableHead>
                        <TableHead>Quantité Totale</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {calculateTotalQuantities(orders).map((item) => (
                        <TableRow key={item.name}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {dailySummary?.isClosed && (
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Rapport de Clôture</h2>
                  <Button onClick={handlePrintDailyReport} variant="outline">
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimer Rapport
                  </Button>
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold mb-4">Détail des Commandes</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Articles</TableHead>
                    <TableHead>Quantités</TableHead>
                    <TableHead>Mode de Paiement</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          {new Date(order.date).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index}>{item.product.name}</div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index}>{item.quantity}</div>
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
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                        Aucune donnée disponible. Veuillez générer un rapport.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Main Courante</CardTitle>
            <Button onClick={handlePrintMainCourt} variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
          </CardHeader>
          <CardContent>
            <MainCourtReport 
              transactions={transactions} 
              startDate={new Date()}
              endDate={new Date()}
              printRef={mainCourtReportRef}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SalesReportPage;
