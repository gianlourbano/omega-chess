"use client";

import OnlineGame from "@/components/OnlineGame/OnlineGame";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
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

    const searchParams = useSearchParams()
 
    const join = searchParams.has('join')
   
    return (
        <>
            <OnlineGame room={params.lobbyid} joining_from_link={join}/>
        </>
    )};

export default Page;