"use client";

import Spinner from "@/components/Spinner";
import useSWR from "swr";
import styles from "@/styles/FriendProfile.module.css";
import Image from "next/image";

function calculateWinRate(wins: number, losses: number, draws: number) {
    if (wins + losses + draws === 0) return 0;
    else
        return Math.round(
            ((wins + 0.5 * draws) / (wins + losses + draws)) * 100
        );
}
export default function Page({ params }: { readonly params: { readonly username: string } }) {
    const fetcher = (url: string) => fetch(url).then((r) => r.json());
    const { data, error, isLoading } = useSWR(
        `/api/users/${params.username}`,
        fetcher
    );

    if (error) {
        return <div>Error 404</div>;
    }

    if (isLoading)
        return (
            <div className="h-full w-full flex items-center justify-center">
                {" "}
                <Spinner />{" "}
            </div>
        );

    return (
        <main className={`h-full w-full ${styles.container}`}>
            <div
                className={`flex items-center justify-between sm:pt-10 sm:pl-10 pt-5 pr-5 pl-5 ${styles.profile}`}
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
                            {data.user.username}{" "}
                        </h1>
                    </div>
                </div>
            </div>
            <div
                className={`sm:pt-10 sm:pl-10 pt-5 pr-5 pl-5 sm:text-5xl flex-col ${styles.stats} justify-center`}
            >
                <div className="text-xl font-bold">
                    Elo: {data.user.eloScore}
                </div>
                <div>
                    <h1 className="text-xl font-bold">
                        {" "}
                        Win Rate:{" "}
                        {calculateWinRate(
                            data.user.scores?.wins,
                            data.user.scores?.losses,
                            data.user.scores?.draws
                        )}
                        %{" "}
                    </h1>
                </div>
                <div>
                    <h1 className="text-xl font-bold">
                        {" "}
                        Wins: {data.user.scores?.wins}{" "}
                    </h1>
                </div>
                <div>
                    <h1 className="text-xl font-bold">
                        {" "}
                        Loss: {data.user.scores?.losses}{" "}
                    </h1>
                </div>
                <div>
                    <h1 className="text-xl font-bold">
                        {" "}
                        Draws: {data.user.scores?.draws}{" "}
                    </h1>
                </div>
            </div>
        </main>
    );
}
