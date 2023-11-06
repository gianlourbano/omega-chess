"use client";

import { useState, useMemo } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Move, Square } from "chess.js";

interface PlayerInfoProps {
    name: string;
    color: string;
    time?: number;
    turn?: boolean;
}

const PlayerInfo = (props: PlayerInfoProps) => {
    const turnClassName = props.turn ? "bg-green-500" : "bg-gray-500";

    return (
        <div
            className={`border p-2 w-[40%] rounded-lg text-lg ${turnClassName}`}
        >
            <div>{props.name}</div>
        </div>
    );
};

const Game = () => {
    const game = useMemo(() => new Chess(), []);

    const hidden = {
        bK: () => {
            return <div style={{ display: "none" }}></div>;
        },
        bQ: () => {
            return <></>;
        },
        bP: () => {
            return <></>;
        },
        bR: () => {
            return <></>;
        },
        bB: () => {
            return <></>;
        },
        bN: () => {
            return <></>;
        },
    };

    const resetAll = () => {
        game.reset();
        setGamePosition(game.fen());
        setCustomPieces(hidden);
        setMessages([]);
    };

    const [gamePosition, setGamePosition] = useState(game.fen());
    const [customPieces, setCustomPieces] = useState<any>(hidden);
    const [messages, setMessages] = useState<string[]>([]);

    const [isCheck, setIsCheck] = useState(false);

    const [gameOver, setGameOver] = useState(false);

    const addMessage = (message: string) => {
        setMessages((messages) => [...messages, message]);
    };

    const checkForCapture = (move: Move) => {
        if (game.get(move.to) !== null) {
            addMessage(getTurn() + " captured " + game.get(move.to)?.type);
        }
    };

    const postMoveChecks = () => {
        if (game.isGameOver() || game.isDraw()) {
            setCustomPieces(undefined);
            addMessage("Game over"!);
            setGameOver(true);
            return false;
        }

        if (game.isStalemate()) addMessage("Stalemate"!);
        if (game.isCheck()) {
            setIsCheck(true);
            addMessage(getTurn() + " is in Check"!);
        } else {
            setIsCheck(false);
        }
    };

    const getTurn = (opp?: boolean): string =>
        game.turn() === (opp ? "b" : "w") ? "White" : "Black";

    function reduceError(error: string) {
        const json = error.replace(/Invalid move: /, "");
        const message = JSON.parse(json);
        return (
            getTurn() +
            " error: " +
            "from " +
            message.from +
            " to " +
            message.to
        );
    }

    function selectRandomMove() {
        setTimeout(() => {
            let advMove =
                game.moves()[Math.floor(Math.random() * game.moves().length)];
            game.move(advMove);
            setGamePosition(game.fen());

            postMoveChecks();
        }, 500);
    }

    function onDrop(sourceSquare: Square, targetSquare: Square, piece: any) {
        let move = null;
        try {
            move = game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: piece[1].toLowerCase() ?? "q",
            });
            setGamePosition(game.fen());
        } catch (e: any) {
            addMessage(reduceError(e.message));
        }

        // illegal move
        if (move === null) return false;

        // exit if the game is over
        postMoveChecks();

        selectRandomMove();
        return true;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 p-4 gap-2">
            <div className="sm:col-span-3 flex flex-col gap-2 max-w-screen">
                <PlayerInfo
                    name="RandomBot"
                    color="black"
                    turn={game.turn() === "b"}
                />
                <Chessboard
                    id="PlayVsStockfish"
                    position={gamePosition}
                    onPieceDrop={onDrop}
                    //customPieces={customPieces}
                    customBoardStyle={{
                        borderRadius: "5px",
                        boxShadow: isCheck
                            ? game.turn() === "w"
                                ? "0px 0px 15px 5px #FF0000"
                                : "0px 0px 15px 5px #19FF6C"
                            : "0 5px 15px rgba(0, 0, 0, 0.5)",
                    }}
                />
                <PlayerInfo
                    name="Player"
                    color="white"
                    turn={game.turn() === "w"}
                />
            </div>
            <div className="flex flex-col gap-1">
                Umpire
                {messages.map((message, index) => (
                    <p key={index}>{message}</p>
                ))}
            </div>
        </div>
    );
};

export default Game;
 ..