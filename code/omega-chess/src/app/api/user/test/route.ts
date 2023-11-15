import mongoDriver from "@/db/mongoDriver";
import User from "@/db/models/User";

export async function GET() {
    await mongoDriver();

    const users = await User.find();

    const newUser = new User({
        email: "gianlo@gianlo.com",
        name: "Gianlo",
        picture: "https://gianlo.com"
    });

    await newUser.save();
    
    return Response.json({ message: "Hello World", "users": users });
}