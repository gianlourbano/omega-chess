"use client";

import { Chess } from "chess.js";
import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import AutoScrollBox from "../AutoScrollBox";
import * as io from "socket.io-client";
import GameTranscript from "./GameTranscript";
import { useSession } from "next-auth/react";
import Button from "../Button";
import CustomDialog from "../CustomDialog";
import DarkboardTimer from "./DarkboardTimer";
import useStopwatch from "@/hooks/useStopwatch";
import QuickRules from "../QuickRules";

import { useNewGame } from "@/components/Darkboard/PlayDarkboard";

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

const GameOverDialog = ({ open, setOpen, transcript }) => {
    const { isLoading: newGameLoading, startGame } = useNewGame();

    return (
        <CustomDialog
            open={open}
            handleContinue={() => setOpen(false)}
            actions={
                <Button color="primary" onClick={() => startGame("darkboard")}>
                    New Game
                </Button>
            }
        >
            <GameTranscript transcript={transcript} />
        </CustomDialog>
    );
};

const DarkboardGame = ({ room }) => {
    const [socket, setSocket] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [transcript, setTranscript] = useState();
    const [gameOverDialog, setGameOverDialog] = useState(false);

    const { data: session, status } = useSession();

    const [quickRules, setQuickRules] = useState(false);

    useEffect(() => {
        const s = io(process.env.NEXT_PUBLIC_SOCKET_BASE_URL, {
            reconnection: false,
            query: {
                username: session ? session.user.username : "guest",
                room: room,
                gameType: "darkboard",
            },
            path: process.env.NEXT_PUBLIC_SOCKETIO_PATH,
        });
        setSocket(s);

        s.on("connect", () => {
            console.log("connected");
            s.emit("ready", () => {
                whitePlayerTimer.start();
                blackPlayerTimer.stop();
            });
        });

        s.on("chessboard_changed", (data) => {
            setGamePosition(data);
            //get turn from FEN string
            const turn = data.split(" ")[1];
            console.log(turn);
            if (turn === "b") {
                whitePlayerTimer.stop();
                blackPlayerTimer.start();
            } else {
                whitePlayerTimer.start();
                blackPlayerTimer.stop();
            }
        });

        s.on("game_over", (data) => {
            handleGameOver(data);
        });

        s.on("read_message", (data) => addMessage(data));

        return () => {
            fetch("/api/games/lobby", {
                method: "DELETE",
                header: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ room: room }),
            });
            s.emit("game_finished");
            s.disconnect();
        };
    }, []);

    const handleGameOver = (data) => {
        setGameOver(true);
        setTranscript(data);
        blackPlayerTimer.stop();
        whitePlayerTimer.stop();

        // escape all quotes in the pgn
        //const escaped = data.replace(/"/g, '\"')
        if (session && session.user) {
            fetch(`/api/users/${session.user.username}/games`, {
                method: "PUT",
                header: {
                    "Content-Type": "text/plain",
                },
                body: data,
            });

            fetch("/api/games/lobby", {
                method: "DELETE",
                header: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ room: room }),
            });
        }

        setGameOverDialog(true);
    };

    const addMessage = (message) => {
        setMessages((messages) => [...messages, message]);
    };

    function onDrop(sourceSquare, targetSquare, piece) {
        let move = null;
        try {
            move = {
                from: sourceSquare,
                to: targetSquare,
                promotion: piece[1].toLowerCase() ?? "q",
            };

            const game = new Chess(gamePosition);
            const legalMove = game.move(move).san;
            socket.emit("make_move", legalMove);
        } catch (e) {
            return false;
        }
        return true;
    }

    const [gamePosition, setGamePosition] = useState();
    const [customPieces, setCustomPieces] = useState(hidden);
    const [messages, setMessages] = useState([]);

    const whitePlayerTimer = useStopwatch(10 * 60);
    const blackPlayerTimer = useStopwatch(10 * 60);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (status === "unauthenticated") {
        return <div>Unauthenticated!</div>;
    }

    if (status === "error") {
        return <div>Error!</div>;
    }

    return (
        <>
            <GameOverDialog
                open={gameOverDialog}
                setOpen={setGameOverDialog}
                transcript={transcript}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 p-4 gap-5 max-h-screen">
                <div className="sm:col-span-3 flex flex-col gap-2 max-w-screen">
                    {status === "authenticated" && (
                        <div className="text-center text-2xl">
                            Playing as {session.user.username}
                        </div>
                    )}
                    <Button color="primary" onClick={() => setCustomPieces({})}>
                        Show opponent
                    </Button>
                    <DarkboardTimer timer={blackPlayerTimer} />
                    <Chessboard
                        id="PlayVsStockfish"
                        position={gamePosition}
                        onPieceDrop={onDrop}
                        customPieces={customPieces}
                        customBoardStyle={{
                            borderRadius: "5px",
                        }}
                    />
                    <DarkboardTimer timer={whitePlayerTimer} />
                </div>
                <div className="rounded-lg bg-zinc-700 sm:col-span-2 flex flex-col gap-3 h-[80vh] self-center p-3 shadow-[rgba(0,0,0,0.24)_0px_3px_8px]">
                    <div className="flex flex-row justify-center gap-3">
                        <Button
                            className="text-2xl text-center"
                            color="primary"
                            onClick={() => setQuickRules(false)}
                        >
                            Umpire
                        </Button>
                        <Button
                            className="text-2xl text-center"
                            color="primary"
                            onClick={() => setQuickRules(true)}
                        >
                            Quick Rules
                        </Button>
                    </div>
                    {!quickRules && (
                        <>
                            <Button
                                color="secondary"
                                onClick={() => socket.emit("resign_game")}
                            >
                                Resign
                            </Button>

                            <AutoScrollBox
                                items={messages}
                                className="hidden sm:block"
                            >
                                {messages.map((message, index) => (
                                    <p key={index} className="rounded p-1">
                                        {message}
                                    </p>
                                ))}
                            </AutoScrollBox>
                            <div className="sm:hidden flex flex-col-reverse gap-1 overflow-y-auto">
                                {messages.map((message, index) => (
                                    <p key={index} className="rounded p-2">
                                        {message}
                                    </p>
                                ))}
                            </div>
                        </>
                    )}
                    {quickRules && <QuickRules />}
                </div>
            </div>
        </>
    );
};

export default DarkboardGame;
