import GameLobby from "@/db/models/GameLobby"
import mongoDriver from "@/db/mongoDriver"

interface GameLobbyRequestData {
    gameType: "darkboard" | "online",
    player: string,
}

export async function POST(req: Request) {
    await mongoDriver()
    const {gameType, player}: GameLobbyRequestData = await req.json()
    
    //reconnection
    //if player is already in a lobby
    const old = await GameLobby.findOne({$or: [{"whitePlayer": player}, {"blackPlayer": player}]})

    if(old) {
        return Response.json({id: old._id, whitePlayer: old.whitePlayer, blackPlayer: old.blackPlayer})
    }

    //if there are open online lobbies
    if (gameType == "online") {
        //search online lobby
        const openLobbies = await GameLobby.find({lobbyType : "online", lookingForPlayer : true})
        if (openLobbies.length > 0) {
            const firstLobby = openLobbies[0]
            if (firstLobby.whitePlayer) firstLobby.blackPlayer = player
            else firstLobby.whitePlayer = player
            await firstLobby.save()
            return Response.json({id: firstLobby._id, whitePlayer: firstLobby.whitePlayer, blackPlayer: firstLobby.blackPlayer})
        }
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