
import React from 'react';
import { formatCurrency } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from 'date-fns';

interface MainCourtTransaction {
  id: string;
  invoiceNumber: string;
  tableNumber?: number;
  roomNumber?: string;
  server: string;
  operator: string;
  totalFood: number;
  totalDrinks: number;
  totalOther: number;
  totalAmount: number;
  paymentMethod: string;
  date: Date;
}

interface MainCourtReportProps {
  transactions: MainCourtTransaction[];
  startDate?: Date;
  endDate?: Date;
  printRef?: React.RefObject<HTMLDivElement>;
}

const MainCourtReport: React.FC<MainCourtReportProps> = ({ 
  transactions, 
  startDate = new Date(), 
  endDate = new Date(),
  printRef
}) => {
  // Grouper les transactions par mode de paiement
  const paymentGroups = React.useMemo(() => {
    const groups: Record<string, {
      transactions: MainCourtTransaction[],
      total: number
    }> = {};
    
    transactions.forEach(transaction => {
      const paymentMethod = transaction.paymentMethod;
      const paymentMethodLabel = 
        paymentMethod === 'card' ? 'CARTE DE CRÉDIT' :
        paymentMethod === 'cash' ? 'ESPÈCE' :
        paymentMethod === 'room_transfer' ? 'TRANSFERT HÔTEL' :
        paymentMethod === 'free' ? 'GRATUITÉ' : 'AUTRE';
      
      if (!groups[paymentMethodLabel]) {
        groups[paymentMethodLabel] = {
          transactions: [],
          total: 0
        };
      }
      
      groups[paymentMethodLabel].transactions.push(transaction);
      groups[paymentMethodLabel].total += transaction.totalAmount;
    });
    
    return groups;
  }, [transactions]);

  // Calculer le total général
  const grandTotal = React.useMemo(() => {
    return Object.values(paymentGroups).reduce((total, group) => total + group.total, 0);
  }, [paymentGroups]);
  
  // Calculer le nombre total de factures
  const invoiceCount = transactions.length;

  // Formater les dates
  const formattedStartDate = formatDate(startDate, 'dd/MM/yyyy');
  const formattedEndDate = formatDate(endDate, 'dd/MM/yyyy');
  const currentDate = formatDate(new Date(), 'dd/MM/yyyy à HH:mm:ss');

  return (
    <Card className="mb-6">
      <CardHeader className="border-b">
        <CardTitle className="text-center text-xl">Main Courante</CardTitle>
        <div className="text-center text-sm">
          <span>De: {formattedStartDate}</span>
          <span className="mx-2">Au: {formattedEndDate}</span>
        </div>
        <div className="text-sm mt-2">
          <div>HÔTEL FESTIN</div>
          <div>Date d'édition: {currentDate}</div>
          <div>Point de Vente: SNACK FES INN</div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div ref={printRef}>
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead className="border">Facture</TableHead>
                <TableHead className="border">Table</TableHead>
                <TableHead className="border">Chbre</TableHead>
                <TableHead className="border">Cpt</TableHead>
                <TableHead className="border">Serveur</TableHead>
                <TableHead className="border">Opérateur</TableHead>
                <TableHead className="border">Comment</TableHead>
                <TableHead className="border text-right">Total Nour</TableHead>
                <TableHead className="border text-right">Total Bois</TableHead>
                <TableHead className="border text-right">Total Div.</TableHead>
                <TableHead className="border text-right">Total TTC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(paymentGroups).map(([paymentMethod, group]) => (
                <React.Fragment key={paymentMethod}>
                  {group.transactions.map((transaction, index) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="border">{transaction.invoiceNumber}</TableCell>
                      <TableCell className="border">{transaction.tableNumber || ''}</TableCell>
                      <TableCell className="border">{transaction.roomNumber || ''}</TableCell>
                      <TableCell className="border"></TableCell>
                      <TableCell className="border">{transaction.server}</TableCell>
                      <TableCell className="border">{transaction.operator}</TableCell>
                      <TableCell className="border"></TableCell>
                      <TableCell className="border text-right">{formatCurrency(transaction.totalFood)}</TableCell>
                      <TableCell className="border text-right">{formatCurrency(transaction.totalDrinks)}</TableCell>
                      <TableCell className="border text-right">{formatCurrency(transaction.totalOther)}</TableCell>
                      <TableCell className="border text-right">{formatCurrency(transaction.totalAmount)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={7} className="border font-medium">
                      Sous-Total : {paymentMethod}
                    </TableCell>
                    <TableCell colSpan={3} className="border text-right">
                      {group.transactions.length}
                    </TableCell>
                    <TableCell className="border text-right font-medium">
                      {formatCurrency(group.total)}
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
              <TableRow>
                <TableCell colSpan={7} className="border font-bold">
                  Nombre de factures: {invoiceCount}
                </TableCell>
                <TableCell colSpan={3} className="border text-right font-bold">
                  Totaux:
                </TableCell>
                <TableCell className="border text-right font-bold">
                  {formatCurrency(grandTotal)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MainCourtReport;
