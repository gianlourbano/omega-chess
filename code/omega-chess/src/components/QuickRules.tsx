"use client";

import React from "react";
import Button from "@/components/Button";
import { useState } from "react";

function QuickRules() {
    const[show, setShow] = useState(false);
    return (
        <main className="flex flex-col overflow-y-auto gap-y-3">
            <div className="rounded-lg bg-zinc-600 mr-2">
                <h1 className="text-xl font-bold text-center"> Separazione dei Giocatori </h1>
                <p className="pl-2 justify-evenly">
                Servono tre scacchiere per il gioco. L&apos;idea principale del Kriegspiel è che i giocatori vedono solo i propri pezzi, ma non quelli dell&apos;avversario, e non conoscono le mosse fatte dall&apos;avversario: hanno solo alcune informazioni parziali (vedi sotto) che permettono loro di indovinare dove si trovino i pezzi avversari. Solo l&apos;arbitro conosce esattamente la posizione reale di entrambi i set di pezzi.
                </p>
            </div>
            <div className="rounded-lg bg-zinc-600 mr-2">
                <h1 className="text-xl font-bold text-center"> Arbitro </h1>
                <p className="pl-2 justify-evenly">
                I giocatori effettuano una mossa a turno, proprio come negli scacchi normali. Quando questa mossa è legale, l&apos;arbitro annuncia che il giocatore ha mosso e il suo turno è concluso. Quando la mossa non è legale, l&apos;arbitro annuncia anche che il giocatore ha tentato una mossa illegale, e il giocatore deve fare un nuovo tentativo finché non effettua una mossa legale.
                </p>
            </div>
            <div className="rounded-lg bg-zinc-600 mr-2">
                <h1 className="text-xl font-bold text-center"> Scacco </h1>
                <p className="pl-2 justify-evenly">
                Quando una mossa mette sotto scacco, l&apos;arbitro lo annuncia e indica anche la direzione in cui è stato dato lo scacco: sulla riga, sulla colonna, sulla piccola diagonale, sulla grande diagonale o da un cavaliere. Tuttavia, non viene comunicato il luogo della posizione del pezzo che mette sotto scacco.
                </p>	
            </div>
            <div className="rounded-lg bg-zinc-600 mr-2">
                <h1 className="text-xl font-bold text-center"> Catture </h1>
                <p className="pl-2 justify-evenly">
                Quando un pezzo ne cattura un altro, l&apos;arbitro lo annuncia e indica anche il campo in cui è avvenuta la cattura. Ad esempio, l&apos;arbitro potrebbe annunciare: &quot;Il Bianco ha catturato in d3&quot;. L&apos;arbitro non comunica con quale tipo di pezzo è stata fatta la cattura, tuttavia indica se il pezzo catturato è un pedone.
                </p>
            </div>
            <div className="rounded-lg bg-zinc-600 mr-2">
                <h1 className="text-xl font-bold text-center"> Richieste </h1>
                <p className="pl-2 justify-evenly">
                Per evitare che i giocatori debbano fare lunghe serie di congetture errate sulle catture di pedoni, ad ogni turno l&apos;arbitro comunica il numero di catture effettuabili dai pedoni. Il giocatore può quindi fare tentativi di catture con un pedone (se non ha successo, può continuare tali tentativi o tentare altre mosse a piacere).
                </p>
            </div>
        </main>
    );
}

export default QuickRules;