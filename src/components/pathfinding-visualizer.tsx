"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Grid } from "./grid";
import { ControlPanel } from "./control-panel";
import {
  Algorithm,
  CellType,
  GridNode,
  Node,
  EndPoint,
} from "./algorithms/types";
import { initializeGrid, resetGrid } from "./algorithms/utils";
import { dijkstra } from "./algorithms/dijkstra";
import { astar } from "./algorithms/astar";
import { EndPointNameModal } from "./end-point-name-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const DEFAULT_GRID_SIZE = 40;
const DEFAULT_START_ROW = 5;
const DEFAULT_START_COL = 5;
const DEFAULT_ENDPOINTS: EndPoint[] = [
  { id: 1, name: "Destination 1", row: 30, col: 30 },
];

export const PathfindingVisualizer: React.FC = () => {
  const [gridSize, setGridSize] = useState(DEFAULT_GRID_SIZE);
  const [algorithm, setAlgorithm] = useState<Algorithm>("astar");
  const [grid, setGrid] = useState<Node[][]>([]);
  const [displayGrid, setDisplayGrid] = useState<GridNode[][]>([]);
  const [isMousePressed, setIsMousePressed] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(25);
  const [interactionMode, setInteractionMode] = useState<
    "obstacle" | "start" | "end" | null
  >(null);
  const [startNode, setStartNode] = useState({
    row: DEFAULT_START_ROW,
    col: DEFAULT_START_COL,
  });
  const [endPoints, setEndPoints] = useState<EndPoint[]>(DEFAULT_ENDPOINTS);
  const [selectedEndPointId, setSelectedEndPointId] = useState<number>(1);
  const [pendingEndPoint, setPendingEndPoint] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nextEndPointId, setNextEndPointId] = useState(2);

  // Initialize grid
  useEffect(() => {
    const newGrid = initializeGrid(gridSize, gridSize);

    // Set start node
    const startRow = Math.min(startNode.row, gridSize - 1);
    const startCol = Math.min(startNode.col, gridSize - 1);
    newGrid[startRow][startCol].isStart = true;
    setStartNode({ row: startRow, col: startCol });

    // Set all endpoints
    const updatedEndPoints = endPoints.map((endpoint) => {
      const row = Math.min(endpoint.row, gridSize - 1);
      const col = Math.min(endpoint.col, gridSize - 1);
      newGrid[row][col].isEnd = true;
      return { ...endpoint, row, col };
    });
    setEndPoints(updatedEndPoints);

    setGrid(newGrid);
    updateDisplayGrid(newGrid);
  }, [gridSize]);

  const updateDisplayGrid = useCallback((nodeGrid: Node[][]) => {
    const newDisplayGrid: GridNode[][] = nodeGrid.map((row) =>
      row.map((node) => {
        let type = CellType.NORMAL;
        if (node.isStart) type = CellType.START;
        else if (node.isEnd) type = CellType.END;
        else if (node.isObstacle) type = CellType.OBSTACLE;

        return {
          row: node.row,
          col: node.col,
          type,
        };
      })
    );
    setDisplayGrid(newDisplayGrid);
  }, []);

  const handleMouseDown = useCallback(
    (row: number, col: number) => {
      if (isRunning) return;

      // If no interaction mode selected, do nothing
      if (!interactionMode) return;

      setIsMousePressed(true);
      const node = grid[row][col];
      const newGrid = grid.map((r) => r.map((n) => ({ ...n })));

      if (interactionMode === "start") {
        // Don't place on obstacles or end node
        if (node.isObstacle || node.isEnd) return;

        // Clear old start position
        newGrid[startNode.row][startNode.col].isStart = false;
        // Set new start position
        newGrid[row][col].isStart = true;
        setStartNode({ row, col });

        // Reset to no mode
        setInteractionMode(null);
      } else if (interactionMode === "end") {
        // Don't place on obstacles or start node
        if (node.isObstacle || node.isStart) return;

        // Store pending endpoint location and open modal
        setPendingEndPoint({ row, col });
        setIsModalOpen(true);
        return; // Don't update grid yet
      } else if (interactionMode === "obstacle") {
        // Obstacle mode - don't toggle on start or end nodes
        if (node.isStart || node.isEnd) return;
        newGrid[row][col].isObstacle = !node.isObstacle;
      }

      setGrid(newGrid);
      updateDisplayGrid(newGrid);
    },
    [grid, updateDisplayGrid, isRunning, interactionMode, startNode]
  );

  const handleMouseEnter = useCallback(
    (row: number, col: number) => {
      if (!isMousePressed) return;
      if (interactionMode !== "obstacle") return; // Only draw in obstacle mode

      const node = grid[row][col];
      // Don't draw on start/end nodes
      if (node.isStart || node.isEnd) return;

      // Draw obstacles
      const newGrid = grid.map((r) => r.map((n) => ({ ...n })));
      newGrid[row][col].isObstacle = true;
      setGrid(newGrid);
      updateDisplayGrid(newGrid);
    },
    [grid, isMousePressed, updateDisplayGrid, interactionMode]
  );

  const handleMouseUp = useCallback(() => {
    setIsMousePressed(false);
  }, []);

  // Handle endpoint name modal submission
  const handleEndPointSubmit = useCallback(
    (name: string) => {
      if (!pendingEndPoint) return;

      const newEndPoint: EndPoint = {
        id: nextEndPointId,
        name,
        row: pendingEndPoint.row,
        col: pendingEndPoint.col,
      };

      const newGrid = grid.map((r) => r.map((n) => ({ ...n })));
      newGrid[pendingEndPoint.row][pendingEndPoint.col].isEnd = true;

      setEndPoints([...endPoints, newEndPoint]);
      setSelectedEndPointId(newEndPoint.id);
      setNextEndPointId(nextEndPointId + 1);
      setPendingEndPoint(null);
      setIsModalOpen(false);
      setInteractionMode(null); // Reset to no mode

      setGrid(newGrid);
      updateDisplayGrid(newGrid);
    },
    [pendingEndPoint, nextEndPointId, endPoints, grid, updateDisplayGrid]
  );

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setPendingEndPoint(null);
    setInteractionMode(null); // Reset to no mode
  }, []);

  const handleDeleteEndPoint = useCallback(
    (id: number) => {
      if (endPoints.length <= 1) {
        alert("You must have at least one endpoint!");
        return;
      }

      const endPointToDelete = endPoints.find((ep) => ep.id === id);
      if (!endPointToDelete) return;

      const newGrid = grid.map((r) => r.map((n) => ({ ...n })));
      newGrid[endPointToDelete.row][endPointToDelete.col].isEnd = false;

      const newEndPoints = endPoints.filter((ep) => ep.id !== id);
      setEndPoints(newEndPoints);

      // If deleted was selected, select the first remaining
      if (selectedEndPointId === id) {
        setSelectedEndPointId(newEndPoints[0].id);
      }

      setGrid(newGrid);
      updateDisplayGrid(newGrid);
    },
    [endPoints, selectedEndPointId, grid, updateDisplayGrid]
  );

  const animateAlgorithm = useCallback(
    (visitedNodes: Node[], shortestPath: Node[]) => {
      // Animate visited nodes
      for (let i = 0; i < visitedNodes.length; i++) {
        setTimeout(() => {
          const node = visitedNodes[i];
          if (!node.isStart && !node.isEnd) {
            setDisplayGrid((prevGrid) => {
              const newGrid = prevGrid.map((row) => [...row]);
              newGrid[node.row][node.col].type = CellType.VISITED;
              return newGrid;
            });
          }

          // Animate shortest path after all nodes are visited
          if (i === visitedNodes.length - 1) {
            setTimeout(() => {
              for (let j = 0; j < shortestPath.length; j++) {
                setTimeout(() => {
                  const pathNode = shortestPath[j];
                  if (!pathNode.isStart && !pathNode.isEnd) {
                    setDisplayGrid((prevGrid) => {
                      const newGrid = prevGrid.map((row) => [...row]);
                      newGrid[pathNode.row][pathNode.col].type = CellType.PATH;
                      return newGrid;
                    });
                  }

                  if (j === shortestPath.length - 1) {
                    setIsRunning(false);
                  }
                }, j * (50 - animationSpeed));
              }

              if (shortestPath.length === 0) {
                setIsRunning(false);
                alert("No path found!");
              }
            }, 100);
          }
        }, i * (50 - animationSpeed));
      }
    },
    [animationSpeed]
  );

  const handleStartClick = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);

    // Reset grid for new run
    const newGrid = grid.map((row) => row.map((node) => ({ ...node })));
    resetGrid(newGrid);
    updateDisplayGrid(newGrid);

    // Find selected endpoint
    const selectedEndPoint = endPoints.find(
      (ep) => ep.id === selectedEndPointId
    );
    if (!selectedEndPoint) {
      setIsRunning(false);
      alert("No endpoint selected!");
      return;
    }

    // Run algorithm with selected endpoint
    const start = newGrid[startNode.row][startNode.col];
    const end = newGrid[selectedEndPoint.row][selectedEndPoint.col];

    const result =
      algorithm === "astar"
        ? astar(newGrid, start, end)
        : dijkstra(newGrid, start, end);

    animateAlgorithm(result.visitedNodesInOrder, result.shortestPath);
  }, [
    algorithm,
    grid,
    startNode,
    endPoints,
    selectedEndPointId,
    isRunning,
    animateAlgorithm,
  ]);

  const handleClearClick = useCallback(() => {
    const newGrid = grid.map((row) => row.map((node) => ({ ...node })));
    resetGrid(newGrid);
    updateDisplayGrid(newGrid);
  }, [grid, updateDisplayGrid]);

  const handleResetClick = useCallback(() => {
    const newGrid = initializeGrid(gridSize, gridSize);
    newGrid[startNode.row][startNode.col].isStart = true;
    endPoints.forEach((endpoint) => {
      if (endpoint.row < gridSize && endpoint.col < gridSize) {
        newGrid[endpoint.row][endpoint.col].isEnd = true;
      }
    });
    setGrid(newGrid);
    updateDisplayGrid(newGrid);
  }, [gridSize, startNode, endPoints, updateDisplayGrid]); // Updated dependencies

  const handleGridSizeChange = useCallback((size: number) => {
    setGridSize(size);
  }, []);

  const handleAnimationSpeedChange = useCallback((speed: number) => {
    setAnimationSpeed(speed);
  }, []);

  return (
    <div className="min-h-screen bg-background p-8 font-sans">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] md:gap-8 gap-4 max-w-[1600px] mx-auto">
        <Card className="backdrop-blur-md rounded-2xl p-8 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold">
              Pathfinding Visualizer
            </CardTitle>
            <CardDescription>
              Select an algorithm and click "Start" to visualize pathfinding!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Grid
              grid={displayGrid}
              onMouseDown={handleMouseDown}
              onMouseEnter={handleMouseEnter}
              onMouseUp={handleMouseUp}
            />
          </CardContent>
        </Card>

        <ControlPanel
          algorithm={algorithm}
          onAlgorithmChange={setAlgorithm}
          gridSize={gridSize}
          onGridSizeChange={handleGridSizeChange}
          onStartClick={handleStartClick}
          onClearClick={handleClearClick}
          onResetClick={handleResetClick}
          isRunning={isRunning}
          animationSpeed={animationSpeed}
          onAnimationSpeedChange={handleAnimationSpeedChange}
          interactionMode={interactionMode}
          onInteractionModeChange={setInteractionMode}
          endPoints={endPoints}
          selectedEndPointId={selectedEndPointId}
          onSelectEndPoint={setSelectedEndPointId}
          onDeleteEndPoint={handleDeleteEndPoint}
        />
      </div>

      <EndPointNameModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleEndPointSubmit}
      />
    </div>
  );
};
