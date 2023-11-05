"use client";

import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import Button from "@/components/Button";
import { useState } from "react";
import { Drawer as MUIDrawer } from "@mui/material";
import Menu from "@/components/sidemenu/menu";

interface ReleaseItemProps {
    title: string;
    description: string;
    link?: string;
}

const ReleaseItem = (props: ReleaseItemProps) => (
    <div className="w-full flex flex-col gap-2 border rounded-lg p-3">
        <h1 className="text-lg">{props.title}</h1>
        <p className="text-sm">{props.description}</p>

        {props.link && <Link href={props.link}>Read more</Link>}
    </div>
);

const Releases = () => {
    const fetcher = (url: string) => fetch(url).then((r) => r.json());

    const { data, error, isLoading } = useSWR("/api/releases", fetcher);

    return (
        <div className="hidden h-full p-2 border rounded-lg sm:flex flex-col">
            <h1 className="text-3xl text-center mb-3">Releases / News</h1>
            <div>
                {isLoading && <p>Loading...</p>}
                {error && <p>Error loading releases</p>}
                {data && (
                    <div className="flex flex-col gap-3">
                        {data.map((release: any, index: number) => (
                            <ReleaseItem
                                key={index}
                                title={release.title}
                                description={release.description}
                                link={release.link}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default function Home() {
    
    const [open, setOpen] = useState(false);
    
    return (
        <main className="h-full grid grid-cols-4 w-full p-2">
            <MUIDrawer
                anchor="left"
                open={open}
                onClose={() => setOpen(false)}
            >
                <Menu onOpen={() => setOpen(false)} />
            </MUIDrawer>
            <Button color="lime" onClick={() => setOpen(true)} className="sm:hidden">Menu</Button>
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
            <Releases />
        </main>
    );
}
