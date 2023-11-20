import User from "@/db/models/User";
import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import mongoDriver from "@/db/mongoDriver";

const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },

    pages: {
        signIn: "/login",
    },

    callbacks: {
        async jwt({ token, user, session }) {
            // the processing of JWT occurs before handling sessions.

            if (user) {
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.accessTokenExpires = user.accessTokenExpires;
                token.id = user.id;
                token.username = user.username;
                token.email = user.email;
            }

            return token;
        },

        //  The session receives the token from JWT
        async session({ session, token, user }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    accessToken: token.accessToken as string,
                    refreshToken: token.refreshToken as string,
                    id: token.id,
                    username: token.username,
                    email: token.email,
                    
                },
                error: token.error,
            };
        },
    },

    providers: [
        CredentialsProvider({
            id: "login",
            name: "Credentials",
            credentials: {
                username: {
                    label: "username",
                    type: "text",
                    placeholder: "jsmith",
                },
                email: { label: "email", type: "text" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials, req) {
                if (!credentials?.username || !credentials.password) {
                    return null;
                }

				await mongoDriver();

                const user = await User.findOne({
                    username: credentials.username,
                });

                if (!user) {
                    //user not found in database

                    return null;
                }

                if (!bcrypt.compare(credentials.password, user.password)) {
                    //wrong password

                    return null;
                }

                const actualUser = {
                    username: user.username,
                    id: user._id,
                    email: user.email,
					accessToken: "",
					refreshToken: "",
					accessTokenExpires: 0,
                };

				console.log("User: " ,  actualUser);

                return actualUser;
            },
        }),
    ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

/**
 * SQUEALER GIANLO
 * 
 * router.post("/login", async (req, res) => {
    const user = await usersDB.searchUserByName(req.body.username);

    if (!user) {
        res.status(401).json({
            ok: false,
            error: "Username not found",
        });
        return;
    }

    if (!bcrypt.compare(req.body.password, user.password)) {
        res.status(400).json({
            ok: false,
            error: "Wrong password",
        });
        return;
    }

    // what im sending to the session
    const actualUser = {
        name: user.name,
        id: user._id,
        role: user.role,
    };
    res.status(200).json(actualUser);
});
 * 
 * 
 */

/*  
    //compose
    environment:
      JWT_SECRET: M+vXea86Qr2EpT3mvUJg0bcLcvVoZ5GpTPlTf0Isfeg=


const { isValidEmail, isValidUsername, isValidPassword, isUniqueEmail, isUniqueUsername, calculateInitialQuota } = require('./utils.js'); // Adjust the path as necessary
const { authenticateToken } = require('./middleware.js'); // Adjust the path as necessary


const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('./mongo.js'); // Aggiorna con il percorso corretto

const router = express.Router();
const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET; // Sostituisci con una chiave segreta

router.post('/register', async (req, res) => {
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

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let user;
    if (username) {
      user = await User.findOne({ username });
    } else if (email) {
      user = await User.findOne({ email });
    } else {
      return res.status(400).send('Username or email is required');
    }

    if (!user) {
      return res.status(401).send('User not found');
    }

    // Rimuovi i log delle password in produzione per motivi di sicurezza
    console.log('Submitted password:', password);
    console.log('Stored hashed password:', user.password);

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).send('Invalid credentials');
    }

    if (!jwtSecret) {
      console.error('JWT secret is not defined');
      return res.status(500).send('Internal server error');
    }

    const token = jwt.sign({ userID: user._id }, jwtSecret);
    res.send({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Internal server error');
  }
});

router.put('/profile', authenticateToken, async (req, res) => {
  const { userID } = req.user;
  const { newEmail, newUsername, newPassword } = req.body;
  let messages = [];
  let isUpdated = false;

  try {
      const user = await User.findById(userID);
      if (!user) {
          return res.status(404).send('User not found');
      }

      // Email update logic
      if (newEmail) {
          if (!isValidEmail(newEmail)) {
              messages.push('Invalid email format.');
          } else {
              const emailIsUnique = await isUniqueEmail(newEmail, userID);
              if (!emailIsUnique) {
                  messages.push('Email already in use by another user.');
              } else {
                  user.email = newEmail;
                  isUpdated = true;
                  messages.push('Email updated successfully.');
              }
          }
      }

      // Username update logic
      if (newUsername) {
          if (!isValidUsername(newUsername)) {
              messages.push('Invalid username format.');
          } else {
              const usernameIsUnique = await isUniqueUsername(newUsername, userID);
              if (!usernameIsUnique) {
                  messages.push('Username already in use by another user.');
              } else {
                  user.username = newUsername;
                  isUpdated = true;
                  messages.push('Username updated successfully.');
              }
          }
      }

      // Password update logic
      if (newPassword) {
          if (isValidPassword(newPassword)) {
              user.password = newPassword;
              user.markModified('password');
              isUpdated = true;
              messages.push('Password updated successfully.');
          } else {
              messages.push('Invalid password format.');
          }
      }

      // Finalize and save updates
      if (isUpdated) {
          await user.save();
          messages.push('Profile updated successfully. Please use your new credentials for the next login.');
      } else {
          messages.push('No updates were made to the profile.');
      }

      res.send(messages.join('\n'));
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).send('Error updating profile: ' + error.message);
  }  
});

router.get('/charquota', authenticateToken, async (req, res) => {
  const { userID } = req.user;

  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).send('User not found');
    }

    res.json({ characterQuota: user.characterQuota });
  } catch (error) {
    console.error('Error fetching character quota:', error);
    res.status(500).send('Internal server error');
  }
});


module.exports = router;
module.exports.authenticateToken = authenticateToken;

const validator = require('validator');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) {
        console.error('JWT Error:', err);
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
};

function isValidEmail(email) {
    return validator.isEmail(email);
}
  
function isValidPassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialCharacters = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Log di debug per verificare quali condizioni falliscono
    console.log(`Password Validation: 
        Length >= ${minLength}: ${password.length >= minLength},
        Upper Case: ${hasUpperCase},
        Lower Case: ${hasLowerCase},
        Numbers: ${hasNumbers},
        Special Characters: ${hasSpecialCharacters}`);

    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialCharacters;
}


function isValidUsername(username) {
    return validator.isAlphanumeric(username);
}

async function isUniqueUsername(username, userId = null) {
    const users = await User.find({ username });
    const nonUniqueUser = users.find((user) => user._id !== userId); // Check for inequality instead of strict non-equality
    return !nonUniqueUser;
}

async function isUniqueEmail(email, userId = null) {
    const users = await User.find({ email });
    const nonUniqueUser = users.find((user) => user._id !== userId); // Check for inequality instead of strict non-equality
    return !nonUniqueUser;
}

*/
