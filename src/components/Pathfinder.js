import React, { Component } from "react";
import Node from "./Node";
import { dijkstra, shortestPath } from "../algorithms/dijkstra";

import "./Pathfinder.css";

const rows = 15;
const cols = 35;

let START_ROW = 0;
let START_COL = 0;
let END_ROW = 2;
let END_COL = 3;

class Pathfinder extends Component {
  constructor() {
    super();
    this.state = {
      grid: [], //our 2d array of Objects -> [[{row: 0, ..., isVisited: false}]
      nodeToDrag: "", //let's us know if we are dragging a start or end node
      visualizing: false, //if True, we should prevent user from doing certain things
      mousePressed: false, //needed for animation when dragging nodes
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
    };
  };

  visualizeAlgorithm() {
    //don't restart if already visualizing
    if (this.state.visualizing === true) {
      return;
    }
    this.setState({ visualizing: true });
    const grid = this.deepCopyGrid();

    const startNode = grid[START_ROW][START_COL];
    const endNode = grid[END_ROW][END_COL];

    //all the Nodes visited in Dijkstra
    const visitedNodes = dijkstra(grid, startNode, endNode);

    //Nodes only in the shortest path for Dijkstra
    const nodesInShortestPath = shortestPath(endNode);

    //animate all these Nodes involved in Dijkstra
    this.animateAlgorithm(visitedNodes, nodesInShortestPath);
  }

  //simulate animation effect by updating state one cell at a time every couple of milliseconds
  animateAlgorithm = async (visitedNodes, nodesInShortestPath) => {
    const delay = (ms) =>
      new Promise((resolve, reject) => setTimeout(resolve, ms));

    //animate the visited Nodes first
    for (let node of visitedNodes) {
      const grid = this.deepCopyGrid();
      grid[node.row][node.col] = node;
      this.setState({ grid: grid });
      await delay(10);
    }

    //then, let's animate the shortest path
    for (let node of nodesInShortestPath) {
      const grid = this.deepCopyGrid();
      grid[node.row][node.col] = { ...node, inShortestPath: true };
      this.setState({ grid: grid });
      await delay(10);
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

  //when mouse is pressed down on start or end node, allow it to be moved to elsewhere
  mouseDown(event, row, col) {
    //can't move start/end node when visualization in progress
    if (this.state.visualizing === true) {
      return;
    }
    event.preventDefault(); //causes some weird behavior if not included

    //need deep copy since we will update and set state
    const grid = this.deepCopyGrid();
    const node = grid[row][col];

    //dragging start node
    if (node.isStart === true) {
      node.isStart = false;
      this.setState({ grid: grid, nodeToDrag: "start", mousePressed: true });
    }

    //dragging end node
    else if (node.isEnd === true) {
      node.isEnd = false;
      this.setState({ grid: grid, nodeToDrag: "end", mousePressed: true });
    } else {
      return;
    }
  }

  //move whatever node we were dragging to cell when mouseup
  mouseUp(event, row, col) {
    //can't move start/end node when visualization in progress
    if (this.state.visualizing === true) {
      return;
    }

    event.preventDefault(); //causes some weird behavior if not included

    const grid = this.deepCopyGrid();

    //update state and global variables accordingly
    if (this.state.nodeToDrag === "start") {
      grid[row][col].isStart = true;
      START_ROW = row;
      START_COL = col;
    } else if (this.state.nodeToDrag === "end") {
      if (grid[row][col].isStart === true) {
        return;
      }
      grid[row][col].isEnd = true;
      END_ROW = row;
      END_COL = col;
    }
    this.setState({ grid: grid, nodeToDrag: "", mousePressed: false });
  }

  /*
  We care about mouseEnter when dragging start/end nodes. We treat the entered cell as the start/end node.
  We can then produce this animated effect as we drag it around.
  */
  mouseEnter(event, row, col) {
    //if algorithm running: ignore
    //if mouse is not down: ignore b/c we are not dragging anything
    if (this.state.visualizing === true || this.state.mousePressed === false) {
      return;
    }

    event.preventDefault();
    const grid = this.deepCopyGrid();

    //if we are dragging start/end node, set this cell as the start/end point
    if (this.state.nodeToDrag === "start") {
      grid[row][col].isStart = true;
    } else if (this.state.nodeToDrag === "end") {
      grid[row][col].isEnd = true;
    }

    this.setState({ grid: grid });
  }

  mouseOut(event, row, col) {
    if (this.state.visualizing === true || this.state.mousePressed === false) {
      return;
    }

    event.preventDefault();

    //when we leave a cell, reset whatever we did on this cell during mouseEnter
    if (this.state.nodeToDrag === "start") {
      this.state.grid[row][col].isStart = false;
    } else if (this.state.nodeToDrag === "end") {
      this.state.grid[row][col].isEnd = false;
    }
  }

  //resets Grid and rest of state to default conditions
  clearGrid() {
    //can't reset grid while visualization running
    if (this.state.visualizing === true) {
      return;
    }

    START_ROW = 0;
    START_COL = 0;
    END_ROW = this.state.grid.length - 1;
    END_COL = this.state.grid[0].length - 1;

    const grid = this.createGrid();
    this.setState({ grid: grid, nodeToDrag: "" });
  }

  render() {
    //get the current state of our 2d array of objects
    const grid = this.state.grid;

    //use HTML table to map each element in our array to a Node component
    return (
      <>
        <button
          className="visualizeButton"
          onClick={() => this.visualizeAlgorithm()}
        >
          Visualize Dijkstra
        </button>
        <button className="clearButton" onClick={() => this.clearGrid()}>
          Reset
        </button>
        <div className="grid">
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
                            isVisited={node.isVisited}
                            inShortestPath={node.inShortestPath}
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
