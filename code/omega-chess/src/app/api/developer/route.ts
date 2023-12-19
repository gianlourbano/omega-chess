import User from "@/db/models/User";
import Token from "@/db/models/Token";
import mongoDriver from "@/db/mongoDriver";

import { randomBytes } from "crypto";

// PROTECTED [developer]

export async function POST(req: Request) {

    await mongoDriver();

    const {id, regenerate } = await req.json();

    const user = await User.findById(id);

    if(user == null) {
        return Response.json({error: "User not found"}, {status: 404});
    }

    if(!regenerate) {
        const token = await Token.findOne({user: user._id});
        if(token) {
            return Response.json({token: token.token}, {status: 200});
        }
    }

    const token = randomBytes(24).toString("hex");

    const tokenDoc = new Token({
        token,
        user: user._id
    });
    await tokenDoc.save();

    user.developer = {
        token: tokenDoc._id,
    }

    await user.save();

    return Response.json({token}, {status: 200})

}
