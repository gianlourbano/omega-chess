import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import useSWR from "swr";
import Spinner from "../Spinner";

const Example = ({ example, language }: { example: string, language: string }) => {
    const fetcher = async (url: string) =>
        fetch(url)
            .then((r) => r.json())
            .then((r) => {
                if (r.error) throw new Error(r.error);
                return r;
            });

    const { data, isLoading, error } = useSWR(
        `/api/readfile/${example}`,
        fetcher
    );

    if (error)
        return (
            <p className="p-2 rounded-md bg-red-700 self-start">
                Error: {error.message}
            </p>
        );

    if (isLoading)
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Spinner />
            </div>
        );

    return (
        <section>
            <h1 className="text-2xl">{data.fileMetadata.title}</h1>
            <p>{data.fileMetadata.description}</p>
            <SyntaxHighlighter
                language={language}
                style={tomorrow}
                customStyle={{ borderRadius: "1rem" }}
            >
                {data.content}
            </SyntaxHighlighter>
        </section>
    );
};

export default Example;
