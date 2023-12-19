"use client";

import Button from "../Button";
import Spinner from "../Spinner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

/*
returns the id of the lobby found
if there are lobbies waiting for other players to join, return one of them
otherwise, create a new empty lobby and return it
*/

export const useGame =  () =>  {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();
    
    const findLobby =  async () => {
        
        //first, look if there are open lobbies
        let lobbyId = await fetch("api/games/lobby",{
            method: "POST",
            body: JSON.stringify({
                gameType : "online",
                player: session?.user?.username
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                return data.id
        })
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false));
                    
        return lobbyId;
    }

    const startGame = async () =>{
        if (status === "unauthenticated") {
            router.push(`/login`);
            return;
        }

        const lobbyId = await findLobby();
        
        router.push(`/kriegspiel/online/${lobbyId}`)
    }

    return { isLoading, startGame };
}

const PlayOnlineButton = () =>{
    
    const[status, setStatus] = useState("");

    useEffect(()=>{
        
        fetch(`${process.env.NEXT_PUBLIC_DB_BACKEND_BASE_URL}/healthcheck`)
            .then((res)=> res.json())
            .then((data)=>{
                if(data.status !== "OK"){
                    setStatus("Server offline");
                }
            }).catch((err)=>{ setStatus("Server offline")});
    },[]);

    const { isLoading, startGame } = useGame();

    return(
        <div>
            <Button
                className="w-full"
                color="primary"
                onClick={() => startGame()}
                disabled={status !== ""}
            >
                {isLoading ? <Spinner/> : "Play Online"}
            </Button>
            {status !== "" && <div className="text-red-500">{status}</div>}
        </div>
    );
};
export default PlayOnlineButton;
