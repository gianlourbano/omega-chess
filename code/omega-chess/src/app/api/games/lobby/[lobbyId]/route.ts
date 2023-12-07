import GameLobby from "@/db/models/GameLobby";
import mongoDriver from "@/db/mongoDriver";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { lobbyId: string } }
) {
    await mongoDriver();

    const lobbyData = await GameLobby.findOne({ _id: params.lobbyId });

    if (!lobbyData) {
        return Response.json({ error: "lobby not found" });
    }

    const token = await getToken({ req, secret: process.env.SECRET });

    if (!token) {
        return Response.json({ error: "not logged in" });
    }

    if (lobbyData.lobbyType === "online" && !lobbyData.lookingForPlayer) {
        if (
            !(
                lobbyData.whitePlayer === token.username ||
                lobbyData.blackPlayer === token.username
            )
        ) {
            return Response.json({ error: "not in lobby" });
        }
    }

    const join = req.nextUrl.searchParams.has("join");

    console.log("join", join);
    console.log("lookingForPlayer", lobbyData.lookingForPlayer);

    if (lobbyData.lookingForPlayer && !join) {
        //if im not already a player in the lobby, return error
        if (
            !(
                lobbyData.whitePlayer === token.username ||
                lobbyData.blackPlayer === token.username
            )
        ) {
            return Response.json({
                error: "not in lobby; did you forget ?join ?",
            });
        }
    }

    if (lobbyData.lookingForPlayer && join) {
        console.log("joining from link");

        const user = token.username;

        // join lobby if a player is vacant
        if (!lobbyData.whitePlayer) {
            lobbyData.whitePlayer = user;
        } else if (!lobbyData.blackPlayer) {
            lobbyData.blackPlayer = user;
        } else {
            return Response.json({ error: "lobby full" });
        }
        lobbyData.lookingForPlayer = false;
        await lobbyData.save();
    }

    return Response.json({
        gameType: lobbyData.gameType,
        whitePlayer: lobbyData.whitePlayer,
        blackPlayer: lobbyData.blackPlayer,
        lookingForPlayer: lobbyData.lookingForPlayer,
    });
}

