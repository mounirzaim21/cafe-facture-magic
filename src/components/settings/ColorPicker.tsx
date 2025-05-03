
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const colors = [
  '#1a3a5f', // cafe-navy
  '#93293d', // cafe-bordeaux
  '#2563eb', // blue-600
  '#16a34a', // green-600
  '#ca8a04', // yellow-600
  '#dc2626', // red-600
  '#9333ea', // purple-600
  '#0891b2', // cyan-600
  '#475569', // slate-600
  '#000000', // black
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-12 h-8 p-0 border-2"
          style={{ backgroundColor: value }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid grid-cols-5 gap-2">
          {colors.map((colorOption) => (
            <Button
              key={colorOption}
              className="w-8 h-8 p-0 rounded-md"
              style={{ backgroundColor: colorOption }}
              onClick={() => onChange(colorOption)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
