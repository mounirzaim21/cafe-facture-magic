
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface HistoryFiltersProps {
  startDate: string;
  endDate: string;
  searchTerm: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onSearchTermChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const HistoryFilters: React.FC<HistoryFiltersProps> = ({
  startDate,
  endDate,
  searchTerm,
  onStartDateChange,
  onEndDateChange,
  onSearchTermChange,
  onSearch,
  isLoading
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-0 md:flex md:items-end md:space-x-4">
          <div className="flex-1">
            <label htmlFor="startDate" className="block text-sm font-medium mb-1">
              Date de début
            </label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="flex-1">
            <label htmlFor="endDate" className="block text-sm font-medium mb-1">
              Date de fin
            </label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="flex-1 md:flex-2">
            <label htmlFor="searchTerm" className="block text-sm font-medium mb-1">
              Recherche
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="searchTerm"
                type="text"
                placeholder="Rechercher par produit ou facture..."
                value={searchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading} 
            loading={isLoading}
          >
            Rechercher
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default HistoryFilters;
