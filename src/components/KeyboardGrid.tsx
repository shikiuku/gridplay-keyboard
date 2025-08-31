import React, { useState, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';

interface KeyElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

interface KeyboardGridProps {
  rows: number;
  columns: number;
  gap: number;
}

const KeyboardGrid: React.FC<KeyboardGridProps> = ({ rows, columns, gap }) => {
  const [keys, setKeys] = useState<KeyElement[]>([]);
  const [draggedKey, setDraggedKey] = useState<string | null>(null);
  const [resizingKey, setResizingKey] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);

  const cellSize = 60;
  const gridWidth = columns * cellSize + (columns - 1) * gap;
  const gridHeight = rows * cellSize + (rows - 1) * gap;

  const addKey = useCallback((gridX: number, gridY: number) => {
    const newKey: KeyElement = {
      id: `key-${Date.now()}`,
      x: gridX,
      y: gridY,
      width: 1,
      height: 1,
      label: 'Key',
    };
    setKeys(prev => [...prev, newKey]);
  }, []);

  const removeKey = useCallback((keyId: string) => {
    setKeys(prev => prev.filter(key => key.id !== keyId));
  }, []);

  const updateKey = useCallback((keyId: string, updates: Partial<KeyElement>) => {
    setKeys(prev => prev.map(key => 
      key.id === keyId ? { ...key, ...updates } : key
    ));
  }, []);

  const handleMouseDown = (e: React.MouseEvent, keyId: string, action: 'drag' | 'resize') => {
    e.preventDefault();
    const rect = gridRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (action === 'drag') {
      setDraggedKey(keyId);
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    } else {
      setResizingKey(keyId);
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();

    if (draggedKey) {
      const x = Math.max(0, Math.min(columns - 1, Math.floor((e.clientX - rect.left - dragOffset.x + cellSize / 2) / (cellSize + gap))));
      const y = Math.max(0, Math.min(rows - 1, Math.floor((e.clientY - rect.top - dragOffset.y + cellSize / 2) / (cellSize + gap))));
      updateKey(draggedKey, { x, y });
    }

    if (resizingKey) {
      const key = keys.find(k => k.id === resizingKey);
      if (key) {
        const keyStartX = key.x * (cellSize + gap);
        const keyStartY = key.y * (cellSize + gap);
        const newWidth = Math.max(1, Math.ceil((e.clientX - rect.left - keyStartX) / (cellSize + gap)));
        const newHeight = Math.max(1, Math.ceil((e.clientY - rect.top - keyStartY) / (cellSize + gap)));
        updateKey(resizingKey, { 
          width: Math.min(newWidth, columns - key.x),
          height: Math.min(newHeight, rows - key.y)
        });
      }
    }
  }, [draggedKey, resizingKey, keys, columns, rows, cellSize, gap, dragOffset, updateKey]);

  const handleMouseUp = useCallback(() => {
    setDraggedKey(null);
    setResizingKey(null);
  }, []);

  React.useEffect(() => {
    if (draggedKey || resizingKey) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedKey, resizingKey, handleMouseMove, handleMouseUp]);

  const getOccupiedCells = () => {
    const occupied = new Set<string>();
    keys.forEach(key => {
      for (let x = key.x; x < key.x + key.width; x++) {
        for (let y = key.y; y < key.y + key.height; y++) {
          occupied.add(`${x}-${y}`);
        }
      }
    });
    return occupied;
  };

  const occupiedCells = getOccupiedCells();

  return (
    <div className="flex justify-center items-start bg-background p-4">
      <div
        ref={gridRef}
        className="relative bg-grid-bg border border-grid-border rounded-lg p-4"
        style={{ 
          width: gridWidth + 32, 
          height: gridHeight + 32,
          backgroundImage: `
            linear-gradient(to right, hsl(var(--grid-border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--grid-border)) 1px, transparent 1px)
          `,
          backgroundSize: `${cellSize + gap}px ${cellSize + gap}px`,
          backgroundPosition: '16px 16px'
        }}
      >
        {/* Grid cells with add buttons */}
        {Array.from({ length: rows }, (_, y) =>
          Array.from({ length: columns }, (_, x) => {
            const isOccupied = occupiedCells.has(`${x}-${y}`);
            return (
              <button
                key={`${x}-${y}`}
                className={`absolute border-2 border-dashed transition-all duration-200 ${
                  isOccupied 
                    ? 'border-transparent' 
                    : 'border-grid-border hover:border-grid-add-hover hover:bg-grid-add-hover/10'
                }`}
                style={{
                  left: 16 + x * (cellSize + gap),
                  top: 16 + y * (cellSize + gap),
                  width: cellSize,
                  height: cellSize,
                }}
                onClick={() => !isOccupied && addKey(x, y)}
                disabled={isOccupied}
              >
                {!isOccupied && (
                  <span className="text-2xl text-muted-foreground hover:text-grid-add-hover transition-colors">
                    +
                  </span>
                )}
              </button>
            );
          })
        )}

        {/* Key elements */}
        {keys.map(key => (
          <Card
            key={key.id}
            className="absolute bg-key-bg border-key-border shadow-lg cursor-move select-none"
            style={{
              left: 16 + key.x * (cellSize + gap),
              top: 16 + key.y * (cellSize + gap),
              width: key.width * cellSize + (key.width - 1) * gap,
              height: key.height * cellSize + (key.height - 1) * gap,
            }}
            onMouseDown={(e) => handleMouseDown(e, key.id, 'drag')}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <span className="text-foreground font-medium text-sm">
                {key.label}
              </span>
              
              {/* Delete button */}
              <button
                className="absolute top-1 right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full text-xs leading-none opacity-0 hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  removeKey(key.id);
                }}
              >
                ×
              </button>

              {/* Resize handle */}
              <div
                className="absolute bottom-0 right-0 w-3 h-3 bg-resize-handle cursor-se-resize opacity-0 hover:opacity-100 transition-opacity"
                style={{
                  borderRadius: '0 0 8px 0',
                  clipPath: 'polygon(100% 0, 100% 100%, 0 100%)'
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  handleMouseDown(e, key.id, 'resize');
                }}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default KeyboardGrid;