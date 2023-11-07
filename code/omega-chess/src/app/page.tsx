"use client";

import Image from "next/image";
import Button from "@/components/Button";
import Releases from "@/components/Releases";
import { useState } from "react";
import { Drawer as MUIDrawer } from "@mui/material";
import Menu from "@/components/sidemenu/menu";

export default function Home() {
    const [open, setOpen] = useState(false);

    return (
        <main className="h-full grid grid-cols-4 w-full p-2">
            <MUIDrawer anchor="left" open={open} onClose={() => setOpen(false)}>
                <Menu onOpen={() => setOpen(false)} />
            </MUIDrawer>
            <Button
                color="lime"
                onClick={() => setOpen(true)}
                className="sm:hidden"
            >
                Menu
            </Button>
            <div className="col-span-4 sm:col-span-3">
                <div className="flex flex-col sm:flex-row justify-evenly items-center w-full p-6">
                    <Image
                        src="/board.png"
                        width={400}
                        height={400}
                        alt="board"
                    />
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-4xl text-center">Omega Chess</h1>
                        <p className="text-center mb-8">
                            Where are the opponent pieces? <br />
                            The more you fuck around the more you find out!
                        </p>
                        <div className="flex flex-col gap-2 w-[50%]">
                            <Button color="lime" disabled>
                                Play Online
                            </Button>
                            <Button color="sky" link="/kriegspiel">
                                Play Computer
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hidden sm:block">
                <Releases />
            </div>
        </main>
    );
}
