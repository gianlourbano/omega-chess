"use client";

import { useState, useEffect } from "react";
import Button from "../Button";
import Spinner from "../Spinner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export const useNewGame = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();

    const startGame = (gameType: string) => {
        setIsLoading(true);
        if (status === "unauthenticated") {
            router.push("/login");
            return;
        }
        
        fetch("/api/games/lobby", {
            method: "POST",
            body: JSON.stringify({
                gameType,
                player: session && session.user && session.user.username,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                const id = data.id;
                router.push(`/kriegspiel/darkboard/${id}`);
            })
            .catch((err) => console.log(err))
            .finally(() => setIsLoading(false));
    };

        
    

    return { isLoading, startGame };
}

const PlayDarkboardButton = () => {
    const [status, setStatus] = useState("");
    
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_DB_BACKEND_BASE_URL}/healthcheck`)
            .then((res) => res.json())
            .then((data) => {
                if (data.status !== "OK") {
                    setStatus("Server offline");
                }
            }).catch(err => setStatus("Servers are offline!"));

        
    }, []);

    const { isLoading, startGame } = useNewGame();

    return (
        <>
            <Button
                color="secondary"
                onClick={() => startGame("darkboard")}
                disabled={status !== ""}
            >
                {isLoading ? <Spinner /> : " Play with Darkboard"}
            </Button>
            {status !== "" && <div className="text-red-500">{status}</div>}
        </>
    );
};

export default PlayDarkboardButton;
