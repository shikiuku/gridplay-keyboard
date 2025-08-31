import React, { useState } from 'react';
import KeyboardGrid from '@/components/KeyboardGrid';
import GridControls from '@/components/GridControls';

const Index = () => {
  const [rows, setRows] = useState(5);
  const [columns, setColumns] = useState(12);
  const [gap, setGap] = useState(4);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Keyboard Layout Editor
          </h1>
          <p className="text-muted-foreground">
            Create and customize your keyboard layout with drag & drop
          </p>
        </header>

        <div className="flex gap-8 items-start justify-center">
          <GridControls
            rows={rows}
            columns={columns}
            gap={gap}
            onRowsChange={setRows}
            onColumnsChange={setColumns}
            onGapChange={setGap}
          />
          
          <KeyboardGrid
            rows={rows}
            columns={columns}
            gap={gap}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
