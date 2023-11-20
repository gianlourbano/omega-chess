import GameLobby from "@/db/models/GameLobby"
import mongoDriver from "@/db/mongoDriver"

interface GameLobbyRequestData {
    gameType: "darkboard" | "online",
    player: string,
}

export async function POST(req: Request) {
    await mongoDriver()
    const {gameType, player}: GameLobbyRequestData = await req.json()
    
    const old = await GameLobby.findOne({$or: [{"whitePlayer": player}, {"blackPlayer": player}]})

    if(old) {
        return Response.json({id: old._id})
    }

    const newGame = new GameLobby({
        lobbyType: gameType,
        whitePlayer: player,
        blackPlayer: null,
        lookingForPlayer: gameType!=="darkboard",
    })

    const {_id} = await newGame.save()

    return Response.json({id: _id})
}