import React, { Component } from 'react'
import Node from './Node'
import { dijkstra, shortestPath } from '../algorithms/dijkstra'

import './Pathfinder.css'

const rows = 3
const cols = 4

const START_ROW = 0
const START_COL = 0
const END_ROW = rows-1
const END_COL = cols-1

class Pathfinder extends Component {

    constructor() {
        super();
        this.state = {
            grid: [], //our 2d array of Objects
        };
    }

    //create the grid as soon as this component is inserted into the DOM & update state.grid (which is initially an empty array)
    componentDidMount(){
        const newGrid = this.createGrid();
        this.setState({grid: newGrid})
    }

    //create 2D array/grid (each cell is an object containing info.)
    createGrid = () => {
        const grid = []

        for (let row = 0; row < rows; row++){
            const curRow = []

            for (let col = 0; col < cols; col++){
                const node = this.createCell(row, col)
                curRow.push(node)
            }

            grid.push(curRow)
        }

        return grid
    };

    createCell = (row, col) => {
        return {
            row: row,
            col: col,
            isStart: row === START_ROW && col === START_COL, //to identify start point
            isEnd: row === END_ROW && col === END_COL, //to identify end point
            distance: Infinity, //for Dijkstra
            isVisited: false, //visited Nodes will be styled
            prevNode: null, //need to know for Dijkstra to identify shortest path
        }
    }

    visualizeAlgorithm() {
        const grid = this.state.grid;
        const startNode = grid[START_ROW][START_COL];
        const endNode = grid[END_ROW][END_COL];

        //all the Nodes used in Dijkstra
        const visitedNodes = dijkstra(grid, startNode, endNode);
        
        //Nodes in the shortest path for Dijkstra
        const nodesInShortestPath = shortestPath(endNode);
    }

    render() {
        //get the current state of our 2d array of objects
        const grid = this.state.grid;

        //use HTML table to map each element in our array to a Node component
        return (
            <>
                <button onClick = {() => this.visualizeAlgorithm()}>
                    Visualize Dijkstra
                </button>
                <div className = "grid">
                    <table>
                        <tbody>
                            {grid.map((row, rowIdx) => {
                                return (
                                    <tr key={rowIdx}>
                                        {row.map((node, nodeIdx) => {
                                            return (
                                                <td key={nodeIdx}>
                                                    <Node row={row} col={nodeIdx} isStart={node.isStart} isEnd={node.isEnd}/>
                                                </td>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
}

export default Pathfinder