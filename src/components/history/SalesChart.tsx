
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Order } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface SalesChartProps {
  orders: Order[];
}

const SalesChart: React.FC<SalesChartProps> = ({ orders }) => {
  // Organiser les commandes par date
  const chartData = useMemo(() => {
    const dataMap = new Map<string, { date: string, value: number, count: number }>();
    
    // Trier les commandes par date
    const sortedOrders = [...orders].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    sortedOrders.forEach(order => {
      const orderDate = new Date(order.date);
      const dateStr = orderDate.toLocaleDateString('fr-FR');
      
      if (!dataMap.has(dateStr)) {
        dataMap.set(dateStr, { date: dateStr, value: 0, count: 0 });
      }
      
      const entry = dataMap.get(dateStr)!;
      entry.value += order.total;
      entry.count += 1;
    });
    
    return Array.from(dataMap.values());
  }, [orders]);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--cafe-navy)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--cafe-navy)" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11 }}
          />
          <YAxis 
            tickFormatter={(value) => `${value} €`}
            tick={{ fontSize: 11 }}
          />
          <Tooltip 
            formatter={(value: number) => [formatCurrency(value), 'Chiffre d\'affaires']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="var(--cafe-navy)" 
            fillOpacity={1} 
            fill="url(#colorValue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
