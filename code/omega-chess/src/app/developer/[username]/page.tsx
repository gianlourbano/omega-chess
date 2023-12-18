"use client";

import Spinner from "@/components/Spinner";
import Button from "@/components/Button";
import { useSession } from "next-auth/react";
import Api from "@/components/Developer/API";
import useSWR from "swr";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Header = ({ token, username }: { token: string; username: string }) => {
    const [show, setShow] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false);
            }, 1000);
        }
    }, [copied]);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl self-center">Welcome back, {username}!</h1>
            <Button
                color="primary"
                onClick={() => setShow(!show)}
                className="self-end"
            >
                {show ? "Hide" : "Show"} token
            </Button>
            {show && (
                <div className="p-5 border-2 border-gray-500 rounded-md flex flex-col gap-1">
                    <h1 className="text-2xl">Your token</h1>
                    <motion.div className="flex flex-row gap-2">
                        <p>{token}</p>{" "}
                        {!copied ? (
                            <motion.svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                                whileHover={{ scale: 1.1, cursor: "pointer" }}
                                onClick={async () => {
                                    if ("clipboard" in navigator) {
                                        setCopied(true);
                                        return await navigator.clipboard.writeText(
                                            token
                                        );
                                    } else {
                                        setCopied(true);
                                        return document.execCommand(
                                            "copy",
                                            true,
                                            token
                                        );
                                    }
                                }}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                                />
                            </motion.svg>
                        ) : (
                            <motion.svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
                                />
                            </motion.svg>
                        )}
                    </motion.div>
                </div>
            )}
        </div>
    );
};

const PlayerRegister = ({ data, mutate }: { data: any; mutate: any }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = () => {
        // Handle form submission here
        fetch(`/api/users/${data.user.username}/developer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                description,
            }),
        })
            .catch((err) => console.log(err))
            .finally(() => {
                setName("");
                setDescription("");
                mutate();
            });
    };

    return (
        <>
            <h1 className="text-2xl">Register a new Player</h1>
            <form className="flex flex-col w-[70%]">
                <label htmlFor="name">Short Name:</label>
                <input
                    type="text"
                    className="rounded-md p-2 bg-zinc-700"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="description">Description:</label>
                <textarea
                    className="rounded-md bg-zinc-700 p-2"
                    id="description"
                    value={description}
                    maxLength={100}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </form>
            <Button
                onClick={handleSubmit}
                color={"primary"}
                className="self-start"
            >
                Submit
            </Button>
        </>
    );
};

const MiniContainer = ({
    children,
    className,
}: {
    children?: React.ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={`p-5 border-2 border-gray-500 rounded-md flex flex-col gap-1 ${className}`}
        >
            {children}
        </div>
    );
};

export default function Page({ params }: { readonly params: { readonly username: string } }) {
    const fetcher = (url: string) => fetch(url).then((r) => r.json());
    const { data, isLoading, mutate } = useSWR(
        `/api/users/${params.username}/developer`,
        fetcher
    );

    const { data: session } = useSession();

    const generateToken = async (regenerate: boolean = false) => {
        await fetch("/api/developer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: session?.user.id,
                regenerate: regenerate,
            }),
        })
            .catch((err) => console.log(err))
            .finally(() =>{ mutate()});
    };

    const deleteBot = async (name: string) => {
        await fetch(`/api/users/${data.user.username}/developer`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
            }),
        })
            .catch((err) => console.log(err))
            .finally(() => {mutate()});
    };

    if (isLoading)
        return (
            <div className="h-full w-full flex items-center justify-center">
                <Spinner />
            </div>
        );

    return (
        <div className="p-5">
            <h1 className="text-4xl flex flex-row items-center">
                <Image
                    src="/experiment.png"
                    alt="Icon"
                    height={46}
                    width={46}
                />
                Omega Chess API
            </h1>

            {data.user.developer?.token?.token ? (
                <Header
                    token={data.user.developer.token.token}
                    username={data.user.username}
                />
            ) : (
                <>
                    <p>Generate your personal API token</p>
                    <Button color="primary" onClick={() => generateToken(true)}>
                        Generate
                    </Button>
                </>
            )}
            <Api />

            <section className="grid grid-areas-dev-content gap-4 p-4 grid-cols-2">
                <MiniContainer className="grid-in-opts">
                    <PlayerRegister data={data} mutate={mutate} />
                </MiniContainer>
                <MiniContainer className="grid-in-board flex flex-col gap-2">
                    <h1 className="text-2xl">Your bots</h1>
                    {data.user.developer.customs.length === 0 && (
                        <div className="rounded-md bg-zinc-600 p-5 flex flex-row items-center">
                            <div>
                                <div className="text-lg">
                                    You have no custom bots
                                </div>
                                <div className="ml-3">
                                    Register a new bot to get started
                                </div>
                            </div>
                        </div>
                    )}
                    {data.user.developer.customs.map(
                        (custom: any) => {
                            return (
                                <div
                                    key={custom.name}
                                    className="rounded-md bg-zinc-600 p-5 flex flex-row items-center"
                                >
                                    <div>
                                        <div className="text-lg">
                                            {custom.name}
                                        </div>
                                        <div className="ml-3">
                                            {custom.description}
                                        </div>
                                    </div>
                                    <motion.div
                                        className="rounded-md bg-red-500 ml-auto"
                                        whileHover={{
                                            scale: 1.1,
                                            cursor: "pointer",
                                        }}
                                        onClick={() => deleteBot(custom.name)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </motion.div>
                                </div>
                            );
                        }
                    )}
                </MiniContainer>
                <MiniContainer className="grid-in-stats text-xl">
                    A GRAPH MAYBE?!??
                </MiniContainer>
            </section>
        </div>
    );
}
