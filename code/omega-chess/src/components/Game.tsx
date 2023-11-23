"use client";

import { useState, useMemo, useEffect, useRef, forwardRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess, Move, Square } from "chess.js";
import { CustomSquareProps } from "react-chessboard/dist/chessboard/types";
import Button from "./Button";
import CustomDialog from "./CustomDialog";
import { redirect } from "next/navigation";
import AutoScrollBox from "./AutoScrollBox";

interface PlayerInfoProps {
    name: string;
    color: string;
    time?: number;
    turn?: boolean;
    pCaptured: number;
    oCaptured: number;
}

const PlayerInfo = (props: PlayerInfoProps) => {
    const turnClassName = props.turn ? "bg-green-500" : "bg-gray-500";

    return (
        <div
            className={`flex flex-row items-center border p-2 sm:w-[40%] w-full rounded-lg text-lg ${turnClassName}`}
        >
            <div>{props.name} </div>
            <div className="flex flex-col items-center ml-auto">
                <p>Pawns: {props.pCaptured}</p>
                <p>Others: {props.oCaptured}</p>
            </div>
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
        setCaptures({
            wP: 0,
            wO: 0,
            bP: 0,
            bO: 0,
        });
        setGameOver(false);
        setIsCheck(false);
    };

    const [gamePosition, setGamePosition] = useState(game.fen());
    const [customPieces, setCustomPieces] = useState<any>(hidden);
    const [messages, setMessages] = useState<string[]>([]);

    const [isCheck, setIsCheck] = useState(false);

    const [gameOver, setGameOver] = useState(false);

    const [captures, setCaptures] = useState<{ [key: string]: number }>({
        wP: 0,
        wO: 0,
        bP: 0,
        bO: 0,
    });

    const addMessage = (message: string) => {
        if (messages.length > 0) {
            if (messages[messages.length - 1] === message) return;
            //if message contains error remove the last message
            if (message.includes("error")) {
                setMessages((messages) => [...messages.slice(0, -1), message]);
                return;
            }
        }
        setMessages((messages) => [...messages, message]);
    };

    const checkForCapture = () => {
        const h = game.history({ verbose: true })[game.history().length - 1];
        if (h.captured) {
            addMessage(
                getTurn(true) +
                    " captured " +
                    (h.captured === "p" ? "Pawn" : "a piece")
            );

            if (getTurn(true) === "White") {
                setCaptures({
                    ...captures,
                    [h.captured === "p" ? "wP" : "wO"]:
                        captures[h.captured === "p" ? "wP" : "wO"] + 1,
                });
            } else {
                setCaptures({
                    ...captures,
                    [h.captured === "p" ? "bP" : "bO"]:
                        captures[h.captured === "p" ? "bP" : "bO"] + 1,
                });
            }
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
        setTimeout(
            () => {
                let advMove =
                    game.moves()[
                        Math.floor(Math.random() * game.moves().length)
                    ];
                game.move(advMove);
                checkForCapture();
                setGamePosition(game.fen());

                postMoveChecks();
            },
            game.isCheck() ? 1500 : 500
        );
    }

    function onDrop(sourceSquare: Square, targetSquare: Square, piece: any) {
        let move = null;
        try {
            move = {
                from: sourceSquare,
                to: targetSquare,
                promotion: piece[1].toLowerCase() ?? "q",
            };
            move = game.move(move);
            checkForCapture();
            setGamePosition(game.fen());
        } catch (e: any) {
            addMessage(reduceError(e.message));
            return false;
        }

        // illegal move
        if (move === null) return false;

        // exit if the game is over
        postMoveChecks();

        selectRandomMove();
        return true;
    }

    const getAllPawns = (color: string) => {
        const pieces: Square[] = [];
        game.board().forEach((row, i) => {
            row.forEach((piece, j) => {
                if (piece?.type === "p" && piece?.color === color) {
                    pieces.push(piece.square);
                }
            });
        });
        return pieces;
    };

    const getAllPawnsCaptures = (color: string, pawns: Square[]) => {
        const captures: Square[] = [];
        pawns.forEach((pawn) => {
            const moves = game.moves({ square: pawn, verbose: true });
            moves.forEach((move) => {
                if (move.captured) {
                    captures.push(move.to);
                }
            });
        });

        let message = "";

        switch (captures.length) {
            case 0:
                message =
                    "There are no pawn captures for " +
                    (color === "w" ? "White" : "Black");
                break;
            case 1:
                message =
                    "There is 1 pawn capture for " +
                    (color === "w" ? "White" : "Black");
                break;
            default:
                message =
                    "There are " +
                    captures.length +
                    " pawn captures for " +
                    (color === "w" ? "White" : "Black");
                break;
        }

        addMessage(message);
    };

    const whoWon = () => {
        if (game.isCheckmate()) {
            return game.turn() === "w" ? "Black won!" : "White won!";
        } else if (game.isDraw()) return "Draw!";
        else if (game.isStalemate()) return "Stalemate!";
        else return "White lost!";
    };

    const pawns = () => {
        return "Pawns captures: " + captures.wP;
    };

    const others = () => {
        return "Others captures: " + captures.wO;
    };

    return (
        <div>
            DarkboardGame
        </div>
    );
};

export default Game;
