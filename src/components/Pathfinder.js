import React, { Component } from 'react'

class Pathfinder extends Component {

    constructor() {
        super();
        this.state = {
            grid: [],
        };
    }

    //create the grid as soon as this component is inserted into the DOM & update state
    componentDidMount(){
        const newGrid = this.createGrid(15, 15);
        this.setState({grid: newGrid})
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
        return (
        <div>Pathfinder</div>
        )
    }
}

export default Pathfinder