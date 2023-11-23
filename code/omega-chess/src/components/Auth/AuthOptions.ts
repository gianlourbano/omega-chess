import User from "@/db/models/User";
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
                }, "username email password");

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

export default authOptions