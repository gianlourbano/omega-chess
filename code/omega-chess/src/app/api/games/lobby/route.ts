import Game from "@/db/models/Game";
import GameLobby from "@/db/models/GameLobby";
import User from "@/db/models/User";
import mongoDriver from "@/db/mongoDriver";
import { parse } from "pgn-parser";
interface GameLobbyRequestData {
    gameType: "darkboard" | "online";
    player: string;
}

export async function POST(req: Request) {
    await mongoDriver();
    const { gameType, player }: GameLobbyRequestData = await req.json();

    //handles reconnection:
    //if player is already in a lobby
    const old = await GameLobby.findOne({
        $or: [{ whitePlayer: player }, { blackPlayer: player }],
    });

    if (old) {
        return Response.json({
            id: old._id,
            whitePlayer: old.whitePlayer,
            blackPlayer: old.blackPlayer,
        });
    }

    //if there are open online lobbies
    if (gameType === "online") {
        //search online lobby
        const openLobbies = await GameLobby.find({
            lobbyType: "online",
            lookingForPlayer: true,
        });
        if (openLobbies.length > 0) {
            const firstLobby = openLobbies[0];
            if (firstLobby.whitePlayer) firstLobby.blackPlayer = player;
            else firstLobby.whitePlayer = player;
            firstLobby.lookingForPlayer = false;
            await firstLobby.save();
            return Response.json({
                id: firstLobby._id,
                whitePlayer: firstLobby.whitePlayer,
                blackPlayer: firstLobby.blackPlayer,
            });
        }
    }

    const newGame = new GameLobby({
        lobbyType: gameType,
        whitePlayer: player,
        blackPlayer: gameType === "darkboard" ? "darkboard" : null,
        lookingForPlayer: gameType === "online",
    });

    const { _id } = await newGame.save();
    return Response.json({
        id: _id,
        whitePlayer: newGame.whitePlayer,
        blackPlayer: newGame.blackPlayer,
    });
}

const getHeaderValue = (headers: any, name: string): string => {
    return headers.find((header: any) => header.name === name)?.value;
};

export async function PUT(req: Request) {
    await mongoDriver();

    let pgn = await req.text();
    const parsed = parse(pgn);
    const game = parsed[0];

    const result = getHeaderValue(game.headers, "Result");
    const whitePlayer = getHeaderValue(game.headers, "White");
    const blackPlayer = getHeaderValue(game.headers, "Black"); 

    //null controls for darkboard game
    //if one of players is "Darkboard", he doesn't exist, so mongodb returns null
    const whiteUser = await User.findOne({ username: whitePlayer });
    const blackUser = await User.findOne({ username: blackPlayer });

    switch (result) {
        case "1-0":
            if(whiteUser) whiteUser.scores.wins += 1;
            if(blackUser) blackUser.scores.losses += 1;
            break;
        case "0-1":
            if(whiteUser) whiteUser.scores.losses += 1;
            if(blackUser) blackUser.scores.wins += 1;
            break;
        case "1/2-1/2":
            if(whiteUser) whiteUser.scores.draws += 1;
            if(blackUser) blackUser.scores.draws += 1;
            break;
        default:
            break;
    }

    const gameData = await Game.create({
        gamemode: "kriegspiel",
        whitePlayer,
        blackPlayer,
        pgn,
        result,
    });

    await gameData.save();
    if(whiteUser) whiteUser.games.push(gameData._id);
    if(blackUser) blackUser.games.push(gameData._id);

    if(whiteUser) await whiteUser.save();
    if(blackUser) await blackUser.save();

    return Response.json("OK", { status: 200 });
}

export async function DELETE(req: Request) {
    await mongoDriver();
    const { room }: { room: string } = await req.json();
    console.log("DELETING LOBBY " + room);
    await GameLobby.findByIdAndDelete(room);
    return Response.json("OK");
}
