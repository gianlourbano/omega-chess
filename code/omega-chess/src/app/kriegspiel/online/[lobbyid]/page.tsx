"use client";

import OnlineGame from "@/components/OnlineGame/OnlineGame";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";

const Page = ({params}: {params: {lobbyid: string}}) => {
    /*
    creare una nuova API:
    dato username, lobby id ritorna il colore del giocatore

    username preso da usession
    se ritorna il colore (quindi API non dà errore, partita esiste col
        giocatore effettivamente dentro)
    passi il colore ai props di OnlineGame, che poi farà boardorientation
    */
   
    return (
        <>
            <OnlineGame room={params.lobbyid}/>
        </>
    )};

export default Page;