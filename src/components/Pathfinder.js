import React, { Component } from 'react'
import Node from './Node'

import './Pathfinder.css'

class Pathfinder extends Component {

    constructor() {
        super();
        this.state = {
            grid: [], //our 2d array/grid
        };
    }

    //create the grid as soon as this component is inserted into the DOM & update state.grid (which is initially an empty array)
    componentDidMount(){
        const newGrid = this.createGrid(25, 40);
        this.setState({grid: newGrid}, () => console.log(this.state.grid))
    }

    //create 2D array/grid (each cell is an object containing info.)
    createGrid = (ROWS, COLS) => {
        const grid = []

        for (let row = 0; row < ROWS; row++){
            const curRow = []

            for (let col = 0; col < COLS; col++){
                const node = this.createCell(row, col)
                curRow.push(node)
            }

            grid.push(curRow)
        }

        return grid
    };

    //each cell stores: its row and col (for now)
    createCell = (row, col) => {
        return {
            row: row,
            col: col
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
                                                <Node row={row} col={nodeIdx}/>
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