"use client";

import Button from "@/components/Button";
import { useSocket } from "@/hooks/useSocket";
import { Chess, Square } from "chess.js";
import { useMemo, useState } from "react";

import { Chessboard } from "react-chessboard";

const Msg = (props: { room: string; username: string }) => {
    const game = useMemo(() => new Chess(), []);
    const [gamePosition, setGamePosition] = useState(game.fen());

    const { socketResponse, isConnected, sendData } = useSocket(
        props.room,
        props.username
    );

    const [messageInput, setMessageInput] = useState("");

    const sendMessage = (e: any) => {
        e.preventDefault();
        if (messageInput != "") {
            sendData({
                content: messageInput,
            });
            setMessageInput("");
        }
    };

    function onDrop(sourceSquare: Square, targetSquare: Square, piece: any) {
        let move = null;
        try {
            move = {
                from: sourceSquare,
                to: targetSquare,
                promotion: piece[1].toLowerCase() ?? "q",
            };
            sendData({
                content: move.from+move.to,
            })
            move = game.move(move);
            setGamePosition(game.fen());
        } catch (e: any) {
            return false;
        }

        // illegal move
        if (move === null) return false;

        return true;
    }

    return (
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 p-4 gap-5 max-h-screen">
            <header>
                {isConnected ? <p>Connected</p> : <p>Not Connected</p>}
                <span className="room_name">Room: {props.room} </span>
                <span className="user_name">Welcome: {props.username} </span>
                <form className="chat-input" onSubmit={(e) => sendMessage(e)}>
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message"
                    />
                </form>
            </header>
            <div className="sm:col-span-3 flex flex-col gap-2 max-w-screen">
                <Chessboard position={gamePosition} onPieceDrop={onDrop} />
            </div>
        </main>
    );
};

const Page = () => {
    const [room, setRoom] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [show, setShow] = useState<boolean>(false);

    const connect = () => {
        setRoom("test");
        setUsername("test3");

        setShow(true);
    };

    return (
        <div>
            <h1>Test Websocket</h1>
            <Button color="primary" onClick={() => connect()}>
                Connect
            </Button>
            {show ? <Msg room={room} username={username} /> : null}
        </div>
    );
};

export default Page;
