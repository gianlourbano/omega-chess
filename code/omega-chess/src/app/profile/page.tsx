"use client";

import Image from "next/image";
import Friends from "@/components/Friends";
import Edit from "./Edit";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { redirect } from "next/navigation";
import styles from "@/styles/Profile.module.css";
import useSWR from "swr";
import Spinner from "@/components/Spinner";
import CustomLink from "@/components/CustomLink";

function calculateWinRate(wins: number, losses: number, draws: number) {
    if (wins + losses + draws === 0) return 0;
    else
        return Math.round(
            ((wins + 0.5 * draws) / (wins + losses + draws)) * 100
        );
}

function ProfilePage() {
    const { data: session, status, update } = useSession();
    const fetcher = (url: string) => fetch(url).then((r) => r.json());
    const { data, isLoading } = useSWR(
        session ? `/api/users/${session?.user.username}` : null,
        fetcher
    );

    if (isLoading)
        return (
            <div className="h-full w-full flex items-center justify-center">
                {" "}
                <Spinner />{" "}
            </div>
        );

    console.log(data);

    if (session)
        return (
            <main className={`h-full w-full sm:pl-3 ${styles.container}`}>
                <div
                    className={`rounded-lg bg-zinc-700 static flex items-center justify-between sm:m-3 sm:pr-8 sm:pl-8 m-2 p-4 ${styles.profile}`}
                >
                    <div className="flex flex-row justify-left items-center">
                        <Image
                            className="rounded-md"
                            src="/board.png"
                            width={100}
                            height={100}
                            alt="board"
                        />
                        <div className="flex-col items-center justify-center pl-3 sm:pl-5">
                            <h1 className="text-4xl font-bold">
                                {" "}
                                {session?.user.username}{" "}
                            </h1>
                        </div>
                    </div>
                    <Edit />
                </div>
                <div className={`${styles.stats} sm:m-3 m-1`}>
                    <h1 className="sm:text-3xl font-bold"> Statistics </h1>
                    <div className={`flex-col justify-center pt-4`}>
                        <h1 className="text-xl">Elo: {data.user?.eloScore}</h1>
                        <div>
                        <h1 className="text-xl">
                                {" "}
                                Games: {data.user?.scores?.losses + data.user?.scores?.wins + data.user?.scores?.draws}{" "}
                            </h1>
                        </div>
                        <div>
                            <h1 className="text-xl">
                                {" "}
                                Wins: {data.user?.scores?.wins}{" "}
                            </h1>
                        </div>
                        <div>
                            <h1 className="text-xl">
                                {" "}
                                Loss: {data.user?.scores?.losses}{" "}
                            </h1>
                        </div>
                        <div>
                            <h1 className="text-xl">
                                {" "}
                                Draws: {data.user?.scores?.draws}{" "}
                            </h1>
                        </div>
                        <div>
                            <h1 className="text-xl">
                                {" "}
                                Win Rate:{" "}
                                {calculateWinRate(
                                    data.user?.scores?.wins,
                                    data.user?.scores?.losses,
                                    data.user?.scores?.draws
                                )}
                                %{" "}
                            </h1>
                        </div>
                    </div>

                    <h1 className="sm:text-3xl font-bold pt-5"> Match replays </h1>
                    <div className="overflow-y-auto pt-4">
                        {data.user.games?.reverse().map((game: any, index: number) => {
                            return (
                                <CustomLink
                                    href={`/profile/games/${game._id}`}
                                    key={index}
                                    className="flex justify-between items-center pb-3"
                                >
                                    <div className="text-md font-bold">
                                        {game.whitePlayer} - {game.blackPlayer}
                                    </div>
                                    <span className="text-gray-600">
                                        {new Date(
                                            game.createdAt
                                        ).toLocaleDateString("en-EN", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                        -
                                        {new Date(
                                            game.createdAt
                                        ).toLocaleTimeString("en-EN", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </CustomLink>
                            );
                        })}
                    </div>
                </div>
                <Friends />
            </main>
        );
    else redirect("/login");
}

export default ProfilePage;
