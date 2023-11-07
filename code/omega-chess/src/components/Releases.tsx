

import Link from "next/link";
import useSWR from "swr";


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

export default Releases;