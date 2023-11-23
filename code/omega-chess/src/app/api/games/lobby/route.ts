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
        return Response.json({id: old._id, whitePlayer: old.whitePlayer, blackPlayer: old.blackPlayer})
    }

    const newGame = new GameLobby({
        lobbyType: gameType,
        whitePlayer: player,
        blackPlayer: gameType==="darkboard" ? "darkboard" : null,
        lookingForPlayer: gameType!=="darkboard",
    })

    const {_id} = await newGame.save()

    return Response.json({id: _id, whitePlayer: newGame.whitePlayer, blackPlayer: newGame.blackPlayer})
}

export async function DELETE(req: Request) {
    await mongoDriver()
    const {room}: {room: string} = await req.json()
    await GameLobby.findByIdAndDelete(room)
    return Response.json("OK")
}