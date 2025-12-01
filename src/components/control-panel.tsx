"use client";

import React from "react";
import { Algorithm, EndPoint } from "./algorithms/types";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Slider } from "./ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Trash2 } from "lucide-react";

interface ControlPanelProps {
  algorithm: Algorithm;
  onAlgorithmChange: (algorithm: Algorithm) => void;
  gridSize: number;
  onGridSizeChange: (size: number) => void;
  onStartClick: () => void;
  onClearClick: () => void;
  onResetClick: () => void;
  isRunning: boolean;
  animationSpeed: number;
  onAnimationSpeedChange: (speed: number) => void;
  interactionMode: "obstacle" | "start" | "end" | null;
  onInteractionModeChange: (mode: "obstacle" | "start" | "end" | null) => void;
  endPoints: EndPoint[];
  selectedEndPointId: number;
  onSelectEndPoint: (id: number) => void;
  onDeleteEndPoint: (id: number) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  algorithm,
  onAlgorithmChange,
  gridSize,
  onGridSizeChange,
  onStartClick,
  onClearClick,
  onResetClick,
  isRunning,
  animationSpeed,
  onAnimationSpeedChange,
  interactionMode,
  onInteractionModeChange,
  endPoints,
  selectedEndPointId,
  onSelectEndPoint,
  onDeleteEndPoint,
}) => {
  return (
    <Card className="backdrop-blur-lg w-full md:min-w-2xl">
      {/* Algorithm Selection */}
      <CardHeader>
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Algorithm</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={algorithm === "astar" ? "default" : "outline"}
              onClick={() => onAlgorithmChange("astar")}
              disabled={isRunning}
            >
              A* Algorithm
            </Button>
            <Button
              variant={algorithm === "dijkstra" ? "default" : "outline"}
              onClick={() => onAlgorithmChange("dijkstra")}
              disabled={isRunning}
            >
              Dijkstra
            </Button>
          </div>
        </div>

        {/* Interaction Mode */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Interaction Mode</h3>
          <p className="text-sm text-gray-600 mb-3">
            {!interactionMode && "Select a mode to interact with the grid"}
            {interactionMode === "obstacle" && "Click to draw/erase obstacles"}
            {interactionMode === "start" &&
              "Click on grid to place start point"}
            {interactionMode === "end" &&
              "Click on grid to place and name new end point"}
          </p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              size="sm"
              variant={interactionMode === "obstacle" ? "default" : "outline"}
              onClick={() => onInteractionModeChange("obstacle")}
              disabled={isRunning}
            >
              Draw
            </Button>
            <Button
              size="sm"
              variant={interactionMode === "start" ? "default" : "outline"}
              onClick={() => onInteractionModeChange("start")}
              disabled={isRunning}
            >
              Set Start
            </Button>
            <Button
              size="sm"
              variant={interactionMode === "end" ? "default" : "outline"}
              onClick={() => onInteractionModeChange("end")}
              disabled={isRunning}
            >
              Add End Point
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Endpoints Management */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">
            Destination
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({endPoints.length} endpoint{endPoints.length !== 1 && "s"})
            </span>
          </h3>
          <div className="flex gap-2">
            <Select
              value={selectedEndPointId.toString()}
              onValueChange={(value) => onSelectEndPoint(Number(value))}
              disabled={isRunning}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {endPoints.map((endpoint) => (
                  <SelectItem key={endpoint.id} value={endpoint.id.toString()}>
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{endpoint.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({endpoint.row}, {endpoint.col})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {endPoints.length > 1 && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDeleteEndPoint(selectedEndPointId)}
                disabled={isRunning}
                className="shrink-0"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            )}
          </div>
        </div>

        {/* Grid Size */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">
            Grid Size: {gridSize}x{gridSize}
          </h3>
          <Slider
            min={10}
            max={80}
            step={1}
            value={[gridSize]}
            onValueChange={(value) => onGridSizeChange(value[0])}
            disabled={isRunning}
            className="w-full"
          />
        </div>

        {/* Animation Speed */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Animation Speed</h3>
          <Slider
            min={1}
            max={50}
            step={1}
            value={[animationSpeed]}
            onValueChange={(value) => onAnimationSpeedChange(value[0])}
            disabled={isRunning}
            className="w-full"
          />
          <span className="block text-center mt-2 text-sm text-gray-600 font-medium">
            {animationSpeed < 15
              ? "Slow"
              : animationSpeed < 35
              ? "Medium"
              : "Fast"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Actions</h3>
          <div className="flex flex-col gap-3">
            <Button onClick={onStartClick} disabled={isRunning}>
              {isRunning ? "Running..." : "Start Pathfinding"}
            </Button>
            <div className="flex gap-2">
              <Button
                variant={"outline"}
                className="flex-1"
                onClick={onClearClick}
                disabled={isRunning}
              >
                Clear Path
              </Button>
              <Button
                variant={"outline"}
                className="flex-1"
                onClick={onResetClick}
                disabled={isRunning}
              >
                Reset Grid
              </Button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Legend</h3>
          <div className="grid grid-cols-3 lg:grid-cols-5 gap-2">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-emerald-500 rounded flex-shrink-0"></div>
              <span className="text-sm font-medium">Start</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-red-500 rounded flex-shrink-0"></div>
              <span className="text-sm font-medium">End</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-800 dark:bg-gray-200 rounded flex-shrink-0"></div>
              <span className="text-sm font-medium">Obstacle</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-400 rounded flex-shrink-0"></div>
              <span className="text-sm font-medium">Visited</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-primary rounded flex-shrink-0"></div>
              <span className="text-sm font-medium">Path</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
