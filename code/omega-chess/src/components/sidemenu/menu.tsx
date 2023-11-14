"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import CustomLink from "../CustomLink";

interface MenuItemProps {
    title: string;
    href?: string;
    disabled?: boolean;
}

const MenuItem = (props: MenuItemProps) => {
    return (
        <motion.h1 whileHover={{ scale: 1.05 }} className="text-xl">
            <CustomLink disabled={props.disabled} href={`${props.href ? props.href :  "/" + props.title}`}>{props.title}</CustomLink>
        </motion.h1>
    );
};

interface MenuProps {
    onOpen?: () => void;
}

const Menu = (props: MenuProps) => {
    return (
        <motion.div className=" bg-zinc-900 text-slate-50 h-full sm:p-2 flex flex-col" onClick={props.onOpen} >
            <CustomLink className="w-full my-4 flex flex-col items-center" href="/">
                <Image src="/pawn.png" width={100} height={100} alt="Logo" />
                <h1 className="text-3xl">Omega Chess</h1>
            </CustomLink>
            <hr />
            <div className="p-4 flex flex-col gap-2">
                <MenuItem title="Kriegspiel Rules" href="/kriegspiel/rules"/>
                <MenuItem title="Releases" href="/releases"/>
                <MenuItem title="Profile" href="/profile"/>
                <MenuItem title="Login / SignUp" href="/login"/>
                <MenuItem disabled title="Games" />
                <MenuItem disabled title="Leaderboard" />
                <MenuItem disabled title="Settings" />
                <MenuItem disabled title="About" />
            </div>
        </motion.div>
    );
};

export default Menu;
