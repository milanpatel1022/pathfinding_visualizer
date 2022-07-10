import React, { Component } from "react";
import "./Node.css";

class Node extends Component {
  render() {
    const {
      row,
      col,
      isStart,
      isEnd,
      isWall,
      isVisited,
      inShortestPath,
      onMouseDown,
      onMouseUp,
      onMouseEnter,
      onMouseOut,
      onClick,
    } = this.props;

    //give start and end node a class name so we can style them accordingly.
    const nodeClass =
      inShortestPath && (isStart || isEnd)
        ? "special"
        : inShortestPath
        ? "shortest"
        : isStart
        ? "startPoint"
        : isEnd
        ? "endPoint"
        : isWall
        ? "wall"
        : isVisited
        ? "visited"
        : "";

    return (
      //each node has two classes. node class & an extra one to identify if it is a startPoint, endPoint or neither
      <div
        className={`node ${nodeClass}`}
        onMouseDown={(event) => onMouseDown(event, row, col)}
        onMouseUp={(event) => onMouseUp(event, row, col)}
        onMouseEnter={(event) => onMouseEnter(event, row, col)}
        onMouseOut={(event) => onMouseOut(event, row, col)}
        onClick={(event) => onClick(event, row, col)}
      ></div>
    );
  }
}

export default Node;
