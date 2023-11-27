import GameLobby from "@/db/models/GameLobby"
import mongoDriver from "@/db/mongoDriver"


export async function GET(req: Request, { params }: { params: { lobbyId: string }}) {
    await mongoDriver()

    const lobbyData = await GameLobby.findOne({ _id: params.lobbyId})

    return Response.json({
        gameType: lobbyData.gameType,
        whitePlayer: lobbyData.whitePlayer,
        blackPlayer: lobbyData.blackPlayer,
        lookingForPlayer: lobbyData.lookingForPlayer
    })
    
}