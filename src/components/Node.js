import React, { Component } from "react";
import "./Node.css";

class Node extends Component {
  render() {
    const { row, col, isStart, isEnd, isVisited, inShortestPath } = this.props;

    //give start and end node a class name so we can style them accordingly.
    const nodeClass = isStart
      ? "startPoint"
      : isEnd
      ? "endPoint"
      : inShortestPath && (isStart || isEnd)
      ? "special"
      : inShortestPath
      ? "shortest"
      : isVisited
      ? "visited"
      : "";

    return (
      //each node has two classes. node class & an extra one to identify if it is a startPoint, endPoint or neither
      <div className={`node ${nodeClass}`}></div>
    );
  }
}

export default Node;
