import React, { Component } from "react";
import Node from "./Node";
import { dijkstra, dijkstraShortestPath } from "../algorithms/dijkstra";
import { bfs, bfsShortestPath } from "../algorithms/bfs";
import { dfs, dfsPath } from "../algorithms/dfs";
import { astar, aStarPath } from "../algorithms/astar";

import "./Pathfinder.css";
import Navbar from "./Navbar";
import Legend from "./Legend";

const rows = 24;
const cols = 40;

let START_ROW = 0;
let START_COL = 0;
let END_ROW = rows - 1;
let END_COL = cols - 1;

class Pathfinder extends Component {
  constructor() {
    super();
    this.state = {
      grid: [], //our 2d array of Objects -> [[{row: 0, ..., isVisited: false}]
      nodeToDrag: "", //let's us know if we are dragging a start or end node
      visualizing: false, //if True, we should prevent user from doing certain things
      mousePressed: false, //used for toggling walls
      dragToggled: false, //used for moving start/end nodes
      wallsToggled: false, //let's us know if user has selected walls to place on grid
      weightsToggled: false, //^ but for weights
    };
  }

  //create the grid as soon as this component is inserted into the DOM & update state.grid (which is initially an empty array)
  componentDidMount() {
    const newGrid = this.createGrid();
    this.setState({ grid: newGrid });
  }

  //create 2D array/grid (each cell is an object containing info.)
  createGrid = () => {
    const grid = [];

    for (let row = 0; row < rows; row++) {
      const curRow = [];

      for (let col = 0; col < cols; col++) {
        const node = this.createCell(row, col);
        curRow.push(node);
      }

      grid.push(curRow);
    }

    return grid;
  };

  //create Object for each cell in our grid
  createCell = (row, col) => {
    return {
      row: row,
      col: col,
      isStart: row === START_ROW && col === START_COL, //to identify start point
      isEnd: row === END_ROW && col === END_COL, //to identify end point
      distance: Infinity, //for Dijkstra
      isVisited: false, //visited Nodes will be styled
      inShortestPath: false, //for Dijkstra
      prevNode: null, //need to know for Dijkstra to identify shortest path
      isWall: false,
      isWeight: false,
      currentNodeToAnimate: false,
    };
  };

  async visualizeAlgorithm(algorithm, speed) {
    //don't restart if already visualizing
    if (this.state.visualizing === true) {
      return;
    }
    await this.clearPath();
    this.setState({ visualizing: true });
    const grid = this.deepCopyGrid();

    const startNode = grid[START_ROW][START_COL];
    const endNode = grid[END_ROW][END_COL];

    let visitedNodes = [];
    let nodesInPath = [];
    let endReachable = false;

    //all the Nodes visited in Dijkstra
    if (algorithm === "Dijkstra") {
      [visitedNodes, endReachable] = dijkstra(grid, startNode, endNode);
      nodesInPath = dijkstraShortestPath(endNode);
    } else if (algorithm === "BFS") {
      [visitedNodes, endReachable] = bfs(grid, startNode, endNode);
      nodesInPath = bfsShortestPath(endNode);
    } else if (algorithm === "DFS") {
      [visitedNodes, endReachable] = dfs(grid, startNode, endNode);
      nodesInPath = dfsPath(endNode);
    } else if (algorithm === "A* Search") {
      [visitedNodes, endReachable] = astar(grid, startNode, endNode);
      nodesInPath = aStarPath(endNode);
    }

    //animate all these Nodes involved in Dijkstra
    this.animateAlgorithm(visitedNodes, nodesInPath, endReachable, speed);
  }

  //simulate animation effect by updating state one cell at a time every couple of milliseconds
  animateAlgorithm = async (visitedNodes, nodesInPath, endReachable, speed) => {
    const delay = (ms) =>
      new Promise((resolve, reject) => setTimeout(resolve, ms));

    const delay_amount = speed === "Fast" ? 1 : speed === "Normal" ? 130 : 500;

    //animate the visited Nodes first
    for (let node of visitedNodes) {
      node.currentNodeToAnimate = true;
      const grid = this.deepCopyGrid();
      grid[node.row][node.col] = node;
      this.setState({ grid: grid }, () => (node.currentNodeToAnimate = false));
      await delay(delay_amount);
    }

    //then, let's animate the shortest path if there was one
    if (endReachable) {
      for (let node of nodesInPath) {
        const grid = this.deepCopyGrid();
        grid[node.row][node.col] = { ...node, inShortestPath: true };
        this.setState({ grid: grid });
        await delay(delay_amount);
      }
    }

    this.setState({ visualizing: false });
    return;
  };

  //deep copy of grid state before we perform updates on it.
  deepCopyGrid() {
    const grid = [];
    for (let row of this.state.grid) {
      const curRow = row.map((a) => {
        return { ...a };
      });
      grid.push(curRow);
    }
    return grid;
  }

  //if we click on a start/end node, toggle on/off dragging effects
  onClick(event, row, col) {
    if (this.state.visualizing === true) {
      return;
    }

    event.preventDefault();

    const grid = this.deepCopyGrid();
    const node = grid[row][col];

    if (this.state.dragToggled === false) {
      if (node.isStart) {
        node.isStart = false;
        this.setState({ grid: grid, nodeToDrag: "start", dragToggled: true });
      } else if (node.isEnd) {
        node.isEnd = false;
        this.setState({ grid: grid, nodeToDrag: "end", dragToggled: true });
      } else {
        return;
      }
    } else {
      //update necessary variables to reflect moving start/end node to a new cell
      if (node.isStart && this.state.nodeToDrag === "start") {
        this.setState({ nodeToDrag: "", dragToggled: false });
        START_ROW = row;
        START_COL = col;
      } else if (node.isEnd && this.state.nodeToDrag === "end") {
        this.setState({ nodeToDrag: "", dragToggled: false });
        END_ROW = row;
        END_COL = col;
      }
    }
  }

  //while mouse is down, place walls/weights if either is toggled
  mouseDown(event, row, col) {
    if (this.state.visualizing === true) {
      return;
    }

    const { wallsToggled, weightsToggled } = this.state;

    //if walls/weights aren't toggled, mouseDown should not do anything
    if (!(wallsToggled || weightsToggled)) {
      return;
    }

    event.preventDefault();

    const grid = this.deepCopyGrid();
    const node = grid[row][col];

    //can only add/remove walls/weights in a cell if it is not our start/end point
    if (!(node.isStart || node.isEnd)) {
      if (wallsToggled && !node.isWeight) {
        //can't place a wall if there is a weight present
        node.isWall = !node.isWall;
      } else if (weightsToggled && !node.isWall) {
        //can't place a weight if there is a wall present
        node.isWeight = !node.isWeight;
      }
      this.setState({ grid: grid, mousePressed: true });
    }
  }

  //simply update our mousePressed state to false
  mouseUp(event) {
    if (this.state.visualizing === true) {
      return;
    }

    event.preventDefault();
    this.setState({ mousePressed: false });
  }

  //only does anything if mousePressed or dragToggled
  mouseEnter(event, row, col) {
    if (this.state.visualizing) {
      return;
    }

    event.preventDefault();
    const grid = this.deepCopyGrid();
    const node = grid[row][col];

    const { wallsToggled, weightsToggled } = this.state;

    //if mousePressed & we enter new cell, toggle wall/weight
    if (this.state.mousePressed) {
      if (wallsToggled) {
        node.isWall = !node.isWall;
      } else if (weightsToggled) {
        node.isWeight = !node.isWeight;
      }
      this.setState({ grid: grid });
      return;
    }

    //if dragToggled & we enter new cell, update it to be new start/end point
    if (this.state.dragToggled) {
      if (this.state.nodeToDrag === "start") {
        node.isStart = true;
      } else if (this.state.nodeToDrag === "end") {
        node.isEnd = true;
      }
      this.setState({ grid: grid });
    }
  }

  //only does anything if dragToggled
  mouseOut(event, row, col) {
    if (this.state.visualizing === true || this.state.dragToggled === false) {
      return;
    }

    event.preventDefault();

    //update the cells we leave while dragging to be what they were previously
    if (this.state.nodeToDrag === "start") {
      this.state.grid[row][col].isStart = false;
    } else if (this.state.nodeToDrag === "end") {
      this.state.grid[row][col].isEnd = false;
    }
  }

  //resets Grid and rest of state to default conditions
  resetGrid() {
    //can't reset grid while visualization running
    if (this.state.visualizing === true) {
      return;
    }

    START_ROW = 0;
    START_COL = 0;
    END_ROW = this.state.grid.length - 1;
    END_COL = this.state.grid[0].length - 1;

    const grid = this.createGrid();
    this.setState({ grid: grid, nodeToDrag: "", mousePressed: false });
  }

  //if we have finished visualizing, clear only the visited Nodes. Keep any other changes the user made.
  async clearPath() {
    if (this.state.visualizing === true) {
      return;
    }

    const grid = this.deepCopyGrid();

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        grid[i][j].isVisited = false;
        grid[i][j].inShortestPath = false;
        grid[i][j].distance = Infinity;
        grid[i][j].prevNode = null;
      }
    }

    this.setState({ grid: grid });
  }

  clearWallsAndWeights() {
    if (this.state.visualizing === true) {
      return;
    }

    const grid = this.deepCopyGrid();

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        grid[i][j].isWall = false;
        grid[i][j].isWeight = false;
      }
    }
    this.setState({ grid: grid });
  }

  clearWeights() {
    if (this.state.visualizing === true) {
      return;
    }

    const grid = this.deepCopyGrid();

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        grid[i][j].isWeight = false;
      }
    }
    this.setState({ grid: grid });
  }

  //Navbar Component calls this function when Wall/Weight are clicked on to toggle State.
  toggleWallsOrWeights(wallsOrWeights) {
    if (wallsOrWeights === "wall") {
      this.setState((prevState) => ({
        wallsToggled: !prevState.wallsToggled,
        weightsToggled: false,
      }));
    } else if (wallsOrWeights === "weight") {
      this.setState((prevState) => ({
        wallsToggled: false,
        weightsToggled: !prevState.weightsToggled,
      }));
    }
  }

  render() {
    const grid = this.state.grid;

    //use HTML table to map each element in our array to a Node component
    return (
      <>
        <Navbar
          visualizeAlgorithm={(algorithm, speed) =>
            this.visualizeAlgorithm(algorithm, speed)
          }
          resetGrid={() => this.resetGrid()}
          clearPath={() => this.clearPath()}
          clearWallsAndWeights={() => this.clearWallsAndWeights()}
          clearWeights={() => this.clearWeights()}
          toggleWallsOrWeights={(wallsOrWeights) =>
            this.toggleWallsOrWeights(wallsOrWeights)
          }
        ></Navbar>
        <Legend />
        <div className="grid table-responsive">
          <table>
            <tbody>
              {grid.map((row, rowIdx) => {
                return (
                  <tr key={rowIdx}>
                    {row.map((node, nodeIdx) => {
                      return (
                        <td key={nodeIdx}>
                          <Node
                            row={rowIdx}
                            col={nodeIdx}
                            isStart={node.isStart}
                            isEnd={node.isEnd}
                            isWall={node.isWall}
                            isWeight={node.isWeight}
                            isVisited={node.isVisited}
                            inShortestPath={node.inShortestPath}
                            currentNodeToAnimate={node.currentNodeToAnimate}
                            onMouseDown={(event, row, col) =>
                              this.mouseDown(event, row, col)
                            }
                            onMouseUp={(event, row, col) =>
                              this.mouseUp(event, row, col)
                            }
                            onMouseEnter={(event, row, col) =>
                              this.mouseEnter(event, row, col)
                            }
                            onMouseOut={(event, row, col) =>
                              this.mouseOut(event, row, col)
                            }
                            onClick={(event, row, col) =>
                              this.onClick(event, row, col)
                            }
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default Pathfinder;
