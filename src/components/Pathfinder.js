import React, { Component } from 'react'
import Node from './Node'

import './Pathfinder.css'

const rows = 25
const cols = 40

const START_ROW = 0
const START_COL = 0
const END_ROW = rows-1
const END_COL = cols-1

class Pathfinder extends Component {

    constructor() {
        super();
        this.state = {
            grid: [], //our 2d array/grid
        };
    }

    //create the grid as soon as this component is inserted into the DOM & update state.grid (which is initially an empty array)
    componentDidMount(){
        const newGrid = this.createGrid();
        this.setState({grid: newGrid}, () => console.log(this.state.grid))
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

    //each cell stores: its row and col & if it is the starting/end point
    createCell = (row, col) => {
        return {
            row: row,
            col: col,
            isStart: row === START_ROW && col === START_COL,
            isEnd: row === END_ROW && col === END_COL,
        }
    }

    render() {
        //get the current state of our 2d array of objects
        const grid = this.state.grid;

        return (
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
        )
    }
}

export default Pathfinder