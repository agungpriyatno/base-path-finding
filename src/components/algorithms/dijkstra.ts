import { Node, AlgorithmResult } from './types';
import { getNeighbors, getShortestPath } from './utils';

class PriorityQueue {
    private items: Node[] = [];

    enqueue(node: Node): void {
        if (this.items.length === 0) {
            this.items.push(node);
        } else {
            let added = false;
            for (let i = 0; i < this.items.length; i++) {
                if (node.distance < this.items[i].distance) {
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
}

export function dijkstra(
    grid: Node[][],
    startNode: Node,
    endNode: Node
): AlgorithmResult {
    const visitedNodesInOrder: Node[] = [];

    startNode.distance = 0;
    const unvisitedNodes = new PriorityQueue();

    // Add all nodes to the priority queue
    for (const row of grid) {
        for (const node of row) {
            unvisitedNodes.enqueue(node);
        }
    }

    while (!unvisitedNodes.isEmpty()) {
        const currentNode = unvisitedNodes.dequeue();

        if (!currentNode) break;

        // Skip obstacles
        if (currentNode.isObstacle) continue;

        // If we encounter a node with infinite distance, we're trapped
        if (currentNode.distance === Infinity) {
            return {
                visitedNodesInOrder,
                shortestPath: [],
                success: false,
            };
        }

        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);

        // If we reached the end node, we're done
        if (currentNode === endNode) {
            return {
                visitedNodesInOrder,
                shortestPath: getShortestPath(endNode),
                success: true,
            };
        }

        // Update distances for neighbors
        const neighbors = getNeighbors(currentNode, grid);
        for (const neighbor of neighbors) {
            if (!neighbor.isVisited) {
                const newDistance = currentNode.distance + 1;
                if (newDistance < neighbor.distance) {
                    neighbor.distance = newDistance;
                    neighbor.previousNode = currentNode;
                    // Re-add to queue with updated distance
                    unvisitedNodes.enqueue(neighbor);
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
