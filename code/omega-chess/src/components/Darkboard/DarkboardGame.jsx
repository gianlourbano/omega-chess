"use client";

import { Chess } from "chess.js";
import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import AutoScrollBox from "../AutoScrollBox";
import * as io from "socket.io-client";
import GameTranscript from "./GameTranscript";
import { useSession } from "next-auth/react";
import Button from "../Button";

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

const DarkboardGame = ({ room }) => {
    const [socket, setSocket] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [transcript, setTranscript] = useState();

    const { data: session, status } = useSession();

   

    useEffect(() => {
        const s = io(process.env.NEXT_PUBLIC_SOCKET_BASE_URL, {
            reconnection: false,
            query: {
                username: session ? session.user.username : "guest",
                room: room,
            }
        });
        setSocket(s);

        s.on("chessboard_changed", (data) => {
            setGamePosition(data);
        });

        s.on("game_over", (data) => {
            handleGameOver(data);
        });

        s.on("read_message", (data) => addMessage(data));

        return () => {
            s.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.emit("start_game");
        }
    }, [socket]);

    const handleGameOver = (data) => {
        setGameOver(true);
        setTranscript(data);

        // escape all quotes in the pgn
        //const escaped = data.replace(/"/g, '\"')
        if(session && session.user) {
            fetch(`/api/users/${session.user.username}/games`, {
                method: "PUT",
                header: {
                    "Content-Type": "text/plain"
                },
                body: data
            }).then(res => res.json()).then((res) => {
                res === "OK" ? alert("Game saved!") : alert("Game not saved!")
            })
        } else {
            alert("User not logged in!")
        }
    }

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
        {status === "authenticated" && <div className="text-center text-2xl">Playing as {session.user.username}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 p-4 gap-5 max-h-screen">
            <div className="sm:col-span-3 flex flex-col gap-2 max-w-screen">
                <Chessboard
                    id="PlayVsStockfish"
                    position={gamePosition}
                    onPieceDrop={onDrop}
                    customPieces={customPieces}
                    customBoardStyle={{
                        borderRadius: "5px",
                    }}
                />
                {gameOver && <GameTranscript transcript={transcript} />}
            </div>
            <div className="rounded-lg bg-zinc-700 sm:col-span-2 flex flex-col gap-3 h-[80vh] self-center p-3 shadow-[rgba(0,0,0,0.24)_0px_3px_8px]">
                <h1 className="text-3xl text-center">Umpire</h1>

                <Button color="secondary" onClick={() => socket.emit("resign_game")}>Resign</Button>

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

export default DarkboardGame;
