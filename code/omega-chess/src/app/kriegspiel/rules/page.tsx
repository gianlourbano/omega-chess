import React from "react";
import "tailwindcss/tailwind.css";

const PageRules = async () => {
    return (
        <main className="bg-gray-900 text-gray-100 p-8">
            <h1 className="text-5xl font-bold text-center text-blue-400 mb-10">
                Kriegspiel ICC: Regole
            </h1>

            <section className="mb-8">
                <h2 className="font-serif text-3xl text-yellow-300 mt-8 mb-4">
                    Separazione dei giocatori
                </h2>
                <p className="text-lg">
                    Ogni giocatore gioca su una scacchiera separata e non può
                    vedere le mosse dell&apos;avversario. L&aposarbitro ha una terza
                    scacchiera dove traccia tutte le mosse e conosce la
                    posizione completa.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="font-serif text-3xl text-yellow-300 mt-8 mb-4">
                    Ruolo dell&apos;arbitro
                </h2>
                <p className="text-lg">
                    L&apos;arbitro comunica con i giocatori per annunciare l&apo;sesito
                    delle mosse e fornisce informazioni limitate.
                </p>
                <ul className="list-disc list-inside space-y-2 text-lg">
                    <li>
                        <strong>Turno del giocatore:</strong> Dopo che un
                        giocatore ha mosso, l&apos;arbitro annuncia semplicemente il
                        cambio di turno se la mossa è legale e non comporta
                        scacco o cattura.
                    </li>
                    <li>
                        <strong>Mossa illegale:</strong> Se una mossa non è
                        permessa dalle regole degli scacchi, l &apos; arbitro annuncia
                        (mossa illegale), e il giocatore deve fare un altro
                        tentativo.
                    </li>
                    <li>
                        <strong>Scacco:</strong> Se una mossa legale dà scacco,
                        l&apos; arbitro annuncia scacco e specifica la direzione
                        generale (orizzontale, verticale, diagonale grande,
                        diagonale piccola, o scacco di cavallo).
                    </li>
                    <li>
                        <strong>Cattura:</strong> Quando si verifica una
                        cattura, l&apos; arbitro annuncia (cattura in [casa]),
                        identificando la casa della cattura ma non i pezzi
                        coinvolti. L&apos; arbitro annuncia anche se l&apos;entità
                        catturata è un pedone o un pezzo.
                    </li>
                    <li>
                        <strong>Catture di pedone disponibili:</strong> Prima di ogni mossa, 
                        l&apos;arbitro annuncia automaticamente il
                        numero di catture di pedone possibili, ma non le case
                        specifiche. I giocatori non sono obbligati a tentare queste
                        catture..
                    </li>
                    <li>
                        <strong>Catture en-passant:</strong> Le catture en-passant non vengono annunciate specificamente
                    dall &apos; arbitro.
                    </li>
                    <li>
                        <strong>Promozione del pedone:</strong> Le promozioni non vengono annunciate dall&apos;arbitro, quindi i
                    giocatori devono dedurre quando e se un pedone è stato
                    promosso.
                    </li>
                    <li>
                        <strong>Scacco matto:</strong> Quando un giocatore dà
                        scacco matto, l&apos;arbitro annuncia (scacco matto) e la
                        partita termina.
                    </li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="font-serif text-3xl text-yellow-300 mt-8 mb-4">
                    Patta
                </h2>
                <p className="text-lg mb-4">
                    Le condizioni di patta seguono le regole standard degli
                    scacchi. Un giocatore può rivendicare la patta se si
                    verifica una delle seguenti condizioni: ripetizione di
                    posizione per tre volte, regola delle 50 mosse, o se non ci
                    sono abbastanza pezzi sul tabellone per forzare uno scacco. A differenza del Kriegspiel classico, la regola delle 50
                    mosse è in vigore su ICC. Questo significa che se durante la
                    partita si verificano 50 mosse consecutive di ciascun
                    giocatore senza che venga mosso un pedone o catturato un
                    pezzo, un giocatore può richiedere la patta. Questa regola
                    contribuisce a evitare partite interminabili e a garantire
                    che il gioco proceda verso una conclusione.I giocatori devono tenere traccia delle mosse durante il
                    gioco per rivendicare la patta in base a questa regola.
                    L&apos;arbitro può assistere nel fornire il conteggio delle mosse
                    su richiesta dei giocatori.
                </p>
                <p className="text-lg">
                    L&apos;unica eccezione alla regola standard della patta nel
                    Kriegspiel ICC è la patta per impossibilità di dare scacco
                    matto, che non è applicabile. Ciò significa che anche se un
                    giocatore è ridotto a un re solo e non può dare scacco
                    matto, il gioco non termina in patta finché non si verifica
                    una delle altre condizioni di patta. 
                </p>
            </section>
            
        </main>
    );
};

export default PageRules;

//Il Kriegspiel è un gioco da tavolo strategico in cui i giocatori controllano le proprie unità su una mappa divisa in caselle, ma senza conoscere la posizione delle unità avversarie. Un arbitro neutrale comunica solo mosse legali e eventi visibili, mentre i giocatori devono dedurre la posizione e le intenzioni nemiche. La capacità di deduzione e adattamento sono cruciali per vincere.
