/*

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

import { useNewGame } from "@/components/Darkboard/PlayDarkboard";

const OnlineGame = ({ room }) => {




    return (
        <>
            {status === "authenticated" && (
                <div className="text-center text-2xl">
                    Playing as {session.user.username}
                </div>
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

*/