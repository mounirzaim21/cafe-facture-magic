
import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface SalesStatisticsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  isCurrency?: boolean;
}

const SalesStatisticsCard: React.FC<SalesStatisticsCardProps> = ({
  title,
  value,
  icon,
  isCurrency = false
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
        <p className="text-2xl font-bold">
          {isCurrency ? formatCurrency(value) : value.toLocaleString('fr-FR')}
        </p>
      </CardContent>
    </Card>
  );
};

export default SalesStatisticsCard;
