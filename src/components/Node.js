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
      isWeight,
      isVisited,
      inShortestPath,
      currentNodeToAnimate,
      onMouseDown,
      onMouseUp,
      onMouseEnter,
      onMouseOut,
      onClick,
    } = this.props;

    //give certain nodes an extra class name to identify them and style them accordingly.
    const nodeClass =
      inShortestPath && isStart
        ? "special fa-solid fa-angle-right fa-xl"
        : inShortestPath && isEnd
        ? "special fa-solid fa-flag"
        : inShortestPath && isWeight
        ? "shortest fa-solid fa-weight-hanging"
        : inShortestPath
        ? "shortest"
        : isStart
        ? "fa-solid fa-angle-right fa-xl"
        : isEnd
        ? "fa-solid fa-flag"
        : isWall
        ? "fa-solid fa-x"
        : isWeight && currentNodeToAnimate
        ? "special"
        : isWeight && isVisited
        ? "visited fa-solid fa-weight-hanging"
        : isWeight
        ? "fa-solid fa-weight-hanging"
        : currentNodeToAnimate
        ? "special"
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
