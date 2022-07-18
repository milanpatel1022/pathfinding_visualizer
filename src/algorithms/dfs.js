/*
DFS is an unweighted algorithm that does not guarantee the shortest path to the end node.
Use recursion to perform DFS
  - go as far as possible in one direction before backtracking and going in another direction
  - base cases: node visited or node is a wall
*/

export function dfs(grid, startNode, endNode) {
  const visitedNodes = [];
  let reachable = false;

  function recurse(curNode, prevNode) {
    //base case: already visited this Node
    if (curNode.isVisited) {
      return false;
    }

    //mark curNode as visited
    curNode.isVisited = true;
    curNode.prevNode = prevNode;
    visitedNodes.push(curNode);

    //base case: Node is a wall. ignore it and return
    if (curNode.isWall === true) {
      return false;
    }

    //if curNode is the endNode, we can exit early. we know the path to it.
    if (curNode === endNode) {
      reachable = true;
      return true;
    }

    //get neighbors in all 4 directions
    const row = curNode.row;
    const col = curNode.col;

    //go up -> left -> down -> right
    if (row > 0 && !reachable) recurse(grid[row - 1][col], curNode);
    if (col > 0 && !reachable) recurse(grid[row][col - 1], curNode);
    if (row < grid.length - 1 && !reachable)
      recurse(grid[row + 1][col], curNode);
    if (col < grid[row].length - 1 && !reachable)
      recurse(grid[row][col + 1], curNode);
  }

  recurse(startNode, null);
  return [visitedNodes, reachable];
}

export function dfsPath(endNode) {
  const path = [];

  let curNode = endNode;

  while (curNode !== null) {
    path.unshift(curNode); //unshift pushes to front of array, so our path will be in order
    curNode = curNode.prevNode;
  }

  return path;
}
