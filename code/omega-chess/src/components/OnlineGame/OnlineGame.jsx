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
import QuickRules from "../QuickRules";
import Spinner from "../Spinner";

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

const OnlineGame = ({ room, joining_from_link }) => {
    //socket hook
    //const [socket, setSocket] = useState();
    const socket = useRef(null);

    const [gamePosition, setGamePosition] = useState();
    const { data: session, status } = useSession();

    const [messages, setMessages] = useState([]);

    //game over hooks
    const [gameOver, setGameOver] = useState(false);
    const [gameOverDialog, setGameOverDialog] = useState(false);
    const [transcript, setTranscript] = useState();

    //timer const
    const whitePlayerTimer = useStopwatch(10 * 60); //(initial value in cs??)
    const blackPlayerTimer = useStopwatch(10 * 60);

    //custom pieces hooks
    const [customPieces, setCustomPieces] = useState(blackHidden);
    const router = useRouter();

    //opponentName hook
    const [opponentName, setOpponentName] = useState("");

    const [quickRules, setQuickRules] = useState(false);

    const playerColor = useRef("error");

    const [opponentElo, setOpponentElo] = useState(0);
    const [ownElo, setOwnElo] = useState(0);

    useEffect(() => {
        if (status === "authenticated") {
            const link = joining_from_link
                ? `/api/games/lobby/${room}?join`
                : `/api/games/lobby/${room}`;
            fetch(link, {
                method: "GET",
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        throw new Error(data.error);
                    }

                    console.log("SEssion", session?.user?.username);
                    if (data.whitePlayer === session?.user?.username) {
                        console.log("HERE");
                        playerColor.current = "white";
                        console.log("HERE : ", playerColor);
                        setOpponentName(data.blackPlayer);
                        setCustomPieces(blackHidden);
                        console.log(data.whitePlayer, playerColor.current);
                    } else if (data.blackPlayer === session?.user?.username) {
                        playerColor.current = "black";
                        setOpponentName(data.whitePlayer);
                        setCustomPieces(whiteHidden);
                        console.log(data.blackPlayer, playerColor.current);
                    }
                    if (playerColor.current === "error")
                        console.log(data, room);
                })
                .then(() => {
                    let s = io(process.env.NEXT_PUBLIC_SOCKET_BASE_URL, {
                        reconnection: false,
                        query: {
                            gameType: "online",
                            username: session && session.user.username,
                            color: playerColor.current,
                            room: room,
                        },
                        path: process.env.NEXT_PUBLIC_SOCKETIO_PATH,
                    });
                    //setSocket(s);
                    socket.current = s;

                    s.on("connect", () => {
                        addMessage("Connected!");
                        s.emit("ready", (msg) => {
                            console.log(msg);
                        });
                    });

                    s.on("opponent_connected", (name) => {
                        setOpponentName(name);
                        addMessage(
                            "Opponent connected! \n" + name + " is here!"
                        );
                        fetch(`/api/users/${name}`)
                            .then((res) => res.json())
                            .then((data) => {
                                setOpponentElo(data.user.eloScore);
                            });
                    });

                    s.on("reconnection", (data) => {
                        console.log(data);
                        setGamePosition(data.fen);
                        addMessage("Reconnected succesfully!");

                        setMessages(() => [...data.messages]);

                        const turn = data.fen.split(" ")[1];
                        console.log(turn);
                        if (turn === "b") {
                            whitePlayerTimer.stop();
                            blackPlayerTimer.start();
                        } else {
                            whitePlayerTimer.start();
                            blackPlayerTimer.stop();
                        }
                    });

                    s.on("remaining_time", (data) => {
                        console.log(data);
                        whitePlayerTimer.setTimer(data.whiteTime);
                        blackPlayerTimer.setTimer(data.blackTime);
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

                    s.on("error", (data) => {
                        addMessage("Error! " + data);
                    });

                    s.on("disconnect", (reason) => {
                        addMessage("Disconnected! " + reason);
                    });
                })
                .catch((error) => {
                    addMessage("Error!\n\t " + error.message);
                });
        } else if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status]);

    useEffect(() => {
        fetch("/api/users/" + session?.user?.username)
            .then((res) => res.json())
            .then((data) => {
                setOwnElo(data.user.eloScore);
            });

        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, []);

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

        setGameOverDialog(true);
        socket.current.disconnect();
    };

    const addMessage = (message) => {
        setMessages((messages) => [...messages, message]);
    };

    if (status === "loading" || status === "unauthenticated") {
        return (
            <div className="h-full w-full flex items-center justify-center">
                {" "}
                <Spinner />{" "}
            </div>
        );
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
                    {status === "authenticated" ? (
                        <div className="text-center text-2xl">
                            Playing as {session.user.username} vs{" "}
                            {opponentName || "In attesa dell'avversario..."}
                        </div>
                    ) : (
                        <div className="text-center text-2xl">Guestone</div>
                    )}
                    <div className="flex flex-row">
                        <h1 className="mr-2">
                            {opponentName} ({opponentElo})
                        </h1>
                        <DarkboardTimer
                            timer={
                                playerColor.current === "white"
                                    ? blackPlayerTimer
                                    : whitePlayerTimer
                            }
                        />
                    </div>

                    <Chessboard
                        id="onlineGame"
                        position={gamePosition} //la partita inizia appena si entra nella lobby, il tempo parte dopo la prima mossa
                        onPieceDrop={onDrop}
                        customPieces={customPieces} //??
                        customBoardStyle={{
                            borderRadius: "5px",
                        }}
                        boardOrientation={playerColor.current}
                    />
                    <div className="flex flex-row">
                        <h1 className="mr-2">
                            {session.user.username} ({ownElo})
                        </h1>
                        <DarkboardTimer
                            timer={
                                playerColor.current === "white"
                                    ? whitePlayerTimer
                                    : blackPlayerTimer
                            }
                        />
                    </div>
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
                                onClick={() =>
                                    socket.current.emit("resign_game")
                                }
                            >
                                Resign
                            </Button>

                            <AutoScrollBox
                                items={messages}
                                className="hidden sm:block"
                            >
                                {messages.map((message, index) => (
                                    <p key={message + `-${index}`} className="rounded p-1">
                                        {message}
                                    </p>
                                ))}
                            </AutoScrollBox>
                            <div className="sm:hidden flex flex-col-reverse gap-1 overflow-y-auto">
                                {messages.map((message, index) => (
                                    <p key={message + `-${index}`} className="rounded p-2">
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

export default OnlineGame;
