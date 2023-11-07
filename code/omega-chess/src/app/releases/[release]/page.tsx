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
            <div className="flex justify-center items-center h-screen bg-zinc-900">
        <div className="text-center">
            <h1 className="text-4xl font-medium">404</h1>
            <p className="text-2xl font-medium m-6">Oops! Something went wrong</p>
            <p className="text-xl font-medium m-6">It seems the release you&apos;re looking for doesn&apos;t exist</p>
            <a href="/releases/" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Go Back</a>
        </div>
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
