"use client";

import React from "react";
import { Cell } from "./cell";
import { GridNode } from "./algorithms/types";

interface GridProps {
  grid: GridNode[][];
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

export const Grid: React.FC<GridProps> = ({
  grid,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  const gridSize = grid[0]?.length || 0;

  return (
    <div
      className="grid gap-[1px] bg-gray-600 p-[1px] max-w-[90vw] max-h-[70vh] aspect-square mx-auto border-2 border-gray-800"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
      }}
    >
      {grid.map((row, rowIdx) =>
        row.map((node, colIdx) => (
          <Cell
            key={`${rowIdx}-${colIdx}`}
            row={rowIdx}
            col={colIdx}
            type={node.type}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseUp={onMouseUp}
          />
        ))
      )}
    </div>
  );
};
