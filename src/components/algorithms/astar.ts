import { Node, AlgorithmResult } from './types';
import { getNeighbors, manhattanDistance, getShortestPath } from './utils';

class AStarPriorityQueue {
    private items: Node[] = [];

    enqueue(node: Node): void {
        if (this.items.length === 0) {
            this.items.push(node);
        } else {
            let added = false;
            for (let i = 0; i < this.items.length; i++) {
                if (node.totalCost < this.items[i].totalCost) {
                    this.items.splice(i, 0, node);
                    added = true;
                    break;
                }
            }
            if (!added) {
                this.items.push(node);
            }
        }
    }

    dequeue(): Node | undefined {
        return this.items.shift();
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    contains(node: Node): boolean {
        return this.items.some(item => item.row === node.row && item.col === node.col);
    }

    remove(node: Node): void {
        this.items = this.items.filter(item => !(item.row === node.row && item.col === node.col));
    }
}

export function astar(
    grid: Node[][],
    startNode: Node,
    endNode: Node
): AlgorithmResult {
    const visitedNodesInOrder: Node[] = [];
    const openSet = new AStarPriorityQueue();
    const closedSet = new Set<string>();

    startNode.distance = 0;
    startNode.heuristic = manhattanDistance(startNode, endNode);
    startNode.totalCost = startNode.distance + startNode.heuristic;

    openSet.enqueue(startNode);

    while (!openSet.isEmpty()) {
        const currentNode = openSet.dequeue();

        if (!currentNode) break;

        const nodeKey = `${currentNode.row}-${currentNode.col}`;

        // Skip if already processed
        if (closedSet.has(nodeKey)) continue;

        // Skip obstacles
        if (currentNode.isObstacle) continue;

        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);
        closedSet.add(nodeKey);

        // If we reached the end node, we're done
        if (currentNode === endNode) {
            return {
                visitedNodesInOrder,
                shortestPath: getShortestPath(endNode),
                success: true,
            };
        }

        // Check all neighbors
        const neighbors = getNeighbors(currentNode, grid);
        for (const neighbor of neighbors) {
            const neighborKey = `${neighbor.row}-${neighbor.col}`;

            // Skip if already processed
            if (closedSet.has(neighborKey)) continue;

            const tentativeDistance = currentNode.distance + 1;

            // If this path to neighbor is better than any previous one
            if (tentativeDistance < neighbor.distance) {
                neighbor.distance = tentativeDistance;
                neighbor.heuristic = manhattanDistance(neighbor, endNode);
                neighbor.totalCost = neighbor.distance + neighbor.heuristic;
                neighbor.previousNode = currentNode;

                // Add to open set if not already there
                if (!openSet.contains(neighbor)) {
                    openSet.enqueue(neighbor);
                } else {
                    // Update position in queue
                    openSet.remove(neighbor);
                    openSet.enqueue(neighbor);
                }
            }
        }
    }

    // No path found
    return {
        visitedNodesInOrder,
        shortestPath: [],
        success: false,
    };
}
