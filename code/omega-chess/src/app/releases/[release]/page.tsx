"use client";

import useSWR from "swr";
import Spinner from "@/components/Spinner";

const Page = ({ params }: { params: { release: string } }) => {
    const fetcher = (url: string) => fetch(url).then((r) => r.json());
    const { data, isLoading } = useSWR(
        `/api/releases/${params.release}`,
        fetcher
    );

    if (data?.error)
        return (
            <div>
                Failed to load (404)
                <br />
                <p>{data?.error}</p>
            </div>
        );

    return (
        <main className="p-2">
            <h1 className="text-4xl"> Version {params.release}</h1>
            {isLoading && <Spinner />}
            <p>{data?.text}</p>
        </main>
    );
};

export default Page;
