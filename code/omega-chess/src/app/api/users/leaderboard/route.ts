import User from "@/db/models/User";
import mongoDriver from "@/db/mongoDriver";

export  async function GET() {
    await mongoDriver();

    const users = await User.find({}, "username eloScore").limit(10).sort("-eloScore")
    return Response.json(users)
}