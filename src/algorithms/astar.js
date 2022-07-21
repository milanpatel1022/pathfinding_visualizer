/*
    - Finds shortest path only from start to finish
        -> unlike Dijkstra which calculates shortest path from start to every other node
    - It is seen as an extension of Dijkstra
    - It achieves better performance by using heuristics
    - F(N) = G(N) + H(N)
        - H(N) a.k.a. the heuristic function = estimated cheapest cost path from current node to end node
            -> if this function never overestimates the actual cost, A* is guaranteed to return least-cost path
            -> we will use the rows and cols of two nodes to calculate the manhattan distance between them
                - this ensures we never overestimate
        - G(N) = cost from start node to current node
        - F(N) is the sum of those two values
    - Use priority queue to perform repeated selection of minimum estimated cost nodes to expand
    - Algorithm
        - Extract node with lowest F(N) from queue
        - Update f and g values of neighbors if need be and add them to queue
            - Update predecessor of neighbors if better path to them is found
        - Continue until extracted node === end node
            -> F value of this node is the cost of cheapest path to it
*/

import Heap from "heap";

//initialize hash table mapping Nodes : {f, g, h}
let node_info = new Map();

export function astar(grid, startNode, endNode) {
  const visitedNodes = [];
  const nodes = getNodes(grid);

  for (let node of nodes) {
    let manhattan_distance = calculate_h(node, endNode);
    node_info.set(node, {
      f: Infinity,
      g: Infinity,
      h: manhattan_distance,
    });
  }

  //update f and g values of start node
  let startInfo = node_info.get(startNode);
  node_info.set(startNode, {
    f: startInfo.h,
    g: 0,
    h: startInfo.h,
  });

  //each element in minheap will be of structure: [f, h, Node]
  //heap will sort based on f values. If f values are equal, it will sort based on h values.
  const minHeap = new Heap(function (a, b) {
    return a[0] - b[0] || a[1] - b[1];
  });

  //initialize heap with start Node
  startInfo = node_info.get(startNode);
  minHeap.push([startInfo.f, startInfo.h, startNode]);

  //while heap is not empty
  while (!minHeap.empty()) {
    //extract Node with lowest F(N)
    let cur = minHeap.pop();
    let curNode = cur[2];

    //already expanded from this Node. would not make sense to expand again from here.
    if (curNode.isVisited) {
      continue;
    }

    curNode.isVisited = true;
    visitedNodes.push(curNode);

    //if curNode is a wall, ignore it
    if (curNode.isWall) {
      continue;
    }

    //if curNode is the end node, we can return early
    if (curNode === endNode) {
      return [visitedNodes, true];
    }

    //get neighbors to whom we have found a lesser cost path
    let neighbors = getNeighbors(curNode, grid);

    //add them to the minHeap
    for (let neighbor of neighbors) {
      let neighborInfo = node_info.get(neighbor);
      minHeap.push([neighborInfo.f, neighborInfo.h, neighbor]);
    }
  }

  return [visitedNodes, false];
}

//get neighbors to whom we have found a lesser cost path
function getNeighbors(curNode, grid) {
  let neighbors = [];

  const row = curNode.row;
  const col = curNode.col;

  //get neighbors in all 4 directions
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col < grid[row].length - 1) neighbors.push(grid[row][col + 1]);

  let edgeCost = 1;
  if (curNode.isWeight) {
    edgeCost = 5;
  }

  //cost to get to curNode
  let costToCurNode = node_info.get(curNode).g;

  //will store filtered out neighbors (to whom we've found a cheaper path)
  let filteredNeighbors = [];

  for (let neighbor of neighbors) {
    let neighborInfo = node_info.get(neighbor);

    //if cheaper cost to neighbor found, update f & g and prevNode
    if (costToCurNode + edgeCost < neighborInfo.g) {
      neighborInfo.g = costToCurNode + edgeCost;
      neighborInfo.f = neighborInfo.g + neighborInfo.h;
      node_info.set(neighbor, neighborInfo);
      neighbor.prevNode = curNode;
      filteredNeighbors.push(neighbor);
    }
  }

  return filteredNeighbors;
}

//our heuristic function uses manhattan distance
function calculate_h(curNode, endNode) {
  return (
    Math.abs(curNode.row - endNode.row) + Math.abs(curNode.col - endNode.col)
  );
}

//get all Nodes in grid
function getNodes(grid) {
  const nodes = [];

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      nodes.push(grid[i][j]);
    }
  }
  return nodes;
}

export function aStarPath(endNode) {
  const path = [];

  let curNode = endNode;

  while (curNode !== null) {
    path.unshift(curNode); //unshift pushes to front of array, so our path will be in order
    curNode = curNode.prevNode;
  }

  return path;
}
