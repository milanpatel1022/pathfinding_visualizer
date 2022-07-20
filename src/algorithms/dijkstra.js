/*
Algorithm
    - Let distance of startNode be 0
    - Let distance of all other nodes be Infinity

    Repeat
        - Visit the unvisited node with the smallest distance from the start node
        - For the current node, examine its unvisited neighbors
        - For the current node, calculate distance of each neighbor from start node
        - If the calculated distance of a node is less than the known distance, update the shortest distance
        - Update the previous node for each of the updated distances
        - Add the current node to the list of visited nodes
    Until all nodes are visited (or until the endNode is visited??)

*/

export function dijkstra(grid, startNode, endNode) {
  const visitedNodes = [];
  const unvisitedNodes = getUnvisitedNodes(grid);

  startNode.distance = 0; //Dijkstra starts from this Node

  //while we still have unvisited Nodes
  while (unvisitedNodes.length !== 0) {
    //sort Nodes by distance from start
    sortUnvisitedNodes(unvisitedNodes);

    //extract closest unvisited Node from start
    const curNode = unvisitedNodes.shift();

    //Walls can make it so that we have no neighbors we can get to (a.k.a. they have distance of Infinity)
    if (curNode.distance === Infinity) {
      return [visitedNodes, false];
    }

    //mark Node as being visited
    curNode.isVisited = true;
    visitedNodes.push(curNode);

    //if curNode is a wall, we can ignore it and go to next iteration of while loop
    if (curNode.isWall === true) {
      continue;
    }

    //if curNode is the endNode, we can exit early. we know the shortest path to it.
    if (curNode === endNode) {
      return [visitedNodes, true];
    }

    //calculate distance to each of its unvisited neighbors
    unvisitedNeighbors(curNode, grid);
  }
}

//identify unvisited neighbors of current Node and then update their distance if shorter one found
function unvisitedNeighbors(curNode, grid) {
  const neighbors = [];

  const row = curNode.row;
  const col = curNode.col;

  //get neighbors in all 4 directions
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col < grid[row].length - 1) neighbors.push(grid[row][col + 1]);

  //filter to keep only unvisited neighbors
  neighbors.filter((node) => !node.isVisited);

  //update distances to neighbors from current node
  let edgeCost = 1; //default cost of an edge is 1
  if (curNode.isWeight) {
    edgeCost = 5;
  } //if node is a weight, cost of edge is 5

  for (const neighbor of neighbors) {
    if (neighbor.distance > curNode.distance + edgeCost) {
      neighbor.distance = curNode.distance + edgeCost;
      neighbor.prevNode = curNode; //update neighbor's prevNode if better distance is found
    }
  }
}

//sort Nodes by distance (non-decreasing)
function sortUnvisitedNodes(unvisitedNodes) {
  unvisitedNodes.sort((node1, node2) => node1.distance - node2.distance);
}

//all Nodes in grid are unvisited prior to starting Dijkstra
function getUnvisitedNodes(grid) {
  const unvisitedNodes = [];

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      unvisitedNodes.push(grid[i][j]);
    }
  }
  return unvisitedNodes;
}

export function dijkstraShortestPath(endNode) {
  const path = [];

  let curNode = endNode;

  while (curNode !== null) {
    path.unshift(curNode); //unshift pushes to front of array, so our path will be in order
    curNode = curNode.prevNode;
  }

  return path;
}
