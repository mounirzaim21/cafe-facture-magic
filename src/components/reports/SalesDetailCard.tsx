
import React, { ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface SalesDetailCardProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

const SalesDetailCard: React.FC<SalesDetailCardProps> = ({ title, children, icon }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/20">
        <div className="flex items-center gap-2">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {children}
      </CardContent>
    </Card>
  );
};

export default SalesDetailCard;
