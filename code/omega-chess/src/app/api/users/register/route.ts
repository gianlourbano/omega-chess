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

import User from "@/db/models/User"

export async function POST(req: Request) {
    const {username, password, email} = req.json();

    const u = await User.findOne({})

}