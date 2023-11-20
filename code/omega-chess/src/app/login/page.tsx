"use client";

import CustomLink from "@/components/CustomLink";
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@mui/material";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [register, setRegister] = useState(false);

    const router = useRouter();

    const requestLogin = async (e: any) => {
        e.preventDefault();

        await signIn("login", {
            username,
            password,
            redirect: false,
        }).then((data) => {
            data?.error
                ? credentialsError(e)
                : router.push("/");
        });
    };

    const { data: session } = useSession();
    useEffect(() => {
        if (session) {
            redirect("/");
        }
    }, [session]);

    const credentialsError = (e: any) => {
        e.preventDefault();
        setError("Credentials do not match!");
        setTimeout(() => {
            setError("");
        }, 3000);
    }


    return (
        <main className="h-[calc(100vh-10rem)] flex items-center justify-center flex-col">
            <div className="mainbox">
            <h1 className="text-3xl text-center">Omega Chess</h1>
            <br/>
            <form className="flex flex-col gap-2">
                <input
                    className="text-slate-800 p-2 rounded-md"
                    id="Username"
                    type="text"
                    name="Username"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="text-slate-800 p-2 rounded-md"
                    id="Password"
                    type="password"
                    name="Password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="px-4 py-2 border rounded"
                    onClick={requestLogin}
                >
                    Login
                </button>
            </form>

            <Container className="flex flex-col gap-2 my-4 items-center">
                <CustomLink  href="/signup">Sign Up</CustomLink>
                <CustomLink  href="/">Log in as guest</CustomLink>
            </Container>
            </div>
            <div className="ErrorSpace" style={{ height: '50px', marginTop: '10px' }}>
                <AnimatePresence mode="wait">
                {error && (
                    <motion.h1
                        className="text-red-500 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1}}
                        exit={{ opacity: 0 }}
                    >
                        {error}
                    </motion.h1>
                )}
            </AnimatePresence>
            </div>
        </main>
    );
};

export default LoginPage;
