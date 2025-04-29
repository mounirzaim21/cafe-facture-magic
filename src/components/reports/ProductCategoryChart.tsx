
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProductCategoryChartProps {
  categoryStats: Record<string, { count: number; total: number }>;
}

const ProductCategoryChart: React.FC<ProductCategoryChartProps> = ({ categoryStats }) => {
  const chartData = Object.entries(categoryStats).map(([category, { count, total }]) => ({
    name: category,
    count,
    total
  }));

  return (
    <div>
      <div className="mb-4">
        {chartData.map((item) => (
          <div key={item.name} className="flex justify-between items-center mb-2">
            <span>{item.name}</span>
            <div className="text-right">
              <div className="font-medium">{formatCurrency(item.total)}</div>
              <div className="text-sm text-gray-500">{item.count} unité{item.count > 1 ? 's' : ''}</div>
            </div>
          </div>
        ))}
      </div>

      {chartData.length > 0 ? (
        <div className="h-[200px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value, name) => {
                if (name === "total") return formatCurrency(value as number);
                return value;
              }} />
              <Bar dataKey="total" fill="#6366f1" name="Montant" />
            </BarChart>
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

export default ProductCategoryChart;
