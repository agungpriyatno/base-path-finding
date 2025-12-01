import { Node } from './types';

export function createNode(row: number, col: number): Node {
    return {
        row,
        col,
        isObstacle: false,
        isStart: false,
        isEnd: false,
        distance: Infinity,
        heuristic: 0,
        totalCost: Infinity,
        previousNode: null,
        isVisited: false,
    };
}

export function initializeGrid(rows: number, cols: number): Node[][] {
    const grid: Node[][] = [];
    for (let row = 0; row < rows; row++) {
        const currentRow: Node[] = [];
        for (let col = 0; col < cols; col++) {
            currentRow.push(createNode(row, col));
        }
        grid.push(currentRow);
    }
    return grid;
}

export function getNeighbors(node: Node, grid: Node[][]): Node[] {
    const neighbors: Node[] = [];
    const { row, col } = node;
    const rows = grid.length;
    const cols = grid[0].length;

    // Up
    if (row > 0) neighbors.push(grid[row - 1][col]);
    // Down
    if (row < rows - 1) neighbors.push(grid[row + 1][col]);
    // Left
    if (col > 0) neighbors.push(grid[row][col - 1]);
    // Right
    if (col < cols - 1) neighbors.push(grid[row][col + 1]);

    return neighbors.filter(neighbor => !neighbor.isObstacle);
}

export function manhattanDistance(nodeA: Node, nodeB: Node): number {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

export function euclideanDistance(nodeA: Node, nodeB: Node): number {
    const dx = nodeA.row - nodeB.row;
    const dy = nodeA.col - nodeB.col;
    return Math.sqrt(dx * dx + dy * dy);
}

export function getShortestPath(endNode: Node): Node[] {
    const shortestPath: Node[] = [];
    let currentNode: Node | null = endNode;

    while (currentNode !== null) {
        shortestPath.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }

    return shortestPath;
}

export function resetNode(node: Node): void {
    node.distance = Infinity;
    node.heuristic = 0;
    node.totalCost = Infinity;
    node.previousNode = null;
    node.isVisited = false;
}

export function resetGrid(grid: Node[][]): void {
    for (const row of grid) {
        for (const node of row) {
            resetNode(node);
        }
    }
}
