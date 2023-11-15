"use client";

import Button from "@/components/Button";
import { useSocket } from "@/hooks/useSocket";
import { Chess, Square } from "chess.js";
import { useEffect, useMemo, useState } from "react";

import { Chessboard } from "react-chessboard";

import { v4 as uuidv4 } from 'uuid';

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

const Msg = (props) => {
    const game = useMemo(() => new Chess(), []);
    const [gamePosition, setGamePosition] = useState(game.fen());
    const [customPieces, setCustomPieces] = useState(hidden);

    const {socket, socketResponse, isConnected, sendData } = useSocket(
        props.room,
        props.username
    );

    useEffect(() => {
        if(socket) {
            socket.on("chessboard_changed", (res) => setTimeout(() => setGamePosition(res), 150));
        }
    }, [socket])


    function onDrop(sourceSquare, targetSquare, piece) {
        let move = null;
            move = {
                from: sourceSquare,
                to: targetSquare,
                promotion: piece[1].toLowerCase() ?? "q",
            };

            const game_copy = new Chess(gamePosition);
            const san = game_copy.move(move).san
            console.log(san);
            sendData("make_move", san);

        return true;
    }

    const [messageList, setMessageList] = useState([]);

    const AddMessage = (message) => {
        setMessageList([...messageList, message]);
    }

    useEffect(() => {
        if(socketResponse) {
            AddMessage(socketResponse);
        }
    }, [socketResponse])

    return (
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 p-4 gap-5 max-h-screen">
            <header>
                {isConnected ? <p>Connected</p> : <p>Not Connected</p>}
                <span className="room_name">Room: {props.room} </span>
                <span className="user_name">Welcome: {props.username} </span>
                <button onClick={() => setCustomPieces({})}>Show Opponent Pieces</button>
                <button onClick={() => setCustomPieces(hidden)}>Hide Opponent Pieces</button>
            </header>
            <div className="sm:col-span-3 flex flex-col gap-2 max-w-screen">
                <Chessboard position={gamePosition} onPieceDrop={onDrop} customPieces={customPieces}/>
            </div>
            <div className="flex flex-col border p-2 rounded-md">
                Umpire
                {messageList.map((message, index) => <div key={index}>{message}</div>)}
            </div>
        </main>
    );
};

const Page = () => {
    const [room, setRoom] = useState("");
    const [username, setUsername] = useState("");
    const [show, setShow] = useState(false);

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
            {show ? <Msg room={uuidv4()} username={username} /> : null}
        </div>
    );
};

export default Page;
