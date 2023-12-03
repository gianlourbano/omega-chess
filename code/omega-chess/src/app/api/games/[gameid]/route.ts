import Game from "@/db/models/Game";
import mongoDriver from "@/db/mongoDriver";

export const GET = async (req: Request, { params }: { params: { gameid: string }}) => {
  await mongoDriver()
  
  const game = await Game.findOne({_id: params.gameid})
    if (!game) {
        return Response.json({ error: "Game not found" }, { status: 404});
    }
  return Response.json(game, { status: 200});
}