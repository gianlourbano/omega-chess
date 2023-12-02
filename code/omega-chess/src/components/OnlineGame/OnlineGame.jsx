"use client";

import { Chess } from "chess.js";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import AutoScrollBox from "../AutoScrollBox";
import * as io from "socket.io-client";
import { useSession } from "next-auth/react";
import Button from "../Button";
import CustomDialog from "../CustomDialog";
import DarkboardTimer from "../Darkboard/DarkboardTimer";
import useStopwatch from "@/hooks/useStopwatch";
import GameTranscript from "../Darkboard/GameTranscript";

//object for hiding black pieces
const blackHidden = {
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

//object for hiding white pieces
const whiteHidden = {
    wK: () => {
        return <></>;
    },
    wQ: () => {
        return <></>;
    },
    wP: () => {
        return <></>;
    },
    wR: () => {
        return <></>;
    },
    wB: () => {
        return <></>;
    },
    wN: () => { 
        return <></>;
    },
};

const OnlineGame = ({ room }) => {
    //socket hook
    //const [socket, setSocket] = useState();
    const socket = useRef(null);

    const [gamePosition, setGamePosition] = useState();
    const { data: session, status } = useSession();
    
    const [messages, setMessages] = useState([]);
    const [playerColor, setPlayerColor] = useState("white");

    //game over hooks
    const [gameOver, setGameOver] = useState(false);
    const [gameOverDialog, setGameOverDialog] = useState(false);
    const [transcript, setTranscript] = useState();

    //timer const
    const whitePlayerTimer = useStopwatch(1000 * 60); //(initial value in cs??)
    const blackPlayerTimer = useStopwatch(1000 * 60);

    //custom pieces hooks
    const [customPieces, setCustomPieces] = useState(blackHidden);

    //opponentName hook
    const [opponentName, setOpponentName] = useState("");

    useEffect(() => {
        fetch(`/api/games/lobby/${room}`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.whitePlayer === session?.user?.username) {
                    setPlayerColor("white");
                    setOpponentName(data.blackPlayer);
                    setCustomPieces(blackHidden);
                    console.log(data.whitePlayer);
                } else if (data.blackPlayer === session?.user?.username) {
                    setPlayerColor("black");
                    setOpponentName(data.whitePlayer);
                    setCustomPieces(whiteHidden);
                    console.log(data.blackPlayer);
                } else {
                    setPlayerColor("error");
                    console.log(
                        data.blackPlayer,
                        room,
                        data.gameType,
                        data.whitePlayer,
                        data.lookingForPlayer
                    );
                }
            })
            .then(() => {
                const s = io(process.env.NEXT_PUBLIC_SOCKET_BASE_URL, {
                    reconnection: false,
                    query: {
                        gameType: "online",
                        username: session && session.user.username,
                        color: playerColor,
                        room: room,
                    },
                });
                //setSocket(s);
                socket.current = s;

                s.on("connect", () => {
                    console.log("connected")
                    s.emit("ready", (msg) => {
                        console.log(msg);
                    })
                })

                s.on("opponent_connected", (name) => {
                    setOpponentName(name);
                })

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
            })
            .catch((error) => {
                console.error(
                    "Errore nel recupero del colore della lobby:",
                    error
                );
            });

        return () => {
            if (socket.current) {
                fetch("/api/games/lobby", {
                    method: "DELETE",
                    header: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ room: room }),
                });
                socket.current.emit("game_finished");
                socket.current.disconnect();
            }
        };
    }, []);

    // useEffect(() => {
    //     if (socket) {
    //         socket.emit("ready", (msg) => {
    //             console.log(msg);
    //         });
    //     }
    // }, [socket]);

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
            console.log(legalMove);
            socket.current.emit("make_move", legalMove);
        } catch (e) {
            console.log(e.message);
            return false;
        }
        return true;
    }

    const GameOverDialog = ({ open, setOpen, transcript }) => {
        return (
            <CustomDialog
                open={open}
                handleContinue={() => setOpen(false)}
                actions={
                    <Button color="primary" onClick={() => findGame()}>
                        New Game
                    </Button>
                }
            >
                <GameTranscript transcript={transcript} />
            </CustomDialog>
        );
    };

    const handleGameOver = (data) => {
        setGameOver(true);
        setTranscript(data);
        whitePlayerTimer.stop();
        blackPlayerTimer.stop();

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

    if (status === "loading") {
        return (
            <div className="h-full w-full flex items-center justify-center">
                {" "}
                <Spinner />{" "}
            </div>
        );
    }

    if (status === "unauthenticated") {
        const router = useRouter();
        router.push(`/login`);
    }

    if (status === "error") {
        return <div>Error!</div>;
    }
    /*
    if (!opponentName) {
        return <div className="h-full w-full flex items-center justify-center"> aspettando Liam </div>;
    }
    */
    return (
        <>
            {status === "authenticated" ? (
                <div className="text-center text-2xl">
                    Playing as {session.user.username} vs{" "}
                    {opponentName || "In attesa dell'avversario..."}
                </div>
            ) : (
                <div className="text-center text-2xl">Guestone</div>
            )}
            <GameOverDialog
                open={gameOverDialog}
                setOpen={setGameOverDialog}
                transcript={transcript}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 p-4 gap-5 max-h-screen">
                <div className="sm:col-span-3 flex flex-col gap-2 max-w-screen">
                    <DarkboardTimer timer={blackPlayerTimer} />
                    <Chessboard
                        id="onlineGame"
                        position={gamePosition} //la partita inizia appena si entra nella lobby, il tempo parte dopo la prima mossa
                        onPieceDrop={onDrop}
                        customPieces={customPieces} //??
                        customBoardStyle={{
                            borderRadius: "5px",
                        }}
                        boardOrientation={playerColor}
                    />
                    <DarkboardTimer timer={whitePlayerTimer} />
                </div>
                <div className="rounded-lg bg-zinc-700 sm:col-span-2 flex flex-col gap-3 h-[80vh] self-center p-3 shadow-[rgba(0,0,0,0.24)_0px_3px_8px]">
                    <h1 className="text-3xl text-center">Umpire</h1>

                    <Button
                        color="secondary"
                        onClick={() => socket.emit("resign_game")}
                    >
                        Resign
                    </Button>

                    <AutoScrollBox items={messages} className="hidden sm:block">
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
                </div>
            </div>
        </>
    );
};

export default OnlineGame;
