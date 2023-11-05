"use client"
import { useState, useMemo, useCallback, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Move, Piece, Square } from "chess.js";
import CustomDialog from "@/components/CustomDialog";

function Game() {
    const chess = useMemo(() => new Chess(), []); // <- 1
    const [fen, setFen] = useState(chess.fen()); // <- 2
    const [over, setOver] = useState("");
    const [lastMove, setLastMove] = useState<any>(null);
  
    const makeAMove = useCallback(
      (move: Move) => {
        try {
          const result = chess.move(move); // update Chess instance
          setFen(chess.fen()); // update fen state to trigger a re-render
  
          setLastMove({
            color: move.color,
            sourceSquare: move.from,
            targetSquare: move.to,
            piece: result?.piece,
          }); // set last move to the target square of the move
    
          console.log("over, checkmate", chess.isGameOver(), chess.isCheckmate());
    
          if (chess.isGameOver()) { // check if move led to "game over"
            if (chess.isCheckmate()) { // if reason for game over is a checkmate
              // Set message to checkmate. 
              setOver(
                `Checkmate! ${chess.turn() === "w" ? "black" : "white"} wins!`
              ); 
              // The winner is determined by checking which side made the last move
            } else if (chess.isDraw()) { // if it is a draw
              setOver("Draw"); // set message to "Draw"
            } else {
              setOver("Game over");
            }
          }
    
          return result;
        } catch (e) {
          console.log(e)
          return null;
        } // null if the move was illegal, the move object if the move was legal
      },
      [chess]
    );
  
    // onDrop function
    function onDrop(sourceSquare: Square, targetSquare: Square, piece: any) {
      const moveData = {
        from: sourceSquare,
        to: targetSquare,
        color: chess.turn(),
        promotion: "q",
      } as Move;
  
      const move = makeAMove(moveData);
  
      // illegal move
      if (move === null) return false;
  
      return true;
    }
    
    // Game component returned jsx
    return (
      <>
      <div>
        {lastMove && <p>last move: {lastMove?.sourceSquare} -&gt; {lastMove?.targetSquare} with {lastMove?.piece} ({lastMove?.color})</p>}
      </div>
        <div className="board">
          <Chessboard position={fen} onPieceDrop={onDrop} />  {/**  <- 4 */}
        </div>
        <CustomDialog // <- 5
          open={Boolean(over)}
          title={over}
          contentText={over}
          handleContinue={() => {
            setOver("");
          }}
        />
      </>
    );
  }
  
  export default Game;