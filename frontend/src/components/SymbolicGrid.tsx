import React, { useEffect, useRef } from 'react';

export type CellValue = -1 | 0 | 1;

interface SymbolicGridProps {
  grid: CellValue[][];
  cellSize: number;
  onCellClick: (x: number, y: number) => void;
}

const colorMap: { [key: string]: string } = {
  "1": '#2196f3',    // blue for ⊕
  "0": '#111',       // black/neutral
  "-1": '#e53935',   // red for ⊖
};

export const SymbolicGrid: React.FC<SymbolicGridProps> = ({ grid, cellSize, onCellClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        ctx.fillStyle = colorMap[String(grid[y][x])];
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }, [grid, cellSize]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);
    onCellClick(x, y);
  };

  return (
    <canvas
      ref={canvasRef}
      width={grid[0].length * cellSize}
      height={grid.length * cellSize}
      style={{ border: '1px solid #444', cursor: 'pointer' }}
      onClick={handleCanvasClick}
    />
  );
};
