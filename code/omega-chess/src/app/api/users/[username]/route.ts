import User from "@/db/models/User";
import mongoDriver from "@/db/mongoDriver";
import bcrypt from "bcrypt";

export async function GET(
    req: Request,
    { params }: { params: { username: string } }
) {

    await mongoDriver();

    const user = await User.findOne({ username: params.username }, "username friends email").populate("friends", "username email");

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

    const { newUsername, newEmail, oldPassword, newPassword } = await req.json();

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
