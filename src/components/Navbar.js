import React, { Component } from "react";
import "./Navbar.css";

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      algorithm: "",
      speed: "Fast",
      toggleWalls: false,
      toggleWeights: false,
      visualizeAlgorithm: this.props.visualizeAlgorithm,
      resetGrid: this.props.resetGrid,
    };

    console.log(this.state);
  }

  wallWeightToggler(wallOrWeight) {
    console.log("in toggler");
    if (wallOrWeight === "wall") {
      this.setState((prevState) => ({
        toggleWalls: !prevState.toggleWalls,
        toggleWeights: false,
      }));
    } else {
      this.setState((prevState) => ({
        toggleWalls: false,
        toggleWeights: !prevState.toggleWeights,
      }));
    }
  }

  runAlgorithm() {
    const { algorithm, speed, visualizeAlgorithm } = this.state;

    if (algorithm === "") {
      return;
    }
    visualizeAlgorithm(algorithm, speed);
  }

  render() {
    const { algorithm, speed, toggleWalls, toggleWeights } = this.state;

    //style Wall/Weight buttons in navbar if they are selected
    let wallButtonStyle = {
      color: toggleWalls ? "lightblue" : "",
    };

    let weightButtonStyle = {
      color: toggleWeights ? "lightblue" : "",
    };

    //Update visualize button to represent what algorithm the user has selected
    let visualizeButtonText =
      algorithm === "" ? "Choose an Algorithm" : `Visualize ${algorithm}`;

    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <button
              className="navbar-brand"
              onClick={() => window.location.reload(false)}
            >
              Pathfinding Visualizer
            </button>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavDarkDropdown"
              aria-controls="navbarNavDarkDropdown"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarNavDarkDropdown"
            >
              <ul className="navbar-nav header-item">
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDarkDropdownMenuLink"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Algorithms
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-dark"
                    aria-labelledby="algorithm selection dropdown"
                  >
                    <li>
                      <button
                        onClick={() => this.setState({ algorithm: "Dijkstra" })}
                        className="dropdown-item"
                        type="button"
                      >
                        Dijkstra
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => this.setState({ algorithm: "BFS" })}
                        className="dropdown-item"
                        type="button"
                      >
                        Breadth-first Search
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => this.setState({ algorithm: "DFS" })}
                        className="dropdown-item"
                        type="button"
                      >
                        Depth-first Search
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
              <ul className="navbar-nav header-item">
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDarkDropdownMenuLink"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Speed: {speed}
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-dark"
                    aria-labelledby="algorithm selection dropdown"
                  >
                    <li>
                      <button
                        onClick={() => this.setState({ speed: "Fast" })}
                        className="dropdown-item"
                        type="button"
                      >
                        Fast
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => this.setState({ speed: "Normal" })}
                        className="dropdown-item"
                        type="button"
                      >
                        Normal
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => this.setState({ speed: "Slow" })}
                        className="dropdown-item"
                        type="button"
                      >
                        Slow
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
              <button
                className="otherButtons"
                style={wallButtonStyle}
                onClick={() => {
                  this.wallWeightToggler("wall");
                }}
              >
                Walls
              </button>
              <button
                className="otherButtons"
                style={weightButtonStyle}
                onClick={() => {
                  this.wallWeightToggler("weight");
                }}
              >
                Weights
              </button>
              <button
                className="visualizeButton"
                onClick={() => this.runAlgorithm()}
              >
                {visualizeButtonText}
              </button>
              <button
                className="otherButtons"
                onClick={() => this.state.resetGrid()}
              >
                Reset Grid
              </button>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

export default Navbar;
