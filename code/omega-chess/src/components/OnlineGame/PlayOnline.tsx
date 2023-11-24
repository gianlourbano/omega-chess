"use client";

import Button from "../Button";
import Spinner from "../Spinner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import GameLobby from "@/db/models/GameLobby"
import mongoDriver from "@/db/mongoDriver";

/*
returns the id of the lobby found
if there are lobbies waiting for other players to join, return one of them
otherwise, create a new empty lobby and return it
*/

export const findGame =  () =>  {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { data: session, status } = useSession();
    
    const findLobby =  async () => {
        await mongoDriver();
        let lobbyId = "";
        /*
        //first, look if there are open lobbies
        const openLobby = await GameLobby.findOne({lookingForPlayer : true}) //TODO: aggiungere il rating
            /* TODO:
            consider ELO rating
            *
    
        //then,
            //if there is an open lobby, use that one
            if(openLobby) {
                lobbyId = openLobby._id;
                return lobbyId;
            }
    
            //else, create a new lobby
            else {
                setIsLoading(true);
                lobbyId = await fetch("api/games/lobby",{
                    method: "POST",
                    body: JSON.stringify({
                        gameType : "online",
                        player: session && session.user && session.user.username,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((res) => res.json())
                    .then((data) => {
                        return data.id
                })
            };
        */
        return lobbyId;
    }

    const startGame = async () =>{
        const lobbyId = await findLobby();
        router.push(`/kriegspiel/${lobbyId}`)
    }

    return { isLoading, startGame };
}

const PlayOnlineButton = () =>{
    
    const[status, setStatus] = useState("");

    useEffect(()=>{
        fetch(`${process.env.NEXT_PUBLIC_DB_BACKEND_BASE_URL}/healthcheck}`)
            .then((res)=> res.json())
            .then((data)=>{
                if(data.status !== "OK"){
                    setStatus("Server offline");
                }
            }).catch(err => setStatus("Servers are offline!!"));
    },[]);

    const { isLoading, startGame } = findGame();

    return(
        <div>
            <Button
                color="primary"
                disabled={status !== ""}
                onclick={findGame()}
            >
                {isLoading ? <Spinner/> : "Play Online"}
            </Button>
            {status !== "" && <div className="text-red-500">{status}</div>}
        </div>        
    );
};


export default PlayOnlineButton;
