
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PaymentMethod } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PaymentMethodChartProps {
  paymentStats: Record<PaymentMethod, { count: number; total: number }>;
}

const COLORS = ['#4169E1', '#32CD32', '#FF8C00'];

const PaymentMethodChart: React.FC<PaymentMethodChartProps> = ({ paymentStats }) => {
  const chartData = [
    { name: 'Carte bancaire', value: paymentStats.card.total },
    { name: 'Espèces', value: paymentStats.cash.total },
    { name: 'Autre', value: paymentStats.other.total }
  ].filter(item => item.value > 0);

  const getTotalAmount = () => {
    return Object.values(paymentStats).reduce((sum, stat) => sum + stat.total, 0);
  };

  return (
    <div>
      <div className="mb-4">
        {Object.entries(paymentStats).map(([method, { count, total }], index) => {
          if (total === 0) return null;
          const methodName = 
            method === 'card' ? 'Carte bancaire' : 
            method === 'cash' ? 'Espèces' : 'Autre';
          return (
            <div key={method} className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 mr-2 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span>{methodName}</span>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatCurrency(total)}</div>
                <div className="text-sm text-gray-500">{count} commande{count > 1 ? 's' : ''}</div>
              </div>
            </div>
          );
        })}
      </div>
      
      {getTotalAmount() > 0 ? (
        <div className="h-[200px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
                label={({ name }) => name}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Aucune donnée disponible
        </div>
      )}
    </div>
  );
};

export default PaymentMethodChart;
