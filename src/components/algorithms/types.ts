export enum CellType {
    NORMAL = 'normal',
    START = 'start',
    END = 'end',
    OBSTACLE = 'obstacle',
    VISITED = 'visited',
    PATH = 'path',
}

export interface Node {
    row: number;
    col: number;
    isObstacle: boolean;
    isStart: boolean;
    isEnd: boolean;
    distance: number;
    heuristic: number;
    totalCost: number;
    previousNode: Node | null;
    isVisited: boolean;
}

export interface AlgorithmResult {
    visitedNodesInOrder: Node[];
    shortestPath: Node[];
    success: boolean;
}

export type Algorithm = 'astar' | 'dijkstra';

export interface EndPoint {
    id: number;
    name: string;
    row: number;
    col: number;
}

export interface GridNode {
    row: number;
    col: number;
    type: CellType;
    endPointId?: number;
    isSelectedEnd?: boolean;
}
