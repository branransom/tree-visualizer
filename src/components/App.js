import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import * as Chess from "chess.js";
import ChessBoard from "./ChessBoard";
import DecisionTree from "./DecisionTree";
import TranspositionTable from "./TranspositionTable";
import "./style.scss";

const { CHESS_AI_URI } = process.env;

const nextMove = async ({ fen }) => {
  const { data } = await axios.post(`${CHESS_AI_URI}/next_move`, {
    fen,
  });

  return data.fen;
};

const STARTING_FEN =
  "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 0 1";

const App = () => {
  const [position, setPosition] = useState(STARTING_FEN);
  const [decisionTree, setDecisionTree] = useState([{ id: "root" }]);
  const [principalVariation, setPrincipalVariation] = useState([]);

  const game = new Chess(position);

  const handleReset = async () => {
    await axios.post(`${CHESS_AI_URI}/reset`);

    setPosition(STARTING_FEN);
  };

  const updateDecisionTree = async () => {
    const { data } = await axios.get(`${CHESS_AI_URI}/decision_tree`);
    setDecisionTree([{ id: "root" }, ...data]);
  };

  const updatePrincipalVariation = async () => {
    const { data } = await axios.get(`${CHESS_AI_URI}/principal_variation`);
    setPrincipalVariation(data);
  };

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

    updateDecisionTree();
    updatePrincipalVariation();
  };

  return (
    <Router>
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
            <DecisionTree
              decisionTree={decisionTree}
              principalVariation={principalVariation}
            />
          </Route>
          <Route path="/transposition-table">
            <TranspositionTable />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
