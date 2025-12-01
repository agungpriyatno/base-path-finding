"use client";

import React from "react";
import { CellType } from "./algorithms/types";

interface CellProps {
  row: number;
  col: number;
  type: CellType;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

export const Cell: React.FC<CellProps> = ({
  row,
  col,
  type,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  const getCellClass = () => {
    const baseClass =
      "aspect-square transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg";

    switch (type) {
      case CellType.START:
        return `${baseClass} bg-emerald-500 animate-pulse`;
      case CellType.END:
        return `${baseClass} bg-red-500 animate-pulse`;
      case CellType.OBSTACLE:
        return `${baseClass} bg-gray-800 dark:bg-gray-200`;
      case CellType.VISITED:
        return `${baseClass} bg-blue-400 animate-in fade-in zoom-in duration-500`;
      case CellType.PATH:
        return `${baseClass} bg-primary animate-in zoom-in duration-500`;
      default:
        return `${baseClass} bg-background`;
    }
  };

  return (
    <div
      className={getCellClass()}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={onMouseUp}
    />
  );
};
