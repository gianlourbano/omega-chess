/**
 * router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  // Validation for email and username
  if (!isValidEmail(email)) {
    return res.status(400).send('Invalid email format.');
  }
  if (!isValidUsername(username)) {
    return res.status(400).send('Invalid username format.');
  }
  if (!isValidPassword(password)) {
    return res.status(400).send('Invalid password format.');
  }

  // Check for uniqueness of username and email
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return res.status(400).send('Email already in use.');
  }
  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    return res.status(400).send('Username already in use.');
  }

  // Create a new user and save it
  const user = new User({ username, password, email});
  await user.save();
  res.status(201).send('User registered successfully');
});
 */

import User from "@/db/models/User";
import mongoDriver from "@/db/mongoDriver";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    await mongoDriver();

    const { username, password, email } = await req.json();

    const u = await User.findOne({ username });
    if (u) {
        return Response.json("Username already in use.", {status: 400});
    }

    const e = await User.findOne({ email });
    if (e) {
      return Response.json("Email already in use.", {status: 400});
    }

    const salt = await bcrypt.genSalt(10);
    //hash password with salt and bcrypt
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ username, password: hashedPassword, email, salt });

    await user.save();

    return Response.json("User registered successfully", {status: 200})
}
