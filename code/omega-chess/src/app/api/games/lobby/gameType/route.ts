import GameLobby from "@/db/models/GameLobby"
import mongoDriver from "@/db/mongoDriver"


export async function GET(req: Request) {
    await mongoDriver()
    const {room}: {room: string} = await req.json()

    const lobby = await GameLobby.findById(room)
    if (lobby) {
        return Response.json(lobby.gameType)
    }
    return "NOTFOUND"
}