"use client"

import {useSocket} from "@/hooks/useSocket"
import { Chess } from "chess.js";
import { useEffect, useState } from "react"
import {Chessboard} from "react-chessboard";
import AutoScrollBox from "../AutoScrollBox";
import * as io from "socket.io-client";

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

const SOCKET_BASE_URL = "http://127.0.0.1:8085"

const DarkboardGame = ({room }) => {
    const [socket, setSocket] = useState(null);

    const username = "gianlo";

    useEffect(() => {
        const s = io(SOCKET_BASE_URL, {
            reconnection: false,
            query: `username=${username}&room=${room}`, //"room=" + room+",username="+username,
          });
        setSocket(s)

        s.on("chessboard_changed", (data) => {
            setGamePosition(data)
        })

        s.on("read_message", (data) => addMessage(data))

        return () => {
            s.disconnect()
        }
    }, [])

    useEffect(() => {
        if(socket){
            socket.emit("start_game")
        }
    }, [socket])

    const addMessage = (message) => {
        setMessages((messages) => [...messages, message]);
    }

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
            addMessage(e.message);
            return false;
        }
        return true;
    }

    const [gamePosition, setGamePosition] = useState();
    const [customPieces, setCustomPieces] = useState(hidden);
    const [messages, setMessages] = useState([]);
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 p-4 gap-5 max-h-screen">
            <div className="sm:col-span-3 flex flex-col gap-2 max-w-screen">
                <Chessboard
                    id="PlayVsStockfish"
                    position={gamePosition}
                    onPieceDrop={onDrop}
                    //customPieces={customPieces}
                    customBoardStyle={{
                        borderRadius: "5px",
                    }}
                />
            </div>
            <div className="rounded-lg bg-zinc-700 sm:col-span-2 flex flex-col gap-3 h-[80vh] self-center p-3 shadow-[rgba(0,0,0,0.24)_0px_3px_8px]">
                <h1 className="text-3xl text-center">Umpire</h1>

                <AutoScrollBox items={messages} className="hidden sm:block">
                    {messages.map((message, index) => (
                        <p key={index} className="rounded p-2">
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
    )
}

export default DarkboardGame