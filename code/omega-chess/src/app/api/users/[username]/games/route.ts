import User from "@/db/models/User";
import mongoDriver from "@/db/mongoDriver";
import { NextRequest } from "next/server";
import { parse } from 'pgn-parser'

const getHeaderValue = (headers: any, name: string): string => {
    return headers.find((header: any) => header.name === name)?.value;
}

// Save a finished game in the database
export async function PUT(req: NextRequest, { params }: { params: { username: string } }) {
    await mongoDriver();

    let pgn = await req.text();
    console.log("REQ GAME", pgn);

    const parsed = parse(pgn);

    const game = parsed[0];
    
    const result = getHeaderValue(game.headers, "Result")
    const user = await User.findOne({ username:  params.username });

    const whitePlayer = getHeaderValue(game.headers, "White");
    const blackPlayer = getHeaderValue(game.headers, "Black");

    switch (result) {
        case "1-0":
            user.scores.wins += 1;
            break;
        case "0-1":
            user.scores.losses += 1;
            break;
        case "1/2-1/2":
            user.scores.draws += 1;
            break;
        default:
            break;
    }

    user.games.push(game);

    await user.save();

    return Response.json("OK", {status: 200})
}