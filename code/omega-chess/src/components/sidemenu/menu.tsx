"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import CustomLink from "../CustomLink";
import { signOut, useSession } from "next-auth/react";
import Button from "../Button";
import { useEffect, useState } from "react";

interface MenuItemProps {
    title: string;
    href?: string;
    disabled?: boolean;
}

const MenuItem = (props: MenuItemProps) => {
    return (
        <motion.h1 whileHover={{ scale: 1.05 }} className="text-xl">
            <CustomLink
                disabled={props.disabled}
                href={`${props.href ? props.href : "/" + props.title}`}
            >
                {props.title}
            </CustomLink>
        </motion.h1>
    );
};

interface MenuProps {
    onOpen?: () => void;
}

const Menu = (props: MenuProps) => {
    const { data: session } = useSession();

    return (
        <motion.div
            className=" bg-zinc-900 text-slate-50 h-full sm:p-2 flex flex-col"
            onClick={props.onOpen}
        >
            <CustomLink
                className="w-full my-4 flex flex-col items-center"
                href="/"
            >
                <Image src="/pawn.png" width={100} height={100} alt="Logo" />
                <h1 className="text-3xl">Omega Chess</h1>
            </CustomLink>
            <hr />
            {session && session.user && (
                <>
                    <div className="p-4">
                        <div>Welcome back, {session?.user.username}</div>
                        <Button color="secondary" onClick={() => signOut({callbackUrl: "/login"})}>
                            Logout
                        </Button>
                    </div>
                    <hr />
                </>
            )}
            <div className="p-4 flex flex-col gap-2">
                <MenuItem title="Kriegspiel Rules" href="/kriegspiel/rules" />
                <MenuItem title="Releases" href="/releases" />
                <MenuItem title="Profile" href="/profile" />
                <MenuItem title="Login / SignUp" href="/login" />
                <MenuItem disabled title="Games" />
                <MenuItem disabled title="Leaderboard" />
                <MenuItem disabled title="Settings" />
                <MenuItem disabled title="About" />
            </div>
            <Info />
        </motion.div>
    );
};

const Info = () => {
    const [serverStatus, setServerStatus] = useState("Offline");
    const [dbStatus, setDbStatus] = useState("Offline");
    const [botStatus, setBotStatus] = useState("Offline");
    const [clientVersion, setClientVersion] = useState("0.0.0");
    
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_DB_BACKEND_BASE_URL}/healthcheck`)
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "OK") {
                    setDbStatus("Online");
                }
            }).catch(err => {});

            fetch(`${process.env.NEXT_PUBLIC_BOT_BASE_URL}/health`)
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "OK") {
                    setDbStatus("Online");
                }
            }).catch(err => {});

        fetch("/api/healthcheck").then((res) => res.json()).then((data) => {
            if (data.status === "OK") {
                setServerStatus("Online");
            }
        }).catch(err => {});

        fetch("/api/releases").then((res) => res.json()).then((data) => {
            setClientVersion(data[0].version)
        }).catch(err => {});
    }, [])

    return (
        <div className="flex flex-col text-md mt-auto">
            <div className="flex flex-row items-center"><span className={`w-1 h-[90%] rounded-sm mr-1 ${serverStatus === "Offline" ? "bg-red-600" : "bg-green-500"}`}/>Server status: {serverStatus} </div>
            <div className="flex flex-row items-center"><span className={`w-1 h-[90%] rounded-sm mr-1 ${botStatus === "Offline" ? "bg-red-600" : "bg-green-500"}`}/>Bot status: {botStatus} </div>
            <div className="flex flex-row items-center"><span className={`w-1 h-[90%] rounded-sm mr-1 ${dbStatus === "Offline" ? "bg-red-600" : "bg-green-500"}`}/>Darkboard status: {dbStatus} </div>
            <div>Client version: v{clientVersion} </div>
        </div>
    );
}

export default Menu;
