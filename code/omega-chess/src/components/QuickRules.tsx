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
                <ul className="list-disc list-inside pl-2 justify-evenly">
                    <li className="text-md"> Ogni giocatore ha una scacchiera separata senza vedere le mosse dell&aposavversario. </li>
                    <li className="text-md"> L&aposarbitro gestisce una terza scacchiera con la posizione completa. </li>
                </ul>
            </div>
            <div className="rounded-lg bg-zinc-600 mr-2">
                <h1 className="text-xl font-bold text-center"> Arbitro </h1>
                <ul className="list-disc list-inside pl-2 justify-evenly">
                    <li className="text-md"> Comunica con i giocatori per annunciare l&aposesito delle mosse. </li>
                    <li className="text-md"> Annuncia il cambio di turno se la mossa è legale, altrimenti dichiara &#34mossa illegale&#34. </li>
                </ul>
            </div>
            <div className="rounded-lg bg-zinc-600 mr-2">
                <h1 className="text-xl font-bold text-center"> Scacco e Cattura </h1>
                <ul className="list-disc list-inside pl-2 justify-evenly">
                    <li className="text-md"> L&aposarbitro annuncia uno scacco, specificando la direzione. </li>
                    <li className="text-md"> Catture annunciate in termini generali (cattura in [casa]), en-passant non specificato. </li>
                </ul>
            </div>
            <div className="rounded-lg bg-zinc-600 mr-2">
                <h1 className="text-xl font-bold text-center"> Catture di Pedoni e Promozione </h1>
                <ul className="list-disc list-inside pl-2 justify-evenly">
                    <li className="text-md"> Prima di ogni mossa, l&aposarbitro comunica il numero di catture di pedone possibili. </li>
                    <li className="text-md"> Promozioni del pedone non annunciate, lasciate ai giocatori per deduzione. </li>
                </ul>
            </div>
            <div className="rounded-lg bg-zinc-600 mr-2">
                <h1 className="text-xl font-bold text-center"> Scacco Matto e Patta </h1>
                <ul className="list-disc list-inside pl-2 justify-evenly">
                    <li className="text-md"> L&aposarbitro annuncia scacco matto, terminando la partita. </li>
                    <li className="text-md"> Condizioni di patta seguono le regole standard, con l&aposeccezione della patta per impossibilità di dare scacco matto </li>
                    <li className="text-md"> La regola delle 50 mosse è in vigore. I giocatori devono tenere traccia delle mosse per richiedere la patta in base a questa regola. </li>
                </ul>
            </div>
        </main>
    );
}

export default QuickRules;