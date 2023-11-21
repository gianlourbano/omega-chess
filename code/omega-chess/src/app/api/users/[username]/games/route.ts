import User from "@/db/models/User";
import mongoDriver from "@/db/mongoDriver";
import { NextRequest } from "next/server";
import { parse } from 'pgn-parser'

// Save a finished game in the database
export async function PUT(req: NextRequest, { params }: { params: { username: string } }) {
    await mongoDriver();

    let pgn = await req.text();
    console.log("REQ GAME", pgn);

    const parsed = parse(pgn);

    const game = parsed[0];

    const result = game.headers?.find((header: any) => header.name === "Result")?.value;

    const user = await User.findOne({ username:  params.username });
    console.log(user);

    user.games.push(game);

    await user.save();

    return Response.json("OK", {status: 200})
}