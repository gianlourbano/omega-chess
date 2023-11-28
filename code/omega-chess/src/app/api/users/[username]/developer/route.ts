import User from "@/db/models/User";
import mongoose from "mongoose";
import mongoDriver from "@/db/mongoDriver";
import Token from "@/db/models/Token";
import DeveloperCustom from "@/db/models/DeveloperCustom";

export async function GET(
    req: Request,
    { params }: { params: { username: string } }
) {
    await mongoDriver();

    const user = await User.findOne(
        { username: params.username },
        "username email developer"
    )
        .populate({ path: "developer.token", model: Token })
        .populate({ path: "developer.customs", model: DeveloperCustom });

    if (!user) {
        return Response.json("User not found.", { status: 404 });
    }

    return Response.json({ user }, { status: 200 });
}

export async function POST(
    req: Request,
    { params }: { params: { username: string } }
) {
    await mongoDriver();

    const { name, description } = await req.json();

    if (!name) {
        return Response.json("Name is required.", { status: 400 });
    }

    const creatingUser = await User.findOne(
        { username: params.username },
        "developer _id"
    );

    try {
        const newdevbot = await DeveloperCustom.create({
            name,
            description,
            developer: creatingUser._id,
        });

        await newdevbot.save();
        creatingUser.developer.customs.push(newdevbot._id);
        await creatingUser.save();
    } catch (e) {
        return Response.json(e, { status: 400 });
    }

    return Response.json("OK", { status: 200 });
}

export async function DELETE(
    req: Request,
    { params }: { params: { username: string } }
) {
    await mongoDriver();

    const { name } = await req.json();

    if (!name) {
        return Response.json("Name is required.", { status: 400 });
    }

    const creatingUser = await User.findOne(
        { username: params.username },
        "developer _id"
    );

    const devbot = await DeveloperCustom.findOneAndDelete({
        name,
        developer: creatingUser._id,
    });

    if (!devbot) {
        return Response.json("Devbot not found.", { status: 404 });
    }

    const up = await User.updateOne(
        { username: params.username },
        { $pull: { "developer.customs": devbot._id } }
    );

    if (!up) {
        return Response.json("Devbot not found.", { status: 404 });
    }

    return Response.json("OK", { status: 200 });
}
