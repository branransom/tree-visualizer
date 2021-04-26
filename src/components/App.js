import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import * as Chess from "chess.js";
import ChessBoard from "./ChessBoard";
import DecisionTree from "./DecisionTree";
import TranspositionTable from "./TranspositionTable";
import "./style.scss";

const nextMove = async ({ fen }) => {
  const { data } = await axios.post("http://localhost:5000/next_move", {
    fen,
  });

  return data.fen;
};

const handleReset = async () => {
  await axios.post("http://localhost:5000/reset");
};

const App = () => {
  const [position, setPosition] = useState(
    "r5rk/5p1p/5R2/4B3/8/8/7P/7K w - - 0 1"
  );
  const [decisionTree, setDecisionTree] = useState([{ id: "root" }]);

  const game = new Chess(position);

  const handleMove = async ({ sourceSquare, targetSquare }) => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for simplicity
    });

    // Illegal move
    if (move === null) return;

    const fen = game.fen();

    setPosition(fen);

    const nextFEN = await nextMove({ fen });

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
            <Route exact path="/">
              <div>Teaching a computer how to play chess</div>
            </Route>
            <Route path="/chess-board">
              <ChessBoard
                position={position}
                handleMove={handleMove}
                handleReset={handleReset}
              />
            </Route>
            <Route path="/decision-tree">
              <DecisionTree decisionTree={decisionTree} />
            </Route>
            <Route path="/transposition-table">
              <TranspositionTable />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
