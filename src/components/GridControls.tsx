import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface GridControlsProps {
  rows: number;
  columns: number;
  gap: number;
  onRowsChange: (value: number) => void;
  onColumnsChange: (value: number) => void;
  onGapChange: (value: number) => void;
}

const GridControls: React.FC<GridControlsProps> = ({
  rows,
  columns,
  gap,
  onRowsChange,
  onColumnsChange,
  onGapChange,
}) => {
  return (
    <Card className="w-80 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Grid Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="rows" className="text-sm font-medium">
            Rows: {rows}
          </Label>
          <Slider
            id="rows"
            min={1}
            max={10}
            step={1}
            value={[rows]}
            onValueChange={(value) => onRowsChange(value[0])}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="columns" className="text-sm font-medium">
            Columns: {columns}
          </Label>
          <Slider
            id="columns"
            min={1}
            max={15}
            step={1}
            value={[columns]}
            onValueChange={(value) => onColumnsChange(value[0])}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gap" className="text-sm font-medium">
            Gap: {gap}px
          </Label>
          <Slider
            id="gap"
            min={0}
            max={20}
            step={2}
            value={[gap]}
            onValueChange={(value) => onGapChange(value[0])}
            className="w-full"
          />
        </div>

        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Instructions:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Click + to add keys</li>
            <li>• Drag keys to move them</li>
            <li>• Use corner handle to resize</li>
            <li>• Click × to delete keys</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default GridControls;