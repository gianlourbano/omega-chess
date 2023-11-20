"use client";

import { useState, useEffect } from "react";
import Button from "../Button";
import Spinner from "../Spinner";
import { useRouter } from "next/navigation";

const PlayDarkboardButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState("");

    const router = useRouter();

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_DB_BACKEND_BASE_URL}/healthcheck`)
            .then((res) => res.json())
            .then((data) => {
                if (data.status !== "OK") {
                    setStatus("Server offline");
                }
            }).catch(err => setStatus("Servers are offline!"));
    }, []);

    const handleClick = () => {
        setIsLoading(true);
        fetch("/api/games/lobby", {
            method: "POST",
            body: JSON.stringify({
                gameType: "darkboard",
                player: "gianlo",
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                const id = data.id;
                router.push(`/kriegspiel/${id}`);
            })
            .catch((err) => console.log(err))
            .finally(() => setIsLoading(false));
    };

    return (
        <>
            <Button
                color="secondary"
                onClick={handleClick}
                disabled={status !== ""}
            >
                {isLoading ? <Spinner /> : " Play with Darkboard"}
            </Button>
            {status !== "" && <div className="text-red-500">{status}</div>}
        </>
    );
};

export default PlayDarkboardButton;
