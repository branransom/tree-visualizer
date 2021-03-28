import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ChessBoard from "./ChessBoard";
import DecisionTree from "./DecisionTree";
import TranspositionTable from "./TranspositionTable";
import "./style.scss";

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/chess-board">Chess Board</Link>
            </li>

            <li>
              <Link to="/decision-tree">Decision Tree</Link>
            </li>
            <li>
              <Link to="/transposition-table">Transposition Table</Link>
            </li>
          </ul>
        </nav>
        <div id="container">
          <Switch>
            <Route path="/chess-board">
              <ChessBoard />
            </Route>
            <Route path="/decision-tree">
              <DecisionTree />
            </Route>
            <Route path="/transposition-table">
              <TranspositionTable />
            </Route>
            <Route exact path="/">
              <div>Teaching a computer how to play chess</div>
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
