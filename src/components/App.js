import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ChessBoard from "./ChessBoard";
import DecisionTree from "./DecisionTree";
import TranspositionTable from "./TranspositionTable";
import "./style.scss";

const move = async ({ fen, sourceSquare, targetSquare }) => {
  const { data } = await axios.post("http://localhost:5000/move", {
    fen,
    sourceSquare,
    targetSquare,
  });

  return data.fen;
};

const nextMove = async ({ fen }) => {
  console.log(fen);
  const { data } = await axios.post("http://localhost:5000/next_move", {
    fen,
  });

  return data.fen;
};

const App = () => {
  const [position, setPosition] = useState("r5rk/5p1p/5R2/4B3/8/8/7P/7K w");
  const [decisionTree, setDecisionTree] = useState([{ id: "root" }]);

  const handleMove = async ({ sourceSquare, targetSquare }) => {
    const fen = await move({ fen: position, sourceSquare, targetSquare });

    console.log("fen: ", fen);

    const nextFEN = await nextMove({ fen });

    console.log("next fen: ", nextFEN);

    setPosition(nextFEN);

    const result = await axios.get("http://localhost:5000/decision_tree");
    setDecisionTree([{ id: "root" }, ...result.data]);
  };

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
              <ChessBoard position={position} handleMove={handleMove} />
            </Route>
            <Route path="/decision-tree">
              <DecisionTree decisionTree={decisionTree} />
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
