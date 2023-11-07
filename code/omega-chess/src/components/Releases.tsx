

import Link from "next/link";
import useSWR from "swr";
import CustomLink from "./CustomLink";


interface ReleaseItemProps {
    title: string;
    description: string;
    link?: string;
}

const ReleaseItem = (props: ReleaseItemProps) => (
    <div className="w-full flex flex-col gap-2 bg-zinc-700 rounded-lg p-3">
        <h1 className="text-2xl">{props.title}</h1>
        <p className="text-md">{props.description}</p>

        {props.link && <CustomLink href={props.link} className="self-start text-md bg-zinc-800 p-3 rounded-md">Read more</CustomLink>}
    </div>
);

const Releases = () => {
    const fetcher = (url: string) => fetch(url).then((r) => r.json());

    const { data, error, isLoading } = useSWR("/api/releases", fetcher);

    return (
        <div className="h-full p-2 flex flex-col">
            <h1 className="text-4xl mb-3">Releases / News</h1>
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

export default Releases;