import User from "@/db/models/User";
import mongoDriver from "@/db/mongoDriver";
import bcrypt from "bcrypt";

export async function GET(
    req: Request,
    { params }: { params: { username: string } }
) {

    await mongoDriver();

    const user = await User.findOne({ username: params.username }, "username friends email scores games").populate("friends", "username email").populate("games", "_id whitePlayer blackPlayer createdAt");

    if (!user) {
        return Response.json("User not found.", { status: 404 });
    }

    return Response.json({user}, { status: 200 });
}

export async function PUT(
    req: Request,
    { params }: { params: { username: string } }
) {
    await mongoDriver();

    const { newUsername, newEmail, oldPassword, newPassword, newFriend, removeFriend, developer } = await req.json();

    if(developer) {
        const user = await User.findOne({username: params.username})
        user.role = "developer";
        await user.save();
    }

    if(newUsername) {
        const old = await User.findOne({username: newUsername})
        if(old)
            return Response.json({error: "Username already in use!"}, {status: 400})
        
        const user = await User.findOne({username: params.username})
        user.username = newUsername;
        await user.save();
    }

    if(newEmail) {
        const old = await User.findOne({email: newEmail})
        if(old)
            return Response.json({error: "Email already in use!"}, {status: 400})
        
        const user = await User.findOne({username: params.username})
        user.email = newEmail;
        await user.save();
    }

    if(newPassword && !oldPassword || oldPassword && !newPassword) {
        return Response.json({error: "Missing some fields!"}, {status: 400});
    }

    if(newPassword && oldPassword) {
        const user = await User.findOne({username: params.username})

        if(!bcrypt.compare(user.password, oldPassword))
            return Response.json({error: "Passwords do not match!"}, {status: 400})

        const salt =await bcrypt.genSalt(10);
        const newpass = await bcrypt.hash(newPassword, salt);
        user.salt = salt;
        user.password = newpass;
        await user.save();
    }

    if(newFriend) {
        if(params.username === newFriend) {
            return Response.json({error: "\"I just seen a real one and had to add him to my friends\""}, {status: 400})
        }

        const user = await User.findOne({username: params.username});

        const newf = await User.findOne({username: newFriend})

        if (!newf) {
            return Response.json({error: "User doesn't exist!"}, {status: 400})
        }

        if(user.friends.includes(newf._id) || newf.friends.includes(user._id))
            return Response.json({error: "You are already friends!"}, {status: 400})
        
        user.friends.push(newf._id);
        newf.friends.push(user._id);

        await newf.save();
        await user.save();
    }

    if(removeFriend) {

        const friend = await User.findOne({username: removeFriend})
        const user = await User.findOne({username: params.username})

        
        try {
            //remove user from friend's friends
            friend.friends = friend.friends.filter((f: any) => f.toString() !== user._id.toString())
            await friend.save();
            //remove friend from user's friends
            user.friends = user.friends.filter((f: any) => f.toString() !== friend._id.toString())
            await user.save();
        } catch (e) {
            return Response.json("Error while removing friend", {status: 500})
        }
    }

    return Response.json("OK", {status: 200})

    // prendi i dati dal body della richiesta
    // const { newUsername, newEmail, newPassword } = await req.json();

    // const user = User.findOne({ username: params.username });

    // // controlla i dati: username deve essere unico, email deve essere valida (controllo password fatto client side)

    // // cambio username
    // if (newUsername) {
    //     const u = await User.countDocuments({ username: newUsername });
    //     if (u > 0) {
    //         return Response.json("Username already in use.", { status: 400 });
    //     }

    //     // se i dati sono validi, aggiorna il database
    //     user.username = newUsername;
    // }

    // // cambio email
    // if (newEmail) {
    //     const e = await User.countDocuments({ email: newEmail });
    //     if (e) {
    //         return Response.json("Email already in use.", { status: 400 });
    //     }

    //     user.email = newEmail;
    // }

    // if (newPassword) {
    //     const salt = await bcrypt.genSalt(10);
    //     //hash password with salt and bcrypt
    //     const hashedPassword = await bcrypt.hash(newPassword, salt);

    //     user.password = hashedPassword;
    // }

    // await user.save();
    // ritorna "OK" e 200 se va tutto bene, altirmenti "ERROR" e 500 o 400
    //return Response.json("OK", { status: 200 });
}
