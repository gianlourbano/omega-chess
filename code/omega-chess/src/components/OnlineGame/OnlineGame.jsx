
"use client";

import { Chess } from "chess.js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import AutoScrollBox from "../AutoScrollBox";
import * as io from "socket.io-client";
import { useSession } from "next-auth/react";
import Button from "../Button";
import CustomDialog from "../CustomDialog";
import DarkboardTimer from "../Darkboard/DarkboardTimer";
import useStopwatch from "@/hooks/useStopwatch";
import { useNewGame } from "@/components/Darkboard/PlayDarkboard";
import GameTranscript from "../Darkboard/GameTranscript";
import { set } from "mongoose";

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
    const [game, setGame] = useState(new Chess());
    const [gamePosition, setGamePosition] = useState("start");
    const {data: session, status} = useSession();
    const [isLoading, setIsLoading] = useState(true);
    
    const [messages, setMessages] = useState([]);
    const [playerColor, setPlayerColor] = useState("");

    //game over const
    const [gameOver, setGameOver] = useState(false);
    const [gameOverDialog, setGameOverDialog] = useState(false);
    const [transcript, setTranscript] = useState();

    //timer const
    const whitePlayerTimer = useStopwatch(1000 * 60); //(initial value in cs??)
    const blackPlayerTimer = useStopwatch(1000 * 60);

    //custom pieces
    const [customPieces, setCustomPieces] = useState(whiteHidden);

    //opponentName
    const [opponentName, setOpponentName] = useState("");
   
    useEffect(() => {
        fetch(`/api/games/lobby/${room}`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                if(data.whitePlayer === session?.user?.username){
                    setPlayerColor("white");
                    setOpponentName(data.blackPlayer);
                    setCustomPieces(blackHidden);
                    console.log(data.whitePlayer)
                } else if (data.blackPlayer === session?.user?.username){
                    setPlayerColor("black");
                    setOpponentName(data.whitePlayer);
                    setCustomPieces(whiteHidden);
                    console.log(data.blackPlayer)
                } else {
                    setPlayerColor("error");
                    console.log(data.blackPlayer, room, data.gameType, data.whitePlayer, data.lookingForPlayer)
                    
                }
            }).catch((error) => {console.error("Errore nel recupero del colore della lobby:", error);});
    }, []);  // Aggiungi le dipendenze necessarie

    



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

    const GameOverDialog = ({ open, setOpen, transcript}) => {
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
    }

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
    }

    const addMessage = (message) => {
        setMessages((messages) => [...messages, message]);
    };

    if (status === "loading") {
        return <div className="h-full w-full flex items-center justify-center"> <Spinner /> </div>;
    }

    if (status === "unauthenticated") {
        //return <div>Unauthenticated!</div>;
        const router = useRouter();
        router.push(`/login`);
        //redirect("/login")
    }

    if (status === "error") {
        return <div>Error!</div>;
    }
    
    return (
        <>
            {status === "authenticated" ? (
                <div className="text-center text-2xl">
                    Playing as {session.user.username} vs {opponentName}
                </div>) :
                (<div className="text-center text-2xl">
                    Guestone
                </div>
            )}
            <GameOverDialog
                open={gameOverDialog}
                setOpen={setGameOverDialog}
                transcript={transcript}
            />
            

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 p-4 gap-5 max-h-screen">
                <div className="sm:col-span-3 flex flex-col gap-2 max-w-screen">
                    
                    <DarkboardTimer timer = {blackPlayerTimer} />
                    <Chessboard
                        id="onlineGame"
                        position={gamePosition}    //la partita inizzia appena si entra nella lobby, il tempo parte dopo la prima mossa
                        onPieceDrop={onDrop}   //DA MODIFICARE
                        customPieces={customPieces}   //??
                        customBoardStyle={{
                            borderRadius: "5px",
                        }}
                        boardOrientation={playerColor}
                    />
                    <DarkboardTimer timer = {whitePlayerTimer} />
                    
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

