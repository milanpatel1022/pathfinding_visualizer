import React, { Component } from 'react'
import Node from './Node'

import './Pathfinder.css'

class Pathfinder extends Component {

    constructor() {
        super();
        this.state = {
            grid: [],
        };
    }

    //create the grid as soon as this component is inserted into the DOM & update state.grid (which is initially an empty array)
    componentDidMount(){
        const newGrid = this.createGrid(25, 50);
        this.setState({grid: newGrid}, () => console.log(this.state.grid))
    }

    //create 2D array/grid of Nodes
    createGrid = (ROWS, COLS) => {
        const grid = []

        for (let row = 0; row < ROWS; row++){
            const curRow = []

            for (let col = 0; col < COLS; col++){
                const node = this.createNode(row, col)
                curRow.push(node)
            }

            grid.push(curRow)
        }

        return grid
    };

    //each Node stores: its row and col
    createNode = (row, col) => {
        return {
            row: row,
            col: col
        }
    }

    render() {
        const grid = this.state.grid;

        return (
            <div className = "grid">
                {grid.map((row, rowIdx) => {
                    return (
                        <div key={rowIdx}>
                            {row.map((node, nodeIdx) => {
                                return (
                                    <Node key={nodeIdx} row={row} col={nodeIdx}/>
                                )
                            })}
                        </div>
                    );
                })}
            </div>
        )
    }
}

export default Pathfinder