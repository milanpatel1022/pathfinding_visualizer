export function bfs(grid, startNode, endNode) {
  const visitedNodes = [];

  //initially, our queue only contains the starting node
  let q = Array(1).fill(startNode);

  while (q.length !== 0) {
    let curNode = q.shift();

    if (curNode.isVisited) {
      continue;
    }

    //mark curNode as visited
    curNode.isVisited = true;
    visitedNodes.push(curNode);

    //if curNode is a wall, we can ignore it and go to next iteration of while loop
    if (curNode.isWall === true) {
      continue;
    }

    //if curNode is the endNode, we can exit early. we know the shortest path to it.
    if (curNode === endNode) {
      curNode.isVisited = true;
      visitedNodes.push(curNode);
      return [visitedNodes, true];
    }

    //push unvisited neighbors of curNode into queue
    const neighbors = unvisitedNeighbors(curNode, grid);
    for (const neighbor of neighbors) {
      q.push(neighbor);
    }
    // console.log("q");
    // for (const item of q) {
    //   console.log(item.row, item.col, item.isVisited);
    // }
  }

  //if while loop completes and we haven't returned, we were not able to find a path to endNode
  return [visitedNodes, false];
}

//identify unvisited neighbors of current Node
function unvisitedNeighbors(curNode, grid) {
  const neighbors = [];

  const row = curNode.row;
  const col = curNode.col;

  //get neighbors in all 4 directions
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col < grid[row].length - 1) neighbors.push(grid[row][col + 1]);

  let unvisited = [];

  //for each neighbor set their distance and prevNode
  for (const neighbor of neighbors) {
    if (!neighbor.isVisited) {
      neighbor.distance = curNode.distance + 1;
      neighbor.prevNode = curNode;
      unvisited.push(neighbor);
    }
  }

  return unvisited;
}

export function bfsShortestPath(endNode) {
  const path = [];

  let curNode = endNode;

  while (curNode !== null) {
    // console.log(`${curNode.row} ${curNode.col}`);

    // curNode.inShortestPath = true; //mark Node as being in shortest path
    path.unshift(curNode); //unshift pushes to front of array, so our path will be in order
    curNode = curNode.prevNode;
  }

  return path;
}
