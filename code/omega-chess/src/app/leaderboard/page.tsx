"use client";

import CustomLink from "@/components/CustomLink";
import Spinner from "@/components/Spinner";
import { useEffect, useState } from "react";

export default function Page() {
    const [data, setData] = useState<any>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/users/leaderboard")
            .then((res) => res.json())
            .then((res) => {
                setData(res);
                setIsLoading(false);
            })
            .catch((err) => setError("Error loading data. \n" + err));
    });

    if (isLoading)
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Spinner />
            </div>
        );

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <main className="flex flex-col items-center py-8 px-4 md:px-6">
            <h1 className="text-3xl font-semibold mb-6">Leaderboard</h1>
            <div className="p-5 rounded-md bg-zinc-600 w-full max-w-3xl divide-y divide-gray-200 dark:divide-gray-600">
                <h2 className="text-xl font-medium">Top Players</h2>
                {data &&
                    data.map((user: any, index: number) => {
                        return (
                            <div className="flex items-center py-3" key={user.username}>
                                <div>#{index + 1}</div>
                                <div className="ml-4 flex-1">
                                    <CustomLink
                                        className="text-lg font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                                        href={`users/${user.username}`}
                                    >
                                        {user.username}
                                    </CustomLink>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Rating: {user.eloScore}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </main>
    );
}
