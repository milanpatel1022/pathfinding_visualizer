import React from "react";
import "./Legend.css";

function Legend() {
  return (
    <div className="container">
      <div className="legend">
        <div className="legendKey fa-solid fa-angle-right fa-xl"></div>
        <div className="legendKey">Start Node</div>
      </div>
      <div className="legend">
        <div className="legendKey fa-solid fa-flag"></div>
        <div className="legendKey">End Node</div>
      </div>
      <div className="legend">
        <div className="legendKey fa-solid fa-x"></div>
        <div className="legendKey">Wall Node</div>
      </div>
      <div className="legend">
        <div className="legendKey fa-solid fa-weight-hanging"></div>
        <div className="legendKey">Weight Node</div>
      </div>
      <div className="legend">
        <div className="legendKey legendNode"></div>
        <div className="legendKey">Unvisited Node</div>
      </div>
      <div className="legend">
        <div className="legendKey legendNode visited"></div>
        <div className="legendKey">Visited Node</div>
      </div>
      <div className="legend">
        <div className="legendKey legendNode shortest"></div>
        <div className="legendKey">Shortest Path Node</div>
      </div>
      <div className="legend">
        <div className="legendKey legendNode special"></div>
        <div className="legendKey">Current Node</div>
      </div>
    </div>
  );
}

export default Legend;
