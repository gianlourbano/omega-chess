import Link from "next/link";
import useSWR from "swr";
import CustomLink from "./CustomLink";
import Image from "next/image";

interface ReleaseItemProps {
    title: string;
    description: string;
    link?: string;
    new?: boolean;
}

const ReleaseItem = (props: ReleaseItemProps) => {
    const newClassname = "bg-green-500 text-white rounded-md p-1 text-sm";
    const regularClassname = "bg-zinc-700";

    return (
        <div
            className={`w-full flex flex-col gap-2 ${
                props.new ? newClassname : regularClassname
            } rounded-lg p-3`}
        >
            <h1 className="text-2xl flex flex-row items-center gap-1">
                {props.new && (
                    <Image src="/crown.png" alt="new" height={32} width={32} />
                )}
                {props.title}
            </h1>
            <p className="text-md">{props.description}</p>

            {props.link && (
                <CustomLink
                    href={props.link}
                    className="self-start text-md bg-zinc-800 p-3 rounded-md"
                >
                    Read more
                </CustomLink>
            )}
        </div>
    );
};

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
                                new={index === 0}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Releases;
