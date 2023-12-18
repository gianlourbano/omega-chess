"use client"

import { useMemo, useRef, useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import {Chess} from "chess.js";
import useSWR from "swr"
import Button from "@/components/Button"

import pgnParser from "pgn-parser";
import { motion } from "framer-motion";
import Spinner from "@/components/Spinner";

const PgnLoader = ({props}: {props: {pgnstring: string}}) => {

    const [pgn, setPgn] = useState<any>();
    const [fen, setFen] = useState<string>();
    const [orientation, setOrientation] = useState<"white" | "black">("white");

    const chess = useMemo(() => {
        const c = new Chess();
        console.log(c.fen())
        return c;
    }, [props.pgnstring])
    const pointer = useRef(0);

    useEffect(() => {
        const pgn = pgnParser.parse(props.pgnstring);
        console.log(pgn)
        setPgn(pgn[0])
    }, [])

    const onAdvance = () => {
        if (autoBackActive && autoBackIntervalId.current !== null) {
            clearInterval(autoBackIntervalId.current);
            autoBackIntervalId.current = null;
            setAutoBackActive(false);
        }
    
        if(chess) {
            if(pointer.current >= pgn.moves.length) return;
            chess.move(pgn.moves[pointer.current++].move);
            setFen(chess.fen());
        }
    };
                    

    const onBack = () => {
        if (autoForwardActive && autoForwardIntervalId.current !== null) {
            clearInterval(autoForwardIntervalId.current);
            autoForwardIntervalId.current = null;
            setAutoForwardActive(false);
        }
    
        if(chess) {
            if(pointer.current <= 0) return;
            chess.undo();
            setFen(chess.fen());
            pointer.current--;
        }
    };
    
    
    const onSwapSpace = () => {
        if(chess) {
            setOrientation(orientation === "white" ? "black" : "white")
        }
    };

    const [autoForwardActive, setAutoForwardActive] = useState(false);
    const [autoBackActive, setAutoBackActive] = useState(false);
    const autoForwardIntervalId = useRef<number | null>(null);
    const autoBackIntervalId = useRef<number | null>(null);
    
    const onAutoForward = () => {
        if (autoBackActive && autoBackIntervalId.current !== null) {
            clearInterval(autoBackIntervalId.current);
            autoBackIntervalId.current = null;
            setAutoBackActive(false);
        }
    
        if (autoForwardActive) {
            if (autoForwardIntervalId.current !== null) {
                clearInterval(autoForwardIntervalId.current);
                autoForwardIntervalId.current = null;
            }
            setAutoForwardActive(false);
        } else {
            autoForwardIntervalId.current = window.setInterval(onAdvance, 1000);
            setAutoForwardActive(true);
        }
    };
    
    const onAutoBack = () => {
        if (autoForwardActive && autoForwardIntervalId.current !== null) {
            clearInterval(autoForwardIntervalId.current);
            autoForwardIntervalId.current = null;
            setAutoForwardActive(false);
        }
    
        if (autoBackActive) {
            if (autoBackIntervalId.current !== null) {
                clearInterval(autoBackIntervalId.current);
                autoBackIntervalId.current = null;
            }
            setAutoBackActive(false);
        } else {
            autoBackIntervalId.current = window.setInterval(onBack, 1000);
            setAutoBackActive(true);
        }
    };

    const moveFor = (moves: number) => {
        if(moves < 0 || moves > pgn.moves.length) return;

        if (moves < pointer.current) {
            const amount = pointer.current - moves;
            
            for (let i = 0; i < amount; i++) {
                onBack();
            }
        } else {
            const amount = moves-pointer.current;
            for (let i = 0; i < amount; i++) {
                onAdvance();
            }
            
        }

    }

    const endOfComments = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        endOfComments.current?.scrollIntoView({ behavior: 'smooth' });
    }, [pgn]);
    

    return (
        <main className="container mx-auto p-4">
            <div className="flex gap-4">
                <div className="flex flex-col">
                    <p> Tries: {pgn && pointer.current < pgn.moves.length &&  pgn.moves[pointer.current].comments.map((comment: any, index: number) => {
                                    return (
                                        <span key={comment.text}>{comment.text}</span>
                                    )
                                })}</p>
                    <Chessboard position={fen} boardOrientation={orientation}/>
                    <div className="mt-2 flex justify-center space-x-2">
                        <Button color={autoBackActive ? "danger" : "primary"} onClick={onAutoBack}>&lt;&lt;</Button>
                        <Button color="primary" onClick={onBack}>&lt;</Button>
                        <Button color="primary" onClick={onSwapSpace}>↑↓</Button>
                        <Button color="primary" onClick={onAdvance}>&gt;</Button>
                        <Button color={autoForwardActive ? "danger" : "primary"} onClick={onAutoForward}>&gt;&gt;</Button>
                    </div>
                </div>
                <div>{pointer.current}</div>
                <div className="overflow-auto p-4 border border-gray-200 rounded" style={{ maxHeight: "calc(100vh - 8rem)" }}>
                    {pgn?.moves.map((move: any, i: number) => {
                        const style = i >= pointer.current ? "" : "bg-zinc-700";
                        const uniqueKey = `move-${i}`; // Generate a unique key for each mapped element
                        return (
                            <motion.span key={uniqueKey} className={style} onClick={() => {moveFor(i)}} whileHover={{scale:1.4}}>
                                {i % 2 === 0 && <span>{i / 2}.</span>} {move.move} {"  "}
                            </motion.span>
                        )
                    })}
                    
                    <div ref={endOfComments}></div>
                </div>
            </div>
        </main>


    )
    
    
}
    

export default function ReplayPage({params}: {readonly params: {gameid: string}}) {
    
    const fetcher = (url: string) => fetch(url).then((r) => r.json()).then((res) => {
        if(res.error) throw new Error(res.error)
        return res;
    });
    

    const {data, isLoading, error} = useSWR(`/api/games/${params.gameid}`, fetcher)

    if (isLoading)
        return (
            <div className="h-full w-full flex items-center justify-center">
                {" "}
                <Spinner />{" "}
            </div>
        );
    if(error) return (<main><h1>Error: {error.message}</h1></main>)

    
    

    return (
    <main className="container mx-auto p-4">
    <div className="text-center">
    <h1 className="text-4xl font-bold inline-block">Replay {data.gamemode} {new Date(data.createdAt).toLocaleDateString('en-EN', { year: 'numeric', month: 'long', day: 'numeric' })}-{new Date(data.createdAt).toLocaleTimeString('en-EN', { hour: '2-digit', minute: '2-digit' })}
    </h1>

    
    <div className="mr-2">
        <span className={`inline-block mr-2 ${data.result === "1/2-1/2" ? "bg-yellow-500" : data.result === "1-0" ? "bg-green-500" : "bg-red-500"}`}>
            {data.result === "1-0" ? "WINNER" : data.result === "0-1" ? "LOSER" : "DRAW"} 
        </span> 
        {data.whitePlayer} as white player
    </div>
    <div className="mr-2">
        <span className={`inline-block mr-2 ${data.result === "1/2-1/2" ? "bg-yellow-500" : data.result === "0-1" ? "bg-green-500" : "bg-red-500"}`}>
            {data.result === "0-1" ? "WINNER" : data.result === "1-0" ? "LOSER" : "DRAW"}
        </span> 
        {data.blackPlayer} as black player
    </div>
    </div>

    {data && <PgnLoader props={{pgnstring: data.pgn}}/>}
</main>


    )
}