"use client";

import Image from "next/image";
import Button from "@/components/Button";
import Releases from "@/components/Releases";
import PlayDarkboardButton from "@/components/Darkboard/PlayDarkboard";
import PlayOnlineButton from "@/components/OnlineGame/PlayOnline";
import useSWR from "swr";


export default function Home() {
    
    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const { data } = useSWR(`${process.env.NEXT_PUBLIC_DB_BACKEND_BASE_URL}/num`, fetcher);
    
    return (
        <main className="h-full grid grid-cols-4 w-full p-2">
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
                        {data && `There ${Number(data.message) === 1 ? "is" : "are"} ${data.message} player${Number(data.message) === 1 ? "" : "s"} online.`}
                        <div className="flex flex-col gap-2 w-[50%] pt-2">
                            <PlayOnlineButton />
                            <PlayDarkboardButton />
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
